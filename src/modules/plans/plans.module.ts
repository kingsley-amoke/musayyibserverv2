import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { PricingService } from '../pricing/data.pricing.service';
import { HttpService } from '@nestjs/axios';
import { CablePricingService } from '../pricing/cable.pricing.service';

@Module({
  imports: [],
  controllers: [PlansController],
  providers: [PlansService, PricingService, CablePricingService],
})
export class PlansModule {}
