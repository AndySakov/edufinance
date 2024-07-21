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
import { CreateFinancialAidDiscountForm } from "@/components/ui/forms/financial-aid/discount/create";
import AdminPage from "@/components/ui/page/admin";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import {
  ResponseWithNoData,
  ResponseWithOptionalData,
} from "@/shared/types/data";
import { FinancialAidDiscount } from "@/shared/types/financial-aid/discount";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

const ViewAllFinancialAidDiscounts = () => {
  const client = useClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["financial-aid-discounts"],
    queryFn: async () => {
      const { data } = await client.get<
        ResponseWithOptionalData<FinancialAidDiscount[]>
      >("/financial-aid-discounts");
      const results = data.data.map((financialAidDiscount, index) => ({
        ...financialAidDiscount,
        index: index + 1,
      }));
      return results;
    },
  });

  const debouncedRefetch = useDebouncedCallback(() => {
    refetch();
  }, 1000);

  const viewFinancialAidDiscount = (id: number) => {
    navigate(`/admin/financial-aid/discounts/${id}`);
  };

  const deleteFinancialAidDiscount = async (id: number) => {
    await client.delete<ResponseWithNoData>(`/financial-aid-discounts/${id}`);
    window.location.reload();
  };

  return (
    <AdminPage
      title="Manage Financial Aid Discounts"
      requiredPermissions={[AdminPermissions.FINANCIAL_AID_GRADES_MANAGEMENT]}
    >
      <DataTable
        title="Financial Aid Discounts List"
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
          {
            accessorKey: "amount",
            header: "Amount",
            renderCell: (value) => (
              <span>{"₦" + new Intl.NumberFormat("en-US").format(+value)}</span>
            ),
          },
          {
            accessorKey: "billType",
            header: "Bill Type",
            renderCell: (value) => <span>{value.toString()}</span>,
          },
          {
            accessorKey: "financialAidType",
            header: "Financial Aid Type",
            renderCell: (value) => <span>{value.toString()}</span>,
          },
        ]}
        extras={
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full">
                  Create New Financial Aid Discount
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Financial Aid Discount</DialogTitle>
                  <DialogDescription>
                    Enter the financial aid discount's details.
                  </DialogDescription>
                </DialogHeader>
                <CreateFinancialAidDiscountForm />
              </DialogContent>
            </Dialog>
          </div>
        }
        actions={(record) => [
          <Button
            variant="outline"
            className="w-full"
            onClick={() => viewFinancialAidDiscount(record.id)}
          >
            View
          </Button>,
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => deleteFinancialAidDiscount(record.id)}
          >
            Delete
          </Button>,
        ]}
      />
    </AdminPage>
  );
};

export default ViewAllFinancialAidDiscounts;
