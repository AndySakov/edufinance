import { UpdateFinancialAidCategoryForm } from "@/components/ui/forms/financial-aid/category/update";
import AdminPage from "@/components/ui/page/admin";
import { Spinner } from "@/components/ui/spinner";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import { ResponseWithOptionalData } from "@/shared/types/data";
import { FinancialAidCategory } from "@/shared/types/financial-aid/category";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const ViewFinancialAidCategory = () => {
  const params = useParams();
  const client = useClient();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["financial-aid-category", params.id],
    queryFn: async () => {
      const res = await client.get<
        ResponseWithOptionalData<FinancialAidCategory>
      >(`/financial-aid-types/${params.id}`);
      if (res.data.success) {
        return res.data.data;
      } else {
        return undefined;
      }
    },
  });

  if (isError) {
    console.log(error);
  }

  return (
    <AdminPage
      title={`Financial Aid Category Details - ${data?.name}`}
      requiredPermissions={[AdminPermissions.FINANCIAL_AID_GRADES_MANAGEMENT]}
    >
      {isLoading ? (
        <div className="mx-auto p-4 container">
          <div className="space-y-6 bg-white shadow-sm mx-auto p-6 rounded-lg max-w-3xl">
            <div>
              <h2 className="font-semibold text-lg">Loading...</h2>
              <Spinner />
            </div>
          </div>
        </div>
      ) : isError ? (
        <div className="mx-auto p-4 container">
          <div className="space-y-6 bg-white shadow-sm mx-auto p-6 rounded-lg max-w-3xl">
            <div>
              <h2 className="font-semibold text-lg">
                Error loading financial aid category
              </h2>
              <p className="text-muted-foreground text-sm">
                An error occurred while loading the financial aid category
                details.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <UpdateFinancialAidCategoryForm
          financialAidCategory={data ?? undefined}
        />
      )}
    </AdminPage>
  );
};

export default ViewFinancialAidCategory;
