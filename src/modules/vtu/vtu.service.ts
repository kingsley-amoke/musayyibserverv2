import { WalletService } from '../wallet/wallet.service';
import { VendorService } from './vendor.service';
import { Injectable } from '@nestjs/common';
import { TransactionService } from '../transactions/transaction.service';
import { UsersService } from '../users/users.service';
import { CustomError } from 'src/common/utils/custom-error.utils';
import {
  CustomSuccess,
  successResponse,
} from 'src/common/utils/custom-success.utils';
import { PlansService } from '../plans/plans.service';
import { getNetworkById } from 'src/common/utils/get-network-by-id';
import { Transaction } from '../transactions/transaction.dto';
import { AnalyticsService } from '../analytics/analytics.service';

// modules/vtu/vtu.service.ts
@Injectable()
export class VtuService {
  constructor(
    private walletService: WalletService,
    private vendorService: VendorService,
    private transactionService: TransactionService,
    private planService: PlansService,
    private analyticsService: AnalyticsService,
  ) {}

  async buyData(
    userId: string,
    { amount, networkId, phone, planId },
  ): Promise<successResponse> {
    const plan = await this.planService.getPlanById(planId);
    const transactionId = `data${phone}${amount}${Date.now().toString()}`;
    // 1. Deduct balance FIRST (atomic)
    console.log('deducting user ....');
    const { newBalance, oldBalance } = await this.walletService.deduct(
      userId,
      amount,
    );

    // 2. Create transaction (PENDING)
    console.log('creating pending transaction ....');
    await this.transactionService.createTransaction(userId, transactionId, {
      amount,
      newBalance,
      oldBalance,
      reference: '',
      status: 'pending',
      type: 'data',
      phone,
      networkId,
      network: getNetworkById(networkId),
      plan: '',
      planId,

      date: Date.now().toString(),
    });

    try {
      // 3. Call vendor
      console.log('calling vendor...');
      const vendorRes = await this.vendorService.buyData(
        networkId,
        planId,
        phone,
      );

      // 4. Mark SUCCESS
      console.log('updating successful transaction ...');
      const tx = await this.transactionService.updateTransactionStatus(
        userId,
        transactionId,
        {
          status: 'success',
          reference: vendorRes.reference,
          plan: vendorRes.plan,
        },
      );

      const vendorAmount = Number(vendorRes.amount) || 0;
      const profit = Math.max(0, amount - vendorAmount);

      this.analyticsService
        .recordOutflow(amount, profit)
        .catch((e) => console.log('Analytics error', e.message));

      return CustomSuccess.success(tx);
    } catch (error) {
      // 5. REFUND user
      console.log('transaction failed! refunding user');
      await this.walletService.credit(userId, amount);

      // 6. Mark FAILED

      console.log(plan.name);
      this.transactionService
        .updateTransactionStatus(userId, transactionId, {
          plan: plan.name,
          newBalance: oldBalance,
          status: 'failed',
        })
        .catch((e) => console.log('Unable to update tx status:', e.message));
      console.log('Done!');
      return CustomSuccess.failed('updated');
    }
  }
  async buyAirtime(userId: string, { networkId, phone, amount }) {
    const transactionId = `airtime${phone}${amount}${Date.now().toString()}`;
    // 1. Deduct balance FIRST (atomic)
    const { newBalance, oldBalance } = await this.walletService.deduct(
      userId,
      amount,
    );

    // 2. Create transaction (PENDING)
    this.transactionService
      .createTransaction(userId, transactionId, {
        amount: amount,
        newBalance,
        oldBalance,
        reference: '',
        status: 'success',
        type: 'airtime',
        network: '',
        plan: '',
        phone,
        date: Date.now().toString(),
      })
      .catch((e) => console.log('Unable to update tx status:', e.message));

    try {
      console.log('calling vendor ....');
      const {
        reference,
        plan,
        network,
        amount: planAmount,
      } = await this.vendorService.buyAirtime(networkId, phone, amount);

      //Deduct balance
      console.log('Charging user ...');

      // update transaction
      console.log('Creating transaction ...');
      this.transactionService.updateTransactionStatus(userId, transactionId, {
        amount,
        reference,
        status: 'success',
        network,
        plan,
      });
      const profit = amount - planAmount;

      this.analyticsService
        .recordOutflow(amount, profit)
        .catch((e) => console.log('Analytics error:', e.message));

      console.log('Done!!');

      return CustomSuccess.success('updated');
    } catch (error) {
      // 5. REFUND user
      this.walletService.credit(userId, amount);

      // 6. Mark FAILED

      this.transactionService
        .updateTransactionStatus(userId, transactionId, {
          status: 'failed',
          newBalance: oldBalance,
        })
        .catch((e) => console.log('Unable to update tx status:', e.message));

      throw error;
    }
  }

