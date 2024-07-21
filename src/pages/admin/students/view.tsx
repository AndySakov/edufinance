import { UpdateStudentForm } from "@/components/ui/forms/student/update";
import AdminPage from "@/components/ui/page/admin";
import { Spinner } from "@/components/ui/spinner";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import { ResponseWithOptionalData } from "@/shared/types/data";
import { User, userToStudent } from "@/shared/types/user";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const ViewStudent = () => {
  const params = useParams();
  const client = useClient();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["student", params.id],
    queryFn: async () => {
      const res = await client.get<ResponseWithOptionalData<User>>(
        `/students/${params.id}`
      );
      if (res.data.success) {
        return userToStudent(res.data.data, Number(params.id));
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
      title={`Student Details - ${data?.firstName} ${data?.lastName}`}
      requiredPermissions={[AdminPermissions.STUDENT_MANAGEMENT]}
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
              <h2 className="font-semibold text-lg">Error loading student</h2>
              <p className="text-muted-foreground text-sm">
                An error occurred while loading the student details.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <UpdateStudentForm student={data ?? undefined} />
      )}
    </AdminPage>
  );
};

export default ViewStudent;
