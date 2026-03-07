import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { auth } from '../../config/firebase.config';
import { CustomError } from '../utils/custom-error.utils';

// common/guards/firebase-auth.guard.ts
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) throw CustomError.unAuthorizedError;
    try {
      const decoded = await auth.verifyIdToken(token);
      req.user = decoded;
    } catch (error) {
      throw CustomError.unAuthorizedError;
    }

    return true;
  }
}
