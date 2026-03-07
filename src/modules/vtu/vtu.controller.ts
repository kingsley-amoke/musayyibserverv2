import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/common/guards/firebase-auth.guard';
import { VtuService } from './vtu.service';
import type { VtuDto } from './vtu.dto';
import { successResponse } from 'src/common/utils/custom-success.utils';
import { CustomError } from 'src/common/utils/custom-error.utils';

// modules/vtu/vtu.controller.ts
@UseGuards(FirebaseAuthGuard)
@Controller('vtu')
export class VtuController {
  constructor(private vtuService: VtuService) {}

  @Post('data')
  async buyData(@Req() { user: { uid } }, @Body() body) {
    if (
      !body ||
      !body.amount ||
      !body.phone ||
      !body.plan_id ||
      !body.network_id
    )
      throw CustomError.badRequestError('Invalid input');

    const { amount, phone, plan_id, network_id } = body;

    return await this.vtuService.buyData(uid, {
      amount,
      phone,
      planId: plan_id,
      networkId: network_id,
    });
  }

  @Post('airtime')
  async buyAirtime(
    @Req() { user: { uid } },
    @Body() { amount, phone, networkId },
  ): Promise<successResponse> {
    try {
      return await this.vtuService.buyAirtime(uid, {
        amount,
        phone,
        networkId,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/cable')
  async subscribeCable(
    @Req() { user: { uid } },
    @Body()
    { cableId, amount, smartCardNumber, planId },
  ) {
    console.log(cableId);
    console.log(amount);
    console.log(smartCardNumber);
    console.log(planId);

    return await this.vtuService.subscribeCable(
      uid,
      cableId,
      amount,
      smartCardNumber,
      planId,
    );
  }

  @Post('/cable/validate')
  async validateIUC(@Body() { cableId, smartCardNumber }) {
    console.log(cableId, smartCardNumber);
    return await this.vtuService.validateIUC(
      Number(cableId),
      Number(smartCardNumber),
    );
  }

  @Post('/electricity/validate')
  async validateMeter(@Body() { meterNumber, discoId, meterType }) {
    console.log(discoId, meterNumber, meterType);

    return await this.vtuService.validateMeter(
      Number(meterNumber),
      Number(discoId),
      Number(meterType),
    );
  }

  @Post('/electricity')
  async subscribeElectricity(
    @Req() { user: { uid } },
    @Body()
    { discoId, amount, meterType, meterNumber },
  ) {
    (console.log(uid),
      console.log(discoId),
      console.log(amount),
      console.log(meterNumber),
      console.log(meterType));

    return await this.vtuService.subscribeElectricity(
      uid,
      discoId,
      meterNumber,
      meterType,
      amount,
    );
  }

  @Post('/resultchecker')
  async generateResultChecker(
    @Req() { user: { uid } },
    @Body() { examName, quantity, amount },
  ) {
    console.log(examName);
    console.log(quantity);

    return await this.vtuService.generateResultChecker(
      uid,
      examName,
      quantity,
      amount,
    );
  }
}
