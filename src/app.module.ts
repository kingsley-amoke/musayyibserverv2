import { Module } from '@nestjs/common';
import { PlansModule } from './modules/plans/plans.module';
import { WebhookMoodule } from './modules/webhooks/webhook.module';
import { VtuModule } from './modules/vtu/vtu.module';
import { AuthModule } from './modules/auth/auth.module';
import { HttpService } from '@nestjs/axios';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [PlansModule, WebhookMoodule, VtuModule, AuthModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
