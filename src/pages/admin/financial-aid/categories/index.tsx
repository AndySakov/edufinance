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
import { CreateFinancialAidCategoryForm } from "@/components/ui/forms/financial-aid/category/create";
import AdminPage from "@/components/ui/page/admin";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import {
  ResponseWithNoData,
  ResponseWithOptionalData,
} from "@/shared/types/data";
import { FinancialAidCategory } from "@/shared/types/financial-aid/category";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

const ViewAllFinancialAidCategories = () => {
  const client = useClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["financial-aid-categories"],
    queryFn: async () => {
      const { data } = await client.get<
        ResponseWithOptionalData<FinancialAidCategory[]>
      >("/financial-aid-types");
      const results = data.data.map((financialAidCategory, index) => ({
        ...financialAidCategory,
        index: index + 1,
      }));
      return results;
    },
  });

  const debouncedRefetch = useDebouncedCallback(() => {
    refetch();
  }, 1000);

  const viewFinancialAidCategory = (id: number) => {
    navigate(`/admin/financial-aid/categories/${id}`);
  };

  const deleteFinancialAidCategory = async (id: number) => {
    await client.delete<ResponseWithNoData>(`/financial-aid-types/${id}`);
    window.location.reload();
  };

  return (
    <AdminPage
      title="Manage Financial Aid Categories"
      requiredPermissions={[AdminPermissions.FINANCIAL_AID_GRADES_MANAGEMENT]}
    >
      <DataTable
        title="Financial Aid Categories List"
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
            header: "Name",
            renderCell: (value) => <span>{value.toString()}</span>,
          },
        ]}
        extras={
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full">
                  Create New Financial Aid Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Financial Aid Category</DialogTitle>
                  <DialogDescription>
                    Enter the financial aid category's details.
                  </DialogDescription>
                </DialogHeader>
                <CreateFinancialAidCategoryForm />
              </DialogContent>
            </Dialog>
          </div>
        }
        actions={(record) => [
          <Button
            variant="outline"
            className="w-full"
            onClick={() => viewFinancialAidCategory(record.id)}
          >
            View
          </Button>,
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => deleteFinancialAidCategory(record.id)}
          >
            Delete
          </Button>,
        ]}
      />
    </AdminPage>
  );
};

export default ViewAllFinancialAidCategories;
