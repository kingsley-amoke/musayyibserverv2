import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(200)
  @Post('/signin')
  async signIn(@Body() body) {
    const { email, password } = body;
    try {
      return await this.authService.signIn(email, password);
    } catch (error) {
      return new UnauthorizedException(error.message);
    }
  }

  @HttpCode(200)
  @Post('/signout')
  signOut() {
    return this.authService.signOut();
  }
}
