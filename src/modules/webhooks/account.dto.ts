export interface BankAccount {
  accountName: string;

  accountNumber: string;

  bankCode: string;

  bankName: string;
}

export interface MonnifyWebhookEvent {
  amountPaid: number;
  transactionReference: string;
  paymentMethod: string;
  paidOn: string;
  paymentStatus: 'PAID';
  currency: string;
  customer: {
    email: string;
  };
}
