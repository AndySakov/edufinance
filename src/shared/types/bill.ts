export interface Bill {
  id: number;
  index: string;
  name: string;
  amountDue: number;
  dueDate: Date;
  installmentSupported: boolean;
  maxInstallments: number;
  billType: string;
}

export interface UserBill extends Bill {
  discounts: Discount[];
  payments: BillPayment[];
  remainingBalance: number;
}

export interface BillPayment {
  amount: number;
  type: string;
  status: string;
}

export interface Discount {
  name: string;
  amount: number;
}
