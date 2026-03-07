import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CablePlan, DataPlan } from './plans.dto';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';

@UseGuards(FirebaseAuthGuard)
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get('networks')
  getNetwork() {
    return this.plansService.getNetworks();
  }

  @Get('electricity')
  getElectricity() {
    return this.plansService.getElectricity();
  }

  @Get('exams')
  getExams() {
    return this.plansService.getExams();
  }

  @Get('types')
  getTypes(@Query('network') network: number): Array<string> {
    return this.plansService.getPlanTypes(Number(network));
  }

  @Get()
  async getPlans(
    @Query('network') network: number,
    @Query('type') type: string,
  ): Promise<Array<DataPlan>> {
    try {
      return await this.plansService.getPlans(Number(network), type);
    } catch (e) {
      throw new BadRequestException('Failed to fetch plans', e.message);
    }
  }

  @Get('/cable')
  async getCablePlans(
    @Query('cable') cable: string,
  ): Promise<Array<CablePlan>> {
    try {
      return await this.plansService.getCablePlans(cable);
    } catch (e) {
      throw new BadRequestException('Failed to fetch plans', e.message);
    }
  }

  @Get(':id')
  getPlanById(@Param('id') id: number) {
    return this.plansService.getPlanById(Number(id));
  }

  // @Get('/format')
  // getAndFormatPlans(): Array<DataPlan> | void {
  //   console.log(this.plansService.getAndFormatDataPlan(etisalatGiftingPlans));
  //   return this.plansService.getAndFormatDataPlan(etisalatGiftingPlans);
  // }
}
