import { Transaction } from './transaction.dto';

export class TransactionHelper {
  static fromFirestore(transaction): Transaction {
    return {
      amount: transaction['amount'],
      type: transaction['type'],
      newBalance: transaction['newBalance'],
      oldBalance: transaction['oldBalance'],
      reference: transaction['reference'],
      status: transaction['status'],
      date: transaction['date'],
      phone: transaction['phone'],
      plan: transaction['plan'],
      planId: transaction['planId'],
      network: transaction['network'],
      networkId: transaction['networkId'],
    };
  }
}
