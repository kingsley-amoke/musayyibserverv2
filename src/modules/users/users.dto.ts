import { BankAccount } from '../webhooks/account.dto';
import { Transaction } from '../transactions/transaction.dto';

export interface User {
  id: string;
  transactionPin: number;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  isAdmin: boolean;
  username: string;
  balance: number;
  accounts: Array<BankAccount>;
  transactions: Array<Transaction>;
}
