import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { useClient } from "@/shared/axios";
import { ResponseWithOptionalData } from "@/shared/types/data";
import { FinancialAidApplication } from "@/shared/types/financial-aid/application";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import StudentPage from "@/components/ui/page/student";
// import { ViewDoc } from "@/components/ui/view-doc";

const ViewMyFAApplications = () => {
  const client = useClient();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const { data } = await client.get<
        ResponseWithOptionalData<FinancialAidApplication[]>
      >("/student/applications");
      const results = data.data.map((financialAidApplication, index) => ({
        ...financialAidApplication,
        index: index + 1,
      }));
      return results;
    },
  });

  const debouncedRefetch = useDebouncedCallback(() => {
    refetch();
  }, 1000);

  return (
    <StudentPage title="My Financial Aid Applications">
      <DataTable
        title="Financial Aid Applications"
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
            accessorKey: "householdIncome",
            header: "Household Income",
            renderCell: (value) => (
              <span>{"₦" + new Intl.NumberFormat("en-US").format(+value)}</span>
            ),
          },
          {
            accessorKey: "hasReceivedPreviousFinancialAid",
            header: "Has Received Previous Financial Aid",
            renderCell: (value) => (
              <Badge variant={value === true ? "default" : "secondary"}>
                {value === true ? "Yes" : "No"}
              </Badge>
            ),
          },
          {
            accessorKey: "status",
            header: "Status",
            renderCell: (value) => (
              <Badge
                variant={
                  value === "approved"
                    ? "default"
                    : value === "rejected"
                    ? "destructive"
                    : "outline"
                }
              >
                {value.toString().charAt(0).toUpperCase() +
                  value.toString().slice(1)}
              </Badge>
            ),
          },
          {
            accessorKey: "type",
            header: "Type",
            renderCell: (value) => <span>{value.toString()}</span>,
          },
          {
            accessorKey: "bankStatementUrl",
            header: "Bank Statement",
            renderCell: (value) => (
              <a
                href={value?.toString()}
                download
                target="_blank"
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Download Bank Statement
              </a>
            ),
          },
          {
            accessorKey: "coverLetterUrl",
            header: "Cover Letter",
            renderCell: (value) => (
              <a
                href={value?.toString()}
                download
                target="_blank"
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Download Cover Letter
              </a>
            ),
          },
          {
            accessorKey: "letterOfRecommendationUrl",
            header: "Recommendation Letter",
            renderCell: (value) => (
              <a
                href={value?.toString()}
                download
                target="_blank"
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Download Recommendation Letter
              </a>
            ),
          },
          {
            accessorKey: "startDate",
            header: "Start Date",
            renderCell: (value) => (
              <span>{value ? format(value as Date, "dd/MM/yyyy") : "N/A"}</span>
            ),
          },
          {
            accessorKey: "endDate",
            header: "End Date",
            renderCell: (value) => (
              <span>{value ? format(value as Date, "dd/MM/yyyy") : "N/A"}</span>
            ),
          },
          {
            accessorKey: "createdAt",
            header: "Created At",
            renderCell: (value) => (
              <span>{value ? format(value as Date, "dd/MM/yyyy") : "N/A"}</span>
            ),
          },
          {
            accessorKey: "updatedAt",
            header: "Updated At",
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
        //               <DialogTitle>Create New Student</DialogTitle>
        //               <DialogDescription>
        //                 Approve financial aid application.
        //               </DialogDescription>
        //             </DialogHeader>
        //             <ApproveFinancialAidApplicationForm id={record.id} />
        //           </DialogContent>
        //         </Dialog>
        //       </TooltipTrigger>
        //       <TooltipContent>
        //         <p>Approve Application</p>
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
        //   // <Button
        //   //   variant="outline"
        //   //   className="hover:bg-red-500 border-red-800 w-full ring-1 ring-red-800"
        //   //   onClick={() => deleteFinancialAidApplication(record.id)}
        //   // >
        //   //   <Trash />
        //   // </Button>,
        // ]}
      />
    </StudentPage>
  );
};

export default ViewMyFAApplications;
