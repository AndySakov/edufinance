import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateBillForm } from "@/components/ui/forms/bill/create";
import AdminPage from "@/components/ui/page/admin";
import { PaginatedTable } from "@/components/ui/paginated-table";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import { Bill } from "@/shared/types/bill";
import { PaginatedData, ResponseWithNoData } from "@/shared/types/data";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

const ViewAllBills = () => {
  const client = useClient();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["bills", { page, pageSize, search }],
    queryFn: async () => {
      const { data } = await client.get<PaginatedData<Bill>>("/bills", {
        params: {
          page,
          limit: pageSize,
          query: search,
        },
      });
      setTotalPages(Math.ceil(data.total / pageSize));
      const results = data.data.map((bill, index) => ({
        ...bill,
        index: index + 1,
      }));
      return results;
    },
  });

  const debouncedRefetch = useDebouncedCallback(() => {
    refetch();
  }, 1000);

  const viewBill = (id: number) => {
    navigate(`/admin/bills/${id}`);
  };

  const deleteBill = async (id: number) => {
    await client.delete<ResponseWithNoData>(`/bills/${id}`);
    window.location.reload();
  };

  return (
    <AdminPage
      title="Manage Bills"
      requiredPermissions={[AdminPermissions.FEE_AND_DUES_MANAGEMENT]}
    >
      <PaginatedTable
        title="Bills List"
        isLoading={isLoading}
        isError={isError}
        error={error}
        records={data ?? []}
        totalPages={totalPages}
        page={page}
        pageSize={pageSize}
        search={search ?? ""}
        pageSizes={[10, 20, 50, 100]}
        setPage={(page) => {
          if (page < 1) {
            setPage(1);
          } else {
            setPage(page);
          }
        }}
        setPageSize={(pageSize) => {
          setPageSize(pageSize);
          refetch();
        }}
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
        extras={
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full">
                  Create New Bill
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Bill</DialogTitle>
                  <DialogDescription>Enter bill's details.</DialogDescription>
                </DialogHeader>
                <CreateBillForm />
              </DialogContent>
            </Dialog>
          </div>
        }
        actions={(record) => [
          <Button
            variant="outline"
            className="w-full"
            onClick={() => viewBill(record.id)}
          >
            View
          </Button>,
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => deleteBill(record.id)}
          >
            Delete
          </Button>,
        ]}
      />
    </AdminPage>
  );
};

export default ViewAllBills;
