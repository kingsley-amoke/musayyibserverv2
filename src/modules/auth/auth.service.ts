import { Injectable } from '@nestjs/common';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { CustomError } from 'src/common/utils/custom-error.utils';
import { auth2 } from 'src/config/firebase.config';

@Injectable()
export class AuthService {
  async signIn(email: string, password: string) {
    try {
      return await signInWithEmailAndPassword(auth2, email, password);
    } catch (error) {
      throw CustomError.serverError(error.message);
    }
  }

  async signOut() {
    try {
      return await signOut(auth2);
    } catch (error) {
      throw CustomError.serverError(error.message);
    }
  }
}
