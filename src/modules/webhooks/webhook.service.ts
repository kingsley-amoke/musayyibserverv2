import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { WalletService } from '../wallet/wallet.service';
import { TransactionService } from '../transactions/transaction.service';
import { CustomError } from '../../common/utils/custom-error.utils';
import { CustomSuccess } from '../../common/utils/custom-success.utils';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { MonnifyWebhookEvent } from './account.dto';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class WebhookService {
  constructor(
    private usersService: UsersService,
    private walletService: WalletService,
    private transactionService: TransactionService,
    private analyticsService: AnalyticsService,
    private httpService: HttpService,
  ) {}

  private tokenCache: { token: string; expiresAt: number } | null = null;

  // verifyWebhook(eventData:MonnifyWebhookEvent, signature: string) {
  //   const hash = crypto
  //     .createHmac('sha512', process.env.MONNIFY_SECRET_KEY!)
  //     .update()
  //     .digest('hex');

  //   return hash === signature;
  // }

  async getToken() {
    const now = Date.now();
    if (this.tokenCache && this.tokenCache.expiresAt > now) {
      return this.tokenCache.token;
    }
    const base64Credentials = Buffer.from(
      `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`,
    ).toString('base64');

    const response = await firstValueFrom(
      this.httpService.post(
        `${process.env.MONNIFY_BASE_URL}/api/v1/auth/login`,
        {},
        {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        },
      ),
    );

    const token = response.data.responseBody?.accessToken;

    this.tokenCache = {
      token,
      expiresAt: now + 50 * 60 * 1000,
    };

    return token;
  }

  async fundAccount(eventData: MonnifyWebhookEvent, signature: string) {
    // const isValid = this.verifyWebhook(rawBody, signature);

    // if (!isValid) {
    //   throw CustomError.unAuthorizedError;
    // }

    // const eventData: MonnifyWebhookEvent = JSON.parse(rawBody);
    console.log('Processing webhook:', eventData.transactionReference);

    if (!eventData?.customer?.email) {
      throw CustomError.badRequestError('Invalid webhook payload');
    }
    if (eventData.currency !== 'NGN') {
      throw CustomError.badRequestError('Invalid currency');
    }

    if (!eventData.amountPaid || eventData.amountPaid <= 0) {
      throw CustomError.badRequestError('Invalid amount');
    }

    console.log('Processing webhook:', eventData.transactionReference);

    try {
      const user = await this.usersService.findUserByEmail(
        eventData.customer.email,
      );

      if (!user) throw CustomError.notFoundError('User not found');

      if (eventData.paymentStatus !== 'PAID') {
        return CustomSuccess.success('Ignoring non-success payment');
      }

      const existing = await this.transactionService.findTransactionByReference(
        eventData.transactionReference,
      );

      if (existing?.status === 'success') {
        return CustomSuccess.success('Already processed');
      }

      if (!existing) {
        this.transactionService
          .createReference(
            eventData.transactionReference,
            user.id!,
            eventData.amountPaid,
            'pending',
          )
          .catch((e) => console.log('Unable to update tx status:', e.message));
      } else if (existing.status === 'failed') {
        this.transactionService
          .updateReferenceStatus(eventData.transactionReference, 'pending')
          .catch((e) => console.log('Unable to update tx status:', e.message));
      }

      const { newBalance, oldBalance } = await this.walletService.credit(
        user.id!,
        eventData.amountPaid,
      );

      this.transactionService
        .updateReferenceStatus(eventData.transactionReference, 'success')
        .catch((e) => console.log('Unable to update tx status:', e.message));

      this.analyticsService
        .recordInflow(eventData.amountPaid)
        .catch((e) => console.log('Analytics error:', e.message));

      const res = await this.transactionService.createTransaction(
        user.id!,
        eventData.transactionReference,
        {
          amount: eventData.amountPaid,
          newBalance: newBalance,
          oldBalance: oldBalance,
          reference: eventData.transactionReference,
          paymentMethod: eventData.paymentMethod,
          date: Date.now().toString(),
          type: 'deposit',
          status: 'success',
        },
      );

      return CustomSuccess.success(res);
    } catch (error) {
      const existing = await this.transactionService.findTransactionByReference(
        eventData.transactionReference,
      );

      if (existing?.status !== 'success') {
        this.transactionService
          .updateReferenceStatus(eventData.transactionReference, 'failed')
          .catch((e) => console.log('Unable to update tx status:', e.message));
      }

      throw error;
    }
  }

  async createAccount(userId: string, name: string, email: string) {
    const token = await this.getToken();

    if (!token) {
      throw CustomError.unAuthorizedError;
    }

    const body = {
      accountReference: email,
      accountName: `${name} Reserved Account`,
      currencyCode: 'NGN',
      contractCode: process.env.MONNIFY_CONTRACT_CODE,
      customerEmail: email,
      bvn: process.env.MONNIFY_BVN,
      customerName: name,
      getAllAvailableBanks: true,
    };
    try {
      const result = await firstValueFrom(
        this.httpService.post(
          `${process.env.MONNIFY_BASE_URL}/api/v2/bank-transfer/reserved-accounts`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      if (!result.data.requestSuccessful) {
        throw CustomError.serverError('Failed to create reserved account');
      }

      const res = result.data.responseBody;

      this.usersService
        .updateUser(userId, { accounts: res.accounts })
        .catch((e) => console.log('Unable to update user:', e.message));

      return CustomSuccess.created(res.accounts);
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw CustomError.serverError('Failed to create reserved account');
    }
  }
}
