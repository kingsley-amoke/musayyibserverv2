import { firestore } from '../../config/firebase.config';
import { Transaction } from './transaction.dto';
import { CustomError } from '../../common/utils/custom-error.utils';
import { HttpException } from '@nestjs/common';
import { DocumentData } from 'firebase/firestore';
import { TransactionHelper } from './transaction.helper';

export class TransactionService {
  async createTransaction(
    userId: string,
    transactionId: string,
    transaction: Transaction,
  ): Promise<Transaction> {
    try {
      const transactionRef = firestore
        .collection('users')
        .doc(userId)
        .collection('transactions')
        .doc(transactionId);

      await transactionRef.set(transaction);

      return transaction;
    } catch (error) {
      console.error(error);
      throw CustomError.serverError('Something went wrong');
    }
  }

  async updateTransactionStatus(
    userId: string,
    transactionId: string,
    updateData: Partial<Transaction>,
  ): Promise<Transaction> {
    const transactionRef = firestore
      .collection('users')
      .doc(userId)
      .collection('transactions')
      .doc(transactionId);

    await transactionRef.update({ ...updateData });

    return TransactionHelper.fromFirestore((await transactionRef.get()).data());
  }

  async createReference(
    reference: string,
    userId: string,
    amount: number,
    status: string,
  ) {
    await firestore.collection('transactions').doc(reference).create({
      userId,
      amount,
      status: status,
      createdAt: new Date(),
    });
  }

  async updateReferenceStatus(reference: string, status: string) {
    await firestore
      .collection('transactions')
      .doc(reference)
      .update({ status });
  }

  async findTransactionByReference(
    reference: string,
  ): Promise<DocumentData | null> {
    try {
      const snapShot = await firestore
        .collection('transactions')
        .doc(reference)
        .get();

      if (!snapShot.exists) return null;

      return snapShot.data()!;
    } catch (error) {
      console.error('Error finding transaction:', error);
      throw CustomError.serverError('Internal Server Error');
    }
  }
}
