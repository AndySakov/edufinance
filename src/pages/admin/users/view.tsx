import { UpdateUserForm } from "@/components/ui/forms/user/update";
import AdminPage from "@/components/ui/page/admin";
import { Spinner } from "@/components/ui/spinner";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import { useAuth } from "@/shared/store";
import { ResponseWithOptionalData } from "@/shared/types/data";
import { User, userToAdmin } from "@/shared/types/user";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

const ViewUser = () => {
  const params = useParams();
  const client = useClient();
  const { user } = useAuth();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["admin", params.id],
    queryFn: async () => {
      const res = await client.get<ResponseWithOptionalData<User>>(
        `/admins/${params.id}`
      );
      if (res.data.success) {
        return userToAdmin(res.data.data, Number(params.id));
      } else {
        return undefined;
      }
    },
  });

  if (user?.id === Number(params.id)) {
    return (
      <Navigate
        to="/admin/users"
        replace={true}
        state={{
          toast: {
            title: "Error",
            description: "You cannot edit your own user details.",
            variant: "destructive",
          },
        }}
      />
    );
  }

  if (isError) {
    console.log(error);
  }

  return (
    <AdminPage
      title={`User Details - ${data?.firstName} ${data?.lastName}`}
      requiredPermissions={[
        AdminPermissions.USER_MANAGEMENT,
        AdminPermissions.SECURITY_AND_ACCESS_CONTROL,
      ]}
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
              <h2 className="font-semibold text-lg">Error loading user</h2>
              <p className="text-muted-foreground text-sm">
                An error occurred while loading the user details.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <UpdateUserForm user={data ?? undefined} />
      )}
    </AdminPage>
  );
};

export default ViewUser;
