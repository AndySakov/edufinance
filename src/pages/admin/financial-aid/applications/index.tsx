import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import AdminPage from "@/components/ui/page/admin";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import {
  ResponseWithNoData,
  ResponseWithOptionalData,
} from "@/shared/types/data";
import { FinancialAidApplication } from "@/shared/types/financial-aid/application";
import { Check, X } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ApproveFinancialAidApplicationForm } from "@/components/ui/forms/financial-aid/application/approve";

const ViewAllFinancialAidApplications = () => {
  const client = useClient();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["financial-aid-applications"],
    queryFn: async () => {
      const { data } = await client.get<
        ResponseWithOptionalData<FinancialAidApplication[]>
      >("/financial-aid-applications");
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

  const rejectFinancialAidApplication = async (id: number) => {
    await client.patch<ResponseWithNoData>(
      `/financial-aid-applications/reject/${id}`
    );
    window.location.reload();
  };

  return (
    <AdminPage
      title="Manage Financial Aid Applications"
      requiredPermissions={[AdminPermissions.FINANCIAL_AID_MANAGEMENT]}
    >
      <DataTable
        title="Financial Aid Applications List"
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
            accessorKey: "applicantName",
            header: "Applicant Name",
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
                href={value.toString()}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Bank Statement
              </a>
            ),
          },
          {
            accessorKey: "coverLetterUrl",
            header: "Cover Letter",
            renderCell: (value) => (
              <a
                href={value.toString()}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Cover Letter
              </a>
            ),
          },
          {
            accessorKey: "letterOfRecommendationUrl",
            header: "Recommendation Letter",
            renderCell: (value) => (
              <a
                href={value.toString()}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Recommendation Letter
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
        actions={(record) => {
          if (record.status === "approved") {
            return [];
          } else {
            return [
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          className="bg-green-800 w-full"
                          onClick={() => {}}
                        >
                          <Check />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            Approve Financial Aid Application
                          </DialogTitle>
                          <DialogDescription>
                            Approve financial aid application.
                          </DialogDescription>
                        </DialogHeader>
                        <ApproveFinancialAidApplicationForm id={record.id} />
                      </DialogContent>
                    </Dialog>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Approve Application</p>
                  </TooltipContent>
                </Tooltip>
                {record.status === "pending" ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="default"
                        className="bg-red-800 w-full"
                        onClick={() => rejectFinancialAidApplication(record.id)}
                      >
                        <X />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reject Application</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </TooltipProvider>,
              // <Button
              //   variant="outline"
              //   className="hover:bg-red-500 border-red-800 ring-1 ring-red-800 w-full"
              //   onClick={() => deleteFinancialAidApplication(record.id)}
              // >
              //   <Trash />
              // </Button>,
            ];
          }
        }}
      />
    </AdminPage>
  );
};

export default ViewAllFinancialAidApplications;
