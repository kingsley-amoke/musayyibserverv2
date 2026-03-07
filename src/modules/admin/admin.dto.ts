export interface AdminUser {
  email: string;
  fullname: string;
  transactionPin: string;
  address: string;
  phone: string;
  userType: string;
  balance: string;
  bonus: string;
  banks: Array<AdminBank>;
}

export interface AdminBank {
  accountNumber: string;
  accountName: string;
  bankName: string;
}
