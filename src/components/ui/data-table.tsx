import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableColumn,
} from "@/components/ui/table";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Spinner } from "./spinner";
import { ReactNode } from "react";

export type DataTableProps<T> = {
  title: string;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  records: T[];
  search: string;
  setSearch: (search: string) => void;
  columns: TableColumn<T, keyof T>[];
  onRowClick?: (record: T) => void;
  extras?: ReactNode | ReactNode[] | undefined;
  actions?: (record: T) => ReactNode | ReactNode[] | undefined;
};

export const DataTable = <T,>(props: DataTableProps<T>) => {
  const {
    title,
    records,
    isLoading,
    isError,
    error,
    search,
    setSearch,
    columns,
    onRowClick = () => {},
    extras,
    actions,
  } = props;
  return (
    <div className="flex flex-col gap-4 bg-white">
      <div className="flex justify-between items-center bg-muted px-4 py-4 rounded-lg">
        <h2 className="font-semibold text-xl">{title}</h2>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 w-1/3">
            <MagnifyingGlass className="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          {extras ? (
            <div className="flex items-center gap-4">{extras}</div>
          ) : null}
        </div>
      </div>
      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className="text-center">
                  {column.header}
                </TableHead>
              ))}
              {actions ? (
                <TableHead className="text-center">Actions</TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="justify-center items-center py-10 w-full"
              >
                <Spinner />
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="justify-center items-center my-8 w-full"
              >
                <h2 className="text-center">
                  Error loading results: {error?.message}
                </h2>
              </TableCell>
            </TableRow>
          ) : records.length > 0 ? (
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={index} onClick={() => onRowClick(record)}>
                  {columns.map((column, index) => (
                    <TableCell key={index} className="text-center">
                      {column.renderCell(record[column.accessorKey])}
                    </TableCell>
                  ))}
                  {actions ? (
                    <TableCell>
                      <div className="flex justify-center gap-4">
                        {actions(record)}
                      </div>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="justify-center items-center my-8 w-full"
                >
                  <h2 className="text-center">No records found</h2>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
};
