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
import { CreateProgrammeForm } from "@/components/ui/forms/programme/create";
import AdminPage from "@/components/ui/page/admin";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import {
  ResponseWithNoData,
  ResponseWithOptionalData,
} from "@/shared/types/data";
import { Programme } from "@/shared/types/programme";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

const ViewAllProgrammes = () => {
  const client = useClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["programmes"],
    queryFn: async () => {
      const { data } = await client.get<ResponseWithOptionalData<Programme[]>>(
        "/programmes"
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

  const viewProgramme = (id: number) => {
    navigate(`/admin/programmes/${id}`);
  };

  const deleteProgramme = async (id: number) => {
    await client.delete<ResponseWithNoData>(`/programmes/${id}`);
    window.location.reload();
  };

  return (
    <AdminPage
      title="Manage Programmes"
      requiredPermissions={[AdminPermissions.PROGRAMME_MANAGEMENT]}
    >
      <DataTable
        title="Programmes List"
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
            accessorKey: "programmeId",
            header: "Programme ID",
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
                  Create New Programme
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Programme</DialogTitle>
                  <DialogDescription>
                    Enter the programme's details.
                  </DialogDescription>
                </DialogHeader>
                <CreateProgrammeForm />
              </DialogContent>
            </Dialog>
          </div>
        }
        actions={(record) => [
          <Button
            variant="outline"
            className="w-full"
            onClick={() => viewProgramme(record.id)}
          >
            View
          </Button>,
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => deleteProgramme(record.id)}
          >
            Delete
          </Button>,
        ]}
      />
    </AdminPage>
  );
};

export default ViewAllProgrammes;
