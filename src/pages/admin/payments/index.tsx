import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import AdminPage from "@/components/ui/page/admin";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import {
  // ResponseWithNoData,
  ResponseWithOptionalData,
} from "@/shared/types/data";
// import { Check } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
// import { ApproveFinancialAidApplicationForm } from "@/components/ui/forms/financial-aid/application/approve";
import { statusToVariant, Payment } from "@/shared/types/payment";

const ViewAllPayments = () => {
  const client = useClient();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data } = await client.get<ResponseWithOptionalData<Payment[]>>(
        "/payments"
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
    <AdminPage
      title="Manage Payments"
      requiredPermissions={[AdminPermissions.TRANSACTION_MANAGEMENT]}
    >
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
            accessorKey: "payer",
            header: "Paid By",
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
            header: "Payment Category",
            renderCell: (value) => <p>{value.toString()}</p>,
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
        // actions={(record) => [
        //   <TooltipProvider delayDuration={50}>
        //     <Tooltip>
        //       <TooltipTrigger>
        //         <Dialog>
        //           <DialogTrigger asChild>
        //             <Button
        //               variant="default"
        //               className="bg-green-800 w-full"
        //               onClick={() => {}}
        //             >
        //               <Check />
        //             </Button>
        //           </DialogTrigger>
        //           <DialogContent className="sm:max-w-md">
        //             <DialogHeader>
        //               <DialogTitle>Approve Payment Refund</DialogTitle>
        //               <DialogDescription>
        //                 Approve a refund of this payment.
        //               </DialogDescription>
        //             </DialogHeader>
        //             <ApproveFinancialAidApplicationForm id={record.id} />
        //           </DialogContent>
        //         </Dialog>
        //       </TooltipTrigger>
        //       <TooltipContent>
        //         <p>Approve Refund</p>
        //       </TooltipContent>
        //     </Tooltip>
        //     <Tooltip>
        //       <TooltipTrigger>
        //         <Button
        //           variant="default"
        //           className="bg-red-800 w-full"
        //           onClick={() => rejectFinancialAidApplication(record.id)}
        //         >
        //           <X />
        //         </Button>
        //       </TooltipTrigger>
        //       <TooltipContent>
        //         <p>Reject Application</p>
        //       </TooltipContent>
        //     </Tooltip>
        //   </TooltipProvider>,
        //   <Button
        //     variant="outline"
        //     className="hover:bg-red-500 border-red-800 w-full ring-1 ring-red-800"
        //     onClick={() => deleteFinancialAidApplication(record.id)}
        //   >
        //     <Trash />
        //   </Button>,
        // ]}
      />
    </AdminPage>
  );
};

export default ViewAllPayments;
