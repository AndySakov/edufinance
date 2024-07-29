import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableColumn,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { ListNumbers, MagnifyingGlass } from "@phosphor-icons/react";
import { Spinner } from "./spinner";
import { ReactNode } from "react";

export type PaginatedTableProps<T> = {
  title: string;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  records: T[];
  totalPages: number;
  page: number;
  pageSize: number;
  search: string;
  pageSizes: number[];
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  columns: TableColumn<T, keyof T>[];
  onRowClick?: (record: T) => void;
  extras?: ReactNode | ReactNode[] | undefined;
  actions?: (record: T) => ReactNode | ReactNode[] | undefined;
  hasSearch?: boolean;
};

export const PaginatedTable = <T,>(props: PaginatedTableProps<T>) => {
  const {
    title,
    records,
    isLoading,
    isError,
    error,
    totalPages,
    page,
    pageSize,
    pageSizes,
    search,
    setPage,
    setPageSize,
    setSearch,
    columns,
    onRowClick = () => {},
    extras,
    actions,
    hasSearch = false,
  } = props;
  return (
    <div className="flex flex-col gap-4 bg-white">
      <div className="flex md:flex-row flex-col justify-between items-center gap-4 md:gap-0 bg-muted px-4 py-4 rounded-lg">
        <h2 className="font-semibold text-xl">{title}</h2>
        <div className="flex md:flex-row flex-col items-center gap-4">
          {hasSearch ? (
            <div className="relative flex-1 w-full md:w-1/3">
              <MagnifyingGlass className="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <ListNumbers className="mr-2 w-4 h-4" />
                {pageSize} per page
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuRadioGroup
                value={pageSize.toString()}
                onValueChange={(value) => setPageSize(parseInt(value))}
              >
                {pageSizes.map((size) => (
                  <DropdownMenuRadioItem key={size} value={size.toString()}>
                    {size} per page
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
                      <div className="flex gap-4">{actions(record)}</div>
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
      <div className="flex justify-center items-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === page}
                  onClick={() => setPage(p)}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
