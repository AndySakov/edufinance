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
import { CreatePaymentCategoryForm } from "@/components/ui/forms/payment-category/create";
import AdminPage from "@/components/ui/page/admin";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import {
  ResponseWithNoData,
  ResponseWithOptionalData,
} from "@/shared/types/data";
import { PaymentCategory } from "@/shared/types/payment-category";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

const ViewAllPaymentCategories = () => {
  const client = useClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["payment-categories"],
    queryFn: async () => {
      const { data } = await client.get<
        ResponseWithOptionalData<PaymentCategory[]>
      >("/payment-category");
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

  const viewPaymentCategory = (id: number) => {
    navigate(`/admin/payments/categories/${id}`);
  };

  const deletePaymentCategory = async (id: number) => {
    await client.delete<ResponseWithNoData>(`/payment-category/${id}`);
    window.location.reload();
  };

  return (
    <AdminPage
      title="Manage Payment Categories"
      requiredPermissions={[AdminPermissions.PROGRAMME_MANAGEMENT]}
    >
      <DataTable
        title="Payment Categories List"
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
            header: "Programme Name",
            renderCell: (value) => <span>{value.toString()}</span>,
          },
        ]}
        extras={
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full">
                  Create New Payment Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Payment Category</DialogTitle>
                  <DialogDescription>
                    Enter the payment category's details.
                  </DialogDescription>
                </DialogHeader>
                <CreatePaymentCategoryForm />
              </DialogContent>
            </Dialog>
          </div>
        }
        actions={(record) => [
          <Button
            variant="outline"
            className="w-full"
            onClick={() => viewPaymentCategory(record.id)}
          >
            View
          </Button>,
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => deletePaymentCategory(record.id)}
          >
            Delete
          </Button>,
        ]}
      />
    </AdminPage>
  );
};

export default ViewAllPaymentCategories;
