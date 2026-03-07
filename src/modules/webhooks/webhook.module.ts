import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { UsersService } from '../users/users.service';
import { TransactionService } from '../transactions/transaction.service';
import { WalletService } from '../wallet/wallet.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AnalyticsService } from '../analytics/analytics.service';

@Module({
  imports: [HttpModule],
  providers: [
    WebhookService,
    UsersService,
    TransactionService,
    WalletService,
    AnalyticsService,
  ],
  controllers: [WebhookController],
})
export class WebhookMoodule {}
