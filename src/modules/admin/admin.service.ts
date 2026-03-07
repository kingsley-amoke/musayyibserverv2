import { Injectable } from '@nestjs/common';
import { PlansService } from '../plans/plans.service';
import { UsersService } from '../users/users.service';
import { CustomError } from 'src/common/utils/custom-error.utils';
import { VtuService } from '../vtu/vtu.service';
import { WalletService } from '../wallet/wallet.service';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class AdminService {
  constructor(
    private plansService: PlansService,
    private userService: UsersService,
    private vtuService: VtuService,
    private walletService: WalletService,
    private analyticsService: AnalyticsService,
  ) {}

  async getUsers() {
    try {
      return this.userService.getUsersPaginated(100);
    } catch (error) {
      throw error;
    }
  }

  async updatePlanPrice(networkId: number, planId: number, price: number) {
    try {
      return await this.plansService.findAndUpdatePrice(
        networkId,
        planId,
        price,
      );
    } catch (error) {
      throw error;
    }
  }

  async updateCablePrice(plan_id: number, cable: string, price: number) {
    try {
      return await this.plansService.findAndUpdateCablePrice(
        plan_id,
        cable,
        price,
      );
    } catch (error) {
      throw error;
    }
  }

  async fundUser(userId: string, amount: number) {
    try {
      return await this.walletService.credit(userId, amount);
    } catch (error) {
      throw error;
    }
  }

  async deductUser(userId: string, amount: number) {
    try {
      return await this.walletService.deduct(userId, amount);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      this.userService.deleteUser(userId);
    } catch (error) {
      throw error;
    }
  }

  async makeAdmin(userId: string) {
    try {
      return this.userService.updateUser(userId, { isAdmin: true });
    } catch (error) {
      throw error;
    }
  }

  async getAdmin() {
    try {
      return await this.vtuService.getAdmin();
    } catch (error) {
      throw CustomError.serverError(error.message);
    }
  }

  async dashboardStats() {
    const transactions = this.analyticsService.getRecentTransactions();
    const chartData = this.analyticsService.getChartData();
    const stats = this.analyticsService.getDashboardStats();
    return {
      stats,
      transactions,
      chartData,
    };
  }
}
