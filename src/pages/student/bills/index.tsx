import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StudentPage from "@/components/ui/page/student";
import { useClient } from "@/shared/axios";
import { useAuth } from "@/shared/store";
import { BillPayment, Discount, UserBill } from "@/shared/types/bill";
import { ResponseWithOptionalData } from "@/shared/types/data";
import { InitiatePaymentResponse } from "@/shared/types/payment";
import { CardStackPlusIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import PaystackPop from "@paystack/inline-js";
import { toast } from "@/components/hooks/use-toast";
import { PayBillForm } from "@/components/ui/forms/bill/pay";
import { Check } from "@phosphor-icons/react";
import { formatNumber } from "@/shared/helpers";

const ViewMyBills = () => {
  const client = useClient();
  const { user } = useAuth();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["my-bills"],
    queryFn: async () => {
      const { data } = await client.get<ResponseWithOptionalData<UserBill[]>>(
        "/student/bills"
      );
      const results = data.data.map((bill, index) => {
        const totalDue = bill.amountDue;
        const totalPaid = bill.payments.reduce(
          (acc, payment) =>
            acc + (payment.status === "paid" ? payment.amount : 0),
          0
        );
        const totalDiscount = bill.discounts.reduce(
          (acc, discount) => acc + discount.amount,
          0
        );
        const remainingBalance = totalDue - (totalDiscount + totalPaid);
        return {
          ...bill,
          remainingBalance: remainingBalance,
          index: (index + 1).toString(),
        };
      });
      return results;
    },
  });

  const debouncedRefetch = useDebouncedCallback(() => {
    refetch();
  }, 1000);

  const initiatePayment = async (
    options: { paymentType: string; desiredInstallments: string },
    bill: UserBill
  ) => {
    if (options.paymentType.toLowerCase() === "paystack") {
      const response = await client.post<
        ResponseWithOptionalData<InitiatePaymentResponse>
      >(`/transaction/initiate`, {
        billId: bill.id,
        email: user?.email,
        amount: (
          bill.remainingBalance / Number(options.desiredInstallments)
        ).toString(),
      });

      if (response.data.success) {
        const popup = new PaystackPop();
        popup.resumeTransaction(response.data.data.access_code);
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description:
          "We don't support this payment channel right now, please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <StudentPage title="My Bills">
      <DataTable
        title="Bills List"
        isLoading={isLoading}
        isError={isError}
        error={error}
        records={data ?? []}
        search={search ?? ""}
        setSearch={(search) => {
          setSearch(search);
          debouncedRefetch();
        }}
        columns={[
          {
            accessorKey: "index",
            header: "ID",
            renderCell: (value) => <span>{value?.toString()}</span>,
          },
          {
            accessorKey: "name",
            header: "Bill Name",
            renderCell: (value) => <span>{value?.toString()}</span>,
          },
          {
            accessorKey: "amountDue",
            header: "Amount Due",
            renderCell: (value) => (
              <span>{"₦" + new Intl.NumberFormat("en-US").format(+value)}</span>
            ),
          },
          {
            accessorKey: "discounts",
            header: "Applied Discount",
            renderCell: (value) => {
              const discounts = value as Discount[];
              const totalDiscounted = discounts.reduce(
                (acc, discount) => acc + discount.amount,
                0
              );
              return <span>{formatNumber(totalDiscounted)}</span>;
            },
          },
          {
            accessorKey: "remainingBalance",
            header: "Balance",
            renderCell: (value) => {
              return <span>{formatNumber(value as number)}</span>;
            },
          },
          {
            accessorKey: "payments",
            header: "Amount Paid",
            renderCell: (value) => {
              const payments = value as BillPayment[];
              const totalPaid = payments.reduce(
                (acc, payment) =>
                  acc + (payment.status === "paid" ? payment.amount : 0),
                0
              );
              return <span>{formatNumber(totalPaid)}</span>;
            },
          },
          {
            accessorKey: "dueDate",
            header: "Due Date",
            renderCell: (value) => (
              <span>{value ? format(value as Date, "dd/MM/yyyy") : "N/A"}</span>
            ),
          },
          {
            accessorKey: "installmentSupported",
            header: "Installment Supported",
            renderCell: (value) => (
              <Badge variant={value === true ? "default" : "secondary"}>
                {value === true ? "Yes" : "No"}
              </Badge>
            ),
          },
          {
            accessorKey: "maxInstallments",
            header: "Max Installments",
            renderCell: (value) => <span>{value?.toString()}</span>,
          },
          {
            accessorKey: "billType",
            header: "Bill Type",
            renderCell: (value) => <span>{value?.toString()}</span>,
          },
        ]}
        actions={(record) => {
          const totalDue = record.amountDue;
          const totalPaid = record.payments.reduce(
            (acc, payment) =>
              acc + (payment.status === "paid" ? payment.amount : 0),
            0
          );
          const totalDiscount = record.discounts.reduce(
            (acc, discount) => acc + discount.amount,
            0
          );
          const isPaid = totalDue - (totalDiscount + totalPaid) === 0;
          return [
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" disabled={isPaid}>
                  {isPaid ? (
                    <Check className="mr-2 w-5 h-5" />
                  ) : (
                    <CardStackPlusIcon className="mr-2 w-5 h-5" />
                  )}
                  <span className="text-md">{isPaid ? "Paid" : "Pay"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Choose payment options</DialogTitle>
                  <DialogDescription>
                    Select your preferred payment options.
                  </DialogDescription>
                </DialogHeader>
                <PayBillForm
                  onSubmit={(data) => initiatePayment(data, record)}
                  maxInstallments={record.maxInstallments}
                />
              </DialogContent>
            </Dialog>,
          ];
        }}
      />
    </StudentPage>
  );
};

export default ViewMyBills;
