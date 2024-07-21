import { Discount } from "../bill";

export interface FinancialAidApplication {
  id: number;
  applicant: string;
  householdIncome: number;
  hasReceivedPreviousFinancialAid: boolean;
  bankStatementUrl: string;
  coverLetterUrl: string;
  letterOfRecommendationUrl: string;
  status: "approved" | "rejected" | "pending";
  type: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MyFinancialAidInfo {
  id: number;
  applicant: string;
  householdIncome: number;
  hasReceivedPreviousFinancialAid: boolean;
  bankStatementUrl: string;
  coverLetterUrl: string;
  letterOfRecommendationUrl: string;
  status: "approved";
  type: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  discounts: (Discount & { billType: string })[];
}
