import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { auth } from '../../config/firebase.config';
import { CustomError } from '../utils/custom-error.utils';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UsersService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) throw CustomError.unAuthorizedError;
    try {
      const decoded = await auth.verifyIdToken(token);

      const isAdmin = await this.userService.checkAdmin(decoded.uid);

      if (!isAdmin) throw CustomError.unAuthorizedError;
    } catch (error) {
      throw CustomError.unAuthorizedError;
    }

    return true;
  }
}
