import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { useClient } from "@/shared/axios";
import {
  // ResponseWithNoData,
  ResponseWithOptionalData,
} from "@/shared/types/data";
import { Receipt } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { statusToVariant, Payment } from "@/shared/types/payment";
import StudentPage from "@/components/ui/page/student";

const ViewMyPayments = () => {
  const client = useClient();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["my-payments"],
    queryFn: async () => {
      const { data } = await client.get<ResponseWithOptionalData<Payment[]>>(
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
            accessorKey: "bill",
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
        actions={() => [
          <TooltipProvider delayDuration={50}>
            {/* <Tooltip>
              <TooltipTrigger>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      className="bg-green-800 w-full"
                      onClick={() => {}}
                    >
                      <SealQuestion className="mx-1" /> Request Refund
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Request Refund</DialogTitle>
                      <DialogDescription>
                        Request a refund of this payment.
                      </DialogDescription>
                    </DialogHeader>
                    <ApproveFinancialAidApplicationForm id={record.id} />
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Request Refund</p>
              </TooltipContent>
            </Tooltip> */}
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" className="w-full" onClick={() => {}}>
                  <Receipt className="mx-1" /> Download Receipt
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Receipt</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>,
        ]}
      />
    </StudentPage>
  );
};

export default ViewMyPayments;
