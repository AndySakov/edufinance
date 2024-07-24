import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Logo from "./logo";
import { formatNumber } from "@/shared/helpers";
import { format } from "date-fns";
import { Discount } from "@/shared/types/bill";

export type ReceiptProps = {
  studentName: string;
  amountDue: number;
  dateOfPayment: Date;
  billName: string;
  feeSummary: {
    subTotal: number;
    discountsApplied: Discount[];
    amountPaid: number;
  };
};

export function Receipt({
  dateOfPayment,
  billName,
  feeSummary,
  studentName,
}: ReceiptProps) {
  return (
    <Card
      className="bg-gray-100 hover:bg-gray-100 w-full max-w-md hover:text-card-foreground"
      variant="outline"
    >
      <CardHeader>
        <CardTitle>
          <Logo variant="dark" />
        </CardTitle>
        <CardDescription>Payment Receipt</CardDescription>
      </CardHeader>
      <CardContent className="gap-4 grid">
        <div className="gap-1 grid">
          <div className="text-muted-foreground">Student Name</div>
          <div className="font-medium">{studentName}</div>
        </div>
        <div className="gap-1 grid">
          <div className="text-muted-foreground">Amount Paid</div>
          <div className="font-medium text-2xl">
            {formatNumber(feeSummary.amountPaid)}
          </div>
        </div>
        <div className="gap-1 grid">
          <div className="text-muted-foreground">Date of Payment</div>
          <div className="font-medium">
            {format(dateOfPayment, "MMMM dd, yyyy")}
          </div>
        </div>
        <Separator />
        <div className="gap-3 grid">
          <div className="font-semibold">Fee Summary</div>
          <ul className="gap-2 grid">
            <li className="flex justify-between items-center">
              <span>{billName}</span>
              <span>{formatNumber(feeSummary.subTotal)}</span>
            </li>
            {feeSummary.discountsApplied.map((discount, index) => (
              <li className="flex justify-between items-center" key={index}>
                <span>Discount ({discount.name})</span>
                <span>{`-${formatNumber(discount.amount)}`}</span>
              </li>
            ))}
            <li className="flex justify-between items-center font-medium">
              <span>Total</span>
              <span>{formatNumber(feeSummary.amountPaid)}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
