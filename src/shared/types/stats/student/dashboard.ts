import { StudentBillStats } from "./bill";
import { StudentPaymentStats } from "./payment";

export interface StudentDashboardStats {
  billStats: StudentBillStats;
  paymentStats: StudentPaymentStats;
}
