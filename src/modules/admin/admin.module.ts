import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PlansModule } from '../plans/plans.module';
import { PlansService } from '../plans/plans.service';
import { PricingService } from '../pricing/data.pricing.service';
import { CablePricingService } from '../pricing/cable.pricing.service';
import { UsersService } from '../users/users.service';
import { VtuService } from '../vtu/vtu.service';
import { VendorService } from '../vtu/vendor.service';
import { TransactionService } from '../transactions/transaction.service';
import { WalletService } from '../wallet/wallet.service';
import { VendorConfig } from '../../config/vendor.config';
import { HttpModule } from '@nestjs/axios';
import { AnalyticsService } from '../analytics/analytics.service';

@Module({
  imports: [PlansModule, HttpModule],
  providers: [
    AdminService,
    PlansService,
    PricingService,
    CablePricingService,
    UsersService,
    VtuService,
    VendorService,
    TransactionService,
    WalletService,
    AnalyticsService,
    VendorConfig,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