  async subscribeElectricity(
    userId: string,
    discoId: number,
    meterNumber: number,
    meterType: number,
    amount: number,
  ) {
    const transactionId = `electricity${meterNumber}${amount}${Date.now().toString()}`;
    //deduct balance
    const { oldBalance, newBalance } = await this.walletService.deduct(
      userId,
      amount,
    );

    //create pending transaction
    await this.transactionService.createTransaction(userId, transactionId, {
      amount,
      newBalance,
      oldBalance,
      reference: '',
      status: 'pending',
      type: 'electricity',
      phone: meterNumber.toString(),
      date: Date.now().toString(),
    });
    try {
      //call vendor
      const res = await this.vendorService.subscribeElectricity(
        discoId,
        meterNumber,
        amount,
        meterType,
      );
      //update success transaction
      await this.transactionService.updateTransactionStatus(
        userId,
        transactionId,
        { status: 'success' },
      );
    } catch (error) {
      //refund user
      await this.walletService.credit(userId, amount);
      //failed transaction
      await this.transactionService.updateTransactionStatus(
        userId,
        transactionId,
        { status: 'failed' },
      );
      //throw error
      throw error;
    }
  }

  async subscribeCable(
    userId: string,
    cableId: number,
    amount: number,
    smartCardNumber: number,
    planId: number,
  ) {
    const transactionId = `cable${smartCardNumber}${amount}${Date.now().toString()}`;
    //deduct balance
    const { oldBalance, newBalance } = await this.walletService.deduct(
      userId,
      amount,
    );

    //create pending transaction
    await this.transactionService.createTransaction(userId, transactionId, {
      amount,
      newBalance,
      oldBalance,
      reference: '',
      status: 'pending',
      type: 'cable',
      phone: smartCardNumber.toString(),
      date: Date.now().toString(),
    });
    try {
      //call vendor
      const res = await this.vendorService.subscribeCable(
        cableId,
        amount,
        smartCardNumber,
        planId,
      );
      //update success transaction
      await this.transactionService.updateTransactionStatus(
        userId,
        transactionId,
        { status: 'success' },
      );
    } catch (error) {
      //refund user
      await this.walletService.credit(userId, amount);
      //failed transaction
      await this.transactionService.updateTransactionStatus(
        userId,
        transactionId,
        { status: 'failed' },
      );
      //throw error
      throw error;
    }
  }
  async validateIUC(cableId: number, smartCardNumber: number) {
    try {
      return await this.vendorService.validateIUC(cableId, smartCardNumber);
    } catch (error) {
      throw error;
    }
  }

  async validateMeter(meterNumber: number, discoId: number, meterType: number) {
    try {
      return await this.vendorService.validateMeter(
        meterNumber,
        discoId,
        meterType,
      );
    } catch (error) {
      throw error;
    }
  }
  async sendBulkSMS(req): Promise<boolean> {
    //process request
    console.log(req.body);
    return true;
  }

  async generateRechargePin(
    userId: string,
    networkId: string,
    networkAmount: number,
    quantity: number,
    nameOnCard: string,
  ) {
    //deduct balance

    //create pending transaction
    try {
      //call vendor
      //update success transaction
    } catch (error) {
      //refund user
      //failed transaction
      //throw error
    }
  }

  async generateResultChecker(
    userId: string,
    examName: string,
    quantity: number,
    amount: number,
  ) {
    const transactionId = `resultchecker${examName}${amount}${Date.now().toString()}`;
    //deduct balance
    const { oldBalance, newBalance } = await this.walletService.deduct(
      userId,
      amount,
    );

    //create pending transaction
    await this.transactionService.createTransaction(userId, transactionId, {
      amount,
      newBalance,
      oldBalance,
      reference: '',
      status: 'pending',
      type: 'resultchecker',
      phone: '',
      date: Date.now().toString(),
    });
    try {
      //call vendor
      const res = await this.vendorService.generateResultChecker(
        examName,
        quantity,
      );
      //update success transaction
      await this.transactionService.updateTransactionStatus(
        userId,
        transactionId,
        { status: 'success' },
      );
    } catch (error) {
      //refund user
      await this.walletService.credit(userId, amount);
      //failed transaction
      await this.transactionService.updateTransactionStatus(
        userId,
        transactionId,
        { status: 'failed' },
      );
      //throw error
      throw error;
    }
  }

  async getAdmin() {
    try {
      return await this.vendorService.getUser();
    } catch (error) {
      throw error;
    }
  }
}
