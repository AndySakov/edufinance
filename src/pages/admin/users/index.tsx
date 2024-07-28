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
import { CreateUserForm } from "@/components/ui/forms/user/create";
import AdminPage from "@/components/ui/page/admin";
import { PaginatedTable } from "@/components/ui/paginated-table";
import { TableColumn } from "@/components/ui/table";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import { convertToTitleCase } from "@/shared/helpers";
import { PaginatedData, ResponseWithNoData } from "@/shared/types/data";
import { Admin, User, userToAdmin } from "@/shared/types/user";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

const ViewAllUsers = () => {
  const client = useClient();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["admins", { page, pageSize, search }],
    queryFn: async () => {
      const { data } = await client.get<PaginatedData<User>>("/admins", {
        params: {
          page,
          limit: pageSize,
          query: search,
        },
      });
      setTotalPages(Math.ceil(data.total / pageSize));
      const results = data.data.map((user, index) =>
        userToAdmin(user, (page - 1) * pageSize + index + 1)
      );
      return results;
    },
  });

  const debouncedRefetch = useDebouncedCallback(() => {
    refetch();
  }, 1000);

  const viewUser = (id: number) => {
    navigate(`/admin/users/${id}`);
  };

  const deleteUser = async (id: number) => {
    await client.delete<ResponseWithNoData>(`/admins/${id}`);
    window.location.reload();
  };

  return (
    <AdminPage
      title="Manage Users"
      requiredPermissions={[
        AdminPermissions.USER_MANAGEMENT,
        AdminPermissions.SECURITY_AND_ACCESS_CONTROL,
      ]}
    >
      <PaginatedTable
        title="Users List"
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
            renderCell: (value) => <span>{value.toString()}</span>,
          },
          {
            accessorKey: "email",
            header: "Email",
            renderCell: (value) => <span>{value.toString()}</span>,
          },
          {
            accessorKey: "firstName",
            header: "First Name",
            renderCell: (value) => <span>{value.toString()}</span>,
          },
          {
            accessorKey: "lastName",
            header: "Last Name",
            renderCell: (value) => <span>{value.toString()}</span>,
          },
          {
            accessorKey: "permissions",
            header: "Permissions",
            renderCell: (value: string[]) => (
              <div className="flex flex-col flex-wrap justify-center items-center w-full">
                {value.map((p) => (
                  <Badge key={p} variant="outline">
                    {convertToTitleCase(p)}
                  </Badge>
                ))}
              </div>
            ),
          } as TableColumn<Admin, keyof Admin>,
        ]}
        extras={
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full">
                  Create New User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Enter user's personal information.
                  </DialogDescription>
                </DialogHeader>
                <CreateUserForm />
              </DialogContent>
            </Dialog>
          </div>
        }
        actions={(record) => [
          <Button
            variant="outline"
            className="w-full"
            onClick={() => viewUser(record.id)}
          >
            View
          </Button>,
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => deleteUser(record.id)}
          >
            Delete
          </Button>,
        ]}
      />
    </AdminPage>
  );
};

export default ViewAllUsers;
