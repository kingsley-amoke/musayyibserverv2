import { Module } from '@nestjs/common';
import { VtuService } from './vtu.service';
import { VtuController } from './vtu.controller';
import { VendorService } from './vendor.service';
import { TransactionService } from '../transactions/transaction.service';
import { WalletService } from '../wallet/wallet.service';
import { VendorConfig } from 'src/config/vendor.config';
import { UsersService } from '../users/users.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PlansService } from '../plans/plans.service';
import { PricingService } from '../pricing/data.pricing.service';
import { CablePricingService } from '../pricing/cable.pricing.service';
import { PlansModule } from '../plans/plans.module';
import { AnalyticsService } from '../analytics/analytics.service';

@Module({
  imports: [HttpModule],
  providers: [
    VtuService,
    VendorService,
    TransactionService,
    WalletService,
    VendorConfig,
    UsersService,
    PlansService,
    PricingService,
    CablePricingService,
    AnalyticsService,
  ],
  controllers: [VtuController],
})
export class VtuModule {}
