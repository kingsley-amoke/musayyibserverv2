import { Injectable } from '@nestjs/common';
import { User } from './users.dto';
import { firestore, auth, auth2 } from '../../config/firebase.config';
import { UserHelper } from './user.helper';
import { CollectionReference, QuerySnapshot } from 'firebase-admin/firestore';
import { CustomError } from '../../common/utils/custom-error.utils';
import * as admin from 'firebase-admin';

@Injectable()
export class UsersService {
  async getUsersPaginated(limit: number, lastDocId?: string) {
    try {
      let query = firestore.collection('users').limit(limit);

      if (lastDocId) {
        const lastDoc = await firestore
          .collection('users')
          .doc(lastDocId)
          .get();

        query = query.startAfter(lastDoc);
      }

      const snapshot = await query.get();

      return {
        users: snapshot.docs.map((doc) => ({
          id: doc.id,
          ...UserHelper.fromFirestore(doc.data()),
        })),
        lastDocId: snapshot.docs.length
          ? snapshot.docs[snapshot.docs.length - 1].id
          : null,
      };
    } catch (error) {
      throw CustomError.serverError(error.message);
    }
  }

  async findUserByEmail(email: String): Promise<Partial<User>> {
    const usersRef: CollectionReference = firestore.collection('users');

    try {
      const querySnapshot: QuerySnapshot = await usersRef
        .where('email', '==', email)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        throw CustomError.notFoundError('User not found');
      }

      const userDoc = querySnapshot.docs[0];
      return UserHelper.fromFirestore(userDoc.data());
    } catch (error) {
      throw CustomError.serverError;
    }
  }

  getUserRef(userId: string) {
    return firestore.collection('users').doc(userId);
  }

  async checkAdmin(userId: string): Promise<boolean> {
    const doc = await this.getUserRef(userId).get();

    if (!doc.exists) return false;

    return doc.get('isAdmin') === true;
  }

  async getUserBalance(userId: string): Promise<number> {
    try {
      const user = await firestore.collection('users').doc(userId).get();
      return Number(user.get('balance')) || 0;
    } catch (error) {
      throw CustomError.serverError(error.message);
    }
  }

  async updateUser(userId: string, data: Partial<User>) {
    try {
      const userRef = this.getUserRef(userId);

      return await userRef.update({
        ...data,
      });
    } catch (error) {
      throw CustomError.serverError(error.message);
    }
  }

  async checkSufficientFund(userId: string, amount: number): Promise<boolean> {
    try {
      const balance = await this.getUserBalance(userId);

      return balance >= amount;
    } catch (error) {
      throw CustomError.serverError(error.message);
    }
  }

  async deleteUser(userId: string) {
    try {
      auth.deleteUser(userId);
    } catch (error) {
      throw CustomError.serverError(error.message);
    }
  }
}
