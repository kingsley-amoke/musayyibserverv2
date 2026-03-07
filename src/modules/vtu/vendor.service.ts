import { Injectable } from '@nestjs/common';
import { CustomError } from 'src/common/utils/custom-error.utils';
import { VendorConfig } from 'src/config/vendor.config';
import { VendorResponse } from './vendor.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AdminBank, AdminUser } from '../admin/admin.dto';

// modules/vtu/vendor.service.ts
@Injectable()
export class VendorService {
  constructor(
    private config: VendorConfig,
    private httpService: HttpService,
  ) {}

  getHeaders = () => ({
    Authorization: `Token ${this.config.apiKey}`,
    'Content-Type': 'application/json',
  });

  async buyData(
    networkId: number,
    planId: number,
    phone: string,
  ): Promise<VendorResponse> {
    //process request
    const body = {
      network: networkId,
      mobile_number: phone,
      plan: planId,
      Ported_number: true,
    };

    const headers = this.getHeaders();
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.config.baseUrl}/data/`, body, {
          headers,
        }),
      );

      console.log(data);

      console.log('response from vendor');

      if (data.Status != 'successful') throw CustomError.axiosError(data);

      return {
        reference: data.ident,
        network: data.plan_network,
        plan: data.plan_name,
        amount: data.amount,
      };
    } catch (error) {
      throw CustomError.serverError(
        error?.response?.data?.message || error.message,
      );
    }
  }

  async buyAirtime(
    networkId: number,
    phone: string,
    amount: number,
  ): Promise<VendorResponse> {
    //process request

    const body = {
      network: networkId,
      amount,
      mobile_number: phone,
      Ported_number: true,
      airtime_type: 'VTU',
    };

    // send api request
    const headers = this.getHeaders();

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.config.baseUrl}/topup/`, body, {
          headers,
        }),
      );

      if (data.Status != 'successful') throw CustomError.axiosError(data);

      return {
        reference: data.ident,
        network: data.plan_network,
        plan: data.airtime_type,
        amount: data.amount,
      };
    } catch (error) {
      throw CustomError.serverError(
        error?.response?.data?.message || error.message,
      );
    }
  }
  async subscribeElectricity(
    discoId: number,
    meterNumber: number,
    amount: number,
    meterType: number,
  ): Promise<boolean> {
    //process request
    const body = {
      disco_name: discoId,
      meter_number: meterNumber,
      amount,
      MeterType: meterType,
    };

    const headers = this.getHeaders();
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.config.baseUrl}/billpayment/`, body, {
          headers,
        }),
      );

      if (data.status !== 200) throw CustomError.axiosError(data);

      return true;
    } catch (error) {
      throw CustomError.serverError(
        error?.response?.data?.message || error.message,
      );
    }
  }

  async subscribeCable(
    cableId: number,
    amount: number,
    smartCardNumber: number,
    planId: number,
  ): Promise<boolean> {
    //process request
    const body = {
      cablename: cableId,
      cableplan: planId,
      amount,
      smart_card_number: smartCardNumber,
    };

    try {
      const headers = this.getHeaders();
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.config.baseUrl}/cablesub/`, body, {
          headers,
        }),
      );

      if (data.status !== 200) throw CustomError.axiosError(data);

      return true;
    } catch (error) {
      throw CustomError.serverError(error.message);
    }
  }
  async validateIUC(
    cableId: number,
    smartCardNumber: number,
  ): Promise<boolean> {
    console.log('validating');
    const headers = this.getHeaders();
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.config.baseUrl}/validateiuc?smart_card_number=${smartCardNumber}&cablename=${cableId}`,
          {
            headers,
          },
        ),
      );
      console.log(data);
      // if (data.status !== 200) throw CustomError.axiosError(data);
      return true;
    } catch (error) {
      console.log(error.message);
      throw CustomError.serverError(
        error?.response?.data?.message || error.message,
      );
    }
  }

  async validateMeter(
    meterNumber: number,
    discoId: number,
    meterType: number,
  ): Promise<boolean> {
    const headers = this.getHeaders();

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.config.baseUrl}/validatemeter?meternumber=${meterNumber}&disconame=${discoId}&mtype=${meterType}`,

          {
            headers,
          },
        ),
      );

      console.log(data);
      if (data.status !== 200) throw CustomError.axiosError(data);
      return true;
    } catch (error) {
      throw CustomError.serverError(
        error?.response?.data?.message || error.message,
      );
    }
  }

  async sendBulkSMS(req): Promise<boolean> {
    //process request
    console.log(req.body);
    return true;
  }

  async generatRechargepin(
    networkId: string,
    networkAmount: number,
    quantity: number,
    nameOnCard: string,
  ) {
    //process request

    const body = {
      network: networkId,
      network_amount: networkAmount,
      quantity: quantity,
      name_on_card: nameOnCard,
    };

    //https://asbdata.com/api/rechargepin/
  }

  async generateResultChecker(examName: string, quantity: number) {
    //process request
    const body = {
      exam_name: examName,
      quantity,
    };

    //https://asbdata.com/api/epin/
  }

  async getUser(): Promise<AdminUser> {
    const headers = this.getHeaders();

    try {
      const {
        data: { user },
      } = await firstValueFrom(
        this.httpService.get(
          `${this.config.baseUrl}/user`,

          {
            headers,
          },
        ),
      );

      const adminBanks: Array<AdminBank> = user.bank_accounts.accounts.map(
        (acc) => {
          return {
            accountName: acc.accountName,
            accountNumber: acc.accountNumber,
            bankName: acc.bankName,
          };
        },
      );

      return {
        email: user.email,
        phone: user.Phone,
        fullname: user.FullName,
        address: user.Address,
        transactionPin: user.pin,
        balance: user.wallet_balance,
        bonus: user.bonus_balance,
        banks: adminBanks,
        userType: user.user_type,
      };
    } catch (error) {
      console.log(error.message);
      throw CustomError.serverError(error.message);
    }
  }
}
