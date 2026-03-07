import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import type { UpdatePriceDto } from './update-price.dto';
import { CustomError } from 'src/common/utils/custom-error.utils';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('data/price')
  async updatePrice(@Body() dto: UpdatePriceDto) {
    if (!dto || !dto.networkId || !dto.planId || !dto.price)
      throw CustomError.badRequestError('Invalid request');

    return this.adminService.updatePlanPrice(
      Number(dto.networkId),
      Number(dto.planId),
      Number(dto.price),
    );
  }

  @Patch('cable/price')
  findAndUpdateCablePrice(@Body() body) {
    if (!body) throw CustomError.badRequestError('Bad request');
    const { plan_id, cable, price } = body;

    if (!plan_id || !cable || !price)
      throw CustomError.badRequestError('Bad request');

    return this.adminService.updateCablePrice(
      Number(plan_id),
      cable,
      Number(price),
    );
  }

  @Patch('user/update')
  makeAdmin(@Body() { user_id }) {
    if (!user_id) throw CustomError.badRequestError('Invalid request');

    return this.adminService.makeAdmin(user_id);
  }

  @Get()
  async getAdmin() {
    return await this.adminService.getAdmin();
  }

  @Get('/dashboard')
  async getDashboardStats() {
    return await this.adminService.dashboardStats();
  }

  @Patch('/user/fund')
  async fundUser(@Body() body) {
    if (!body) return CustomError.badRequestError('Invalid request');
    return this.adminService.fundUser(body.userId, Number(body.amount));
  }

  @Patch('/user/deduct')
  async deductUser(@Body() body) {
    if (!body) return CustomError.badRequestError('Invalid request');
    return this.adminService.deductUser(body.userId, Number(body.amount));
  }
}
