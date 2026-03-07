import { Injectable } from '@nestjs/common';
import { firestore } from '../../config/firebase.config';
import { UsersService } from '../users/users.service';
import { CustomError } from '../../common/utils/custom-error.utils';

// modules/wallet/wallet.service.ts
@Injectable()
export class WalletService {
  constructor(private userService: UsersService) {}

  async deduct(userId: string, amount: number) {
    const result = await firestore.runTransaction(async (tx) => {
      const userRef = this.userService.getUserRef(userId);

      const doc = await tx.get(userRef);
      const balance = doc.data()?.balance || 0;

      if (balance < amount) {
        throw CustomError.insufficientFundError;
      }

      const newBalance = balance - amount;

      tx.update(userRef, { balance: newBalance });

      return { oldBalance: balance, newBalance };
    });

    return result;
  }

  async credit(userId: string, amount: number) {
    return await firestore.runTransaction(async (trx) => {
      const walletRef = firestore.collection('users').doc(userId);

      const walletDoc = await trx.get(walletRef);

      if (!walletDoc.exists) {
        throw CustomError.notFoundError('Wallet not found');
      }

      const oldBalance = walletDoc.data()?.balance || 0;
      const newBalance = oldBalance + amount;

      trx.update(walletRef, { balance: newBalance });

      return { oldBalance, newBalance };
    });
  }
}
