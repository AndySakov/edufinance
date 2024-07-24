import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useClient } from "@/shared/axios";
import {
  // ResponseWithNoData,
  ResponseWithOptionalData,
} from "@/shared/types/data";
import { Receipt as ReceiptIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { statusToVariant, Payment, MyPayment } from "@/shared/types/payment";
import StudentPage from "@/components/ui/page/student";
import { Receipt } from "@/components/ui/receipt";
import { useAuth } from "@/shared/store";

const ViewMyPayments = () => {
  const client = useClient();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { user } = useAuth();

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["my-payments"],
    queryFn: async () => {
      const { data } = await client.get<ResponseWithOptionalData<MyPayment[]>>(
        "/student/payments"
      );
      const results = data.data.map((transaction, index) => ({
        ...transaction,
        index: index + 1,
      }));
      return results;
    },
  });

  const debouncedRefetch = useDebouncedCallback(() => {
    refetch();
  }, 1000);

  // const rejectFinancialAidApplication = async (id: number) => {
  //   await client.patch<ResponseWithNoData>(
  //     `/financial-aid-applications/reject/${id}`
  //   );
  //   window.location.reload();
  // };

  return (
    <StudentPage title="My Payments">
      <DataTable
        title="Payments List"
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
            renderCell: (value) => <span>{value.toString()}</span>,
          },
          {
            accessorKey: "billName",
            header: "Bill Name",
            renderCell: (value) => <span>{value.toString()}</span>,
          },
          {
            accessorKey: "amount",
            header: "Amount",
            renderCell: (value) => (
              <span>{"₦" + new Intl.NumberFormat("en-US").format(+value)}</span>
            ),
          },
          {
            accessorKey: "status",
            header: "Payment Status",
            renderCell: (value) => (
              <Badge variant={statusToVariant(value as Payment["status"])}>
                {value.toString().charAt(0).toUpperCase() +
                  value.toString().slice(1)}
              </Badge>
            ),
          },
          {
            accessorKey: "paymentType",
            header: "Payment Channel",
            renderCell: (value) => (
              <Badge variant="outline">{value.toString()}</Badge>
            ),
          },
          {
            accessorKey: "paymentReference",
            header: "Payment Reference",
            renderCell: (value) => <span>{value.toString()}</span>,
          },

          {
            accessorKey: "paymentNote",
            header: "Payment Note",
            renderCell: (value) => <p>{value.toString()}</p>,
          },
          {
            accessorKey: "createdAt",
            header: "Payment Date",
            renderCell: (value) => (
              <span>{value ? format(value as Date, "dd/MM/yyyy") : "N/A"}</span>
            ),
          },
          {
            accessorKey: "updatedAt",
            header: "Last Updated",
            renderCell: (value) => (
              <span>{value ? format(value as Date, "dd/MM/yyyy") : "N/A"}</span>
            ),
          },
        ]}
        actions={(record) => [
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full"
                disabled={record.status !== "paid"}
              >
                <ReceiptIcon className="mx-1" /> View Receipt
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <Receipt
                amountDue={record.bill.amountDue}
                dateOfPayment={record.createdAt}
                billName={record.billName}
                feeSummary={{
                  subTotal: record.bill.amountDue,
                  discountsApplied: record.bill.discounts,
                  amountPaid: record.amount,
                }}
                studentName={
                  (user?.details.firstName ?? "") +
                  " " +
                  (user?.details.lastName ?? "")
                }
              />
            </DialogContent>
          </Dialog>,
        ]}
      />
    </StudentPage>
  );
};

export default ViewMyPayments;
