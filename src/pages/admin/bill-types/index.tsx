import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateBillTypeForm } from "@/components/ui/forms/bill-type/create";
import AdminPage from "@/components/ui/page/admin";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import {
  ResponseWithNoData,
  ResponseWithOptionalData,
} from "@/shared/types/data";
import { BillType } from "@/shared/types/bill-type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

const ViewAllBillTypes = () => {
  const client = useClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["bill-types"],
    queryFn: async () => {
      const { data } = await client.get<ResponseWithOptionalData<BillType[]>>(
        "/bill-types"
      );
      const results = data.data.map((user, index) => ({
        ...user,
        index: index + 1,
      }));
      return results;
    },
  });

  const debouncedRefetch = useDebouncedCallback(() => {
    refetch();
  }, 1000);

  const viewBillType = (id: number) => {
    navigate(`/admin/bills/types/${id}`);
  };

  const deleteBillType = async (id: number) => {
    await client.delete<ResponseWithNoData>(`/bill-types/${id}`);
    window.location.reload();
  };

  return (
    <AdminPage
      title="Manage Bill Types"
      requiredPermissions={[AdminPermissions.PROGRAMME_MANAGEMENT]}
    >
      <DataTable
        title="Bill Types List"
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
            accessorKey: "name",
            header: "Bill Type Name",
            renderCell: (value) => <span>{value.toString()}</span>,
          },
          {
            accessorKey: "programme",
            header: "Bill Type For Programme",
            renderCell: (value) => <span>{value.toString()}</span>,
          },
        ]}
        extras={
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full">
                  Create New Bill Type
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Bill Type</DialogTitle>
                  <DialogDescription>
                    Enter the bill type's details.
                  </DialogDescription>
                </DialogHeader>
                <CreateBillTypeForm />
              </DialogContent>
            </Dialog>
          </div>
        }
        actions={(record) => [
          <Button
            variant="outline"
            className="w-full"
            onClick={() => viewBillType(record.id)}
          >
            View
          </Button>,
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => deleteBillType(record.id)}
          >
            Delete
          </Button>,
        ]}
      />
    </AdminPage>
  );
};

export default ViewAllBillTypes;
