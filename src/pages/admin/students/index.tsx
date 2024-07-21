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
import { CreateStudentForm } from "@/components/ui/forms/student/create";
import AdminPage from "@/components/ui/page/admin";
import { PaginatedTable } from "@/components/ui/paginated-table";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import { PaginatedData, ResponseWithNoData } from "@/shared/types/data";
import { User, userToStudent } from "@/shared/types/user";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

const ViewAllStudents = () => {
  const client = useClient();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["students", { page, pageSize, search }],
    queryFn: async () => {
      const { data } = await client.get<PaginatedData<User>>("/students", {
        params: {
          page,
          limit: pageSize,
          query: search,
        },
      });
      setTotalPages(Math.ceil(data.total / pageSize));
      const results = data.data.map((user, index) =>
        userToStudent(user, (page - 1) * pageSize + index + 1)
      );
      return results;
    },
  });

  const debouncedRefetch = useDebouncedCallback(() => {
    refetch();
  }, 1000);

  const viewStudent = (id: number) => {
    navigate(`/admin/students/${id}`);
  };

  const deleteStudent = async (id: number) => {
    await client.delete<ResponseWithNoData>(`/students/${id}`);
    window.location.reload();
  };

  return (
    <AdminPage
      title="Manage Students"
      requiredPermissions={[AdminPermissions.STUDENT_MANAGEMENT]}
    >
      <PaginatedTable
        title="Students List"
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
            accessorKey: "studentId",
            header: "Student ID",
            renderCell: (value) => <span>{value?.toString()}</span>,
          },
          {
            accessorKey: "email",
            header: "Email",
            renderCell: (value) => <span>{value?.toString()}</span>,
          },
          {
            accessorKey: "firstName",
            header: "First Name",
            renderCell: (value) => <span>{value?.toString()}</span>,
          },
          {
            accessorKey: "middleName",
            header: "Middle Name",
            renderCell: (value) => <span>{value?.toString()}</span>,
          },
          {
            accessorKey: "lastName",
            header: "Last Name",
            renderCell: (value) => <span>{value?.toString()}</span>,
          },
          {
            accessorKey: "gender",
            header: "Gender",
            renderCell: (value) => (
              <Badge variant={value === "male" ? "default" : "secondary"}>
                {`${value?.toString()[0].toUpperCase()}${value
                  ?.toString()
                  .slice(1)}`}
              </Badge>
            ),
          },
          {
            accessorKey: "dateOfBirth",
            header: "Date of Birth",
            renderCell: (value) => (
              <span>{value ? new Date(value).toLocaleDateString() : ""}</span>
            ),
          },
          {
            accessorKey: "phoneNumber",
            header: "Phone Number",
            renderCell: (value) => <span>{value?.toString()}</span>,
          },
          {
            accessorKey: "programme",
            header: "Programme",
            renderCell: (value) => <span>{value?.toString()}</span>,
          },
        ]}
        extras={
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full">
                  Create New Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Student</DialogTitle>
                  <DialogDescription>
                    Enter student's personal information.
                  </DialogDescription>
                </DialogHeader>
                <CreateStudentForm />
              </DialogContent>
            </Dialog>
          </div>
        }
        actions={(record) => [
          <Button
            variant="outline"
            className="w-full"
            onClick={() => viewStudent(record.id)}
          >
            View
          </Button>,
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => deleteStudent(record.id)}
          >
            Delete
          </Button>,
        ]}
      />
    </AdminPage>
  );
};

export default ViewAllStudents;
