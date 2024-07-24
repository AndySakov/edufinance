import { BadgeProps } from "@/components/ui/badge";
import { UserBill } from "./bill";

export interface Payment {
  id: number;
  bill: string;
  payer: string;
  paymentType: string;
  paymentReference: string;
  status: "pending" | "paid" | "failed" | "refunded";
  paymentNote: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MyPayment {
  id: number;
  billName: string;
  bill: UserBill;
  payer: string;
  paymentType: string;
  paymentReference: string;
  status: "pending" | "paid" | "failed" | "refunded";
  paymentNote: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const statusToVariant = (
  status: Payment["status"]
): BadgeProps["variant"] => {
  switch (status) {
    case "pending":
      return "default";
    case "paid":
      return "ghost";
    case "failed":
      return "destructive";
    case "refunded":
      return "outline";
    default:
      return "default";
  }
};

export interface InitiatePaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}
