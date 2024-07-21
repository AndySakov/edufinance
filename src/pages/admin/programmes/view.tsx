import { UpdateProgrammeForm } from "@/components/ui/forms/programme/update";
import AdminPage from "@/components/ui/page/admin";
import { Spinner } from "@/components/ui/spinner";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import { ResponseWithOptionalData } from "@/shared/types/data";
import { Programme } from "@/shared/types/programme";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const ViewProgramme = () => {
  const params = useParams();
  const client = useClient();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["programme", params.id],
    queryFn: async () => {
      const res = await client.get<ResponseWithOptionalData<Programme>>(
        `/programmes/${params.id}`
      );
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
      title={`Programme Details - ${data?.name}`}
      requiredPermissions={[AdminPermissions.PROGRAMME_MANAGEMENT]}
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
              <h2 className="font-semibold text-lg">Error loading programme</h2>
              <p className="text-muted-foreground text-sm">
                An error occurred while loading the programme details.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <UpdateProgrammeForm programme={data ?? undefined} />
      )}
    </AdminPage>
  );
};

export default ViewProgramme;
