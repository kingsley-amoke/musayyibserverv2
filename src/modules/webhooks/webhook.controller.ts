import {
  Controller,
  Post,
  HttpCode,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { successResponse } from '../../common/utils/custom-success.utils';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { CustomError } from 'src/common/utils/custom-error.utils';

@Controller('account')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('fund')
  @HttpCode(200)
  async fundAccount(
    @Req() req: any,
    @Body() { eventData },
  ): Promise<successResponse> {
    // const rawBody = req.rawBody;
    const signature = req.headers['monnify-signature'];
    // console.log(rawBody);
    // console.log(signature);
    // // console.log(req);
    // console.log(req.headers);
    if (!eventData) throw CustomError.badRequestError('Invalid request');

    return this.webhookService.fundAccount(eventData, signature);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('create')
  async createAccount(
    @Req() { user: { uid, email } },
    @Body() { name },
  ): Promise<successResponse> {
    return this.webhookService.createAccount(uid, name, email);
  }
}
