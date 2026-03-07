export interface Transaction {
  amount: number;
  newBalance: number;
  oldBalance: number;
  reference: string;
  status: string;
  type: string;
  network?: string;
  networkId?: number;
  plan?: string;
  planId?: number;
  phone?: string;
  channel?: string;
  paymentMethod?: string;
  date: string;
}
