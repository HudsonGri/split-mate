"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export type Payback = {
  id: string;
  payer: string;
  amount: number;
  group: string;
  description: string;
};

export const columns: ColumnDef<Payback>[] = [
  {
    accessorKey: "payer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("payer")}</div>
    ),
  },
  {
    accessorKey: "group",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Group
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("group")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div>Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "description",
    enableHiding: false,
    header: () => <div>Description</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-xs w- truncate">
              {row.original.description}
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  },
];

export function PaybackOwed() {
  React.useEffect(() => {
    const fetchDebts = async () => {
      try {
        // Fetch groups
        const groupRes = await fetch("/api/listgroups", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ list_all_members: true }),
        });
        if (!groupRes.ok) throw new Error("Failed to fetch groups");
        const groups = await groupRes.json();

        // Fetch debts for each group and accumulate results
        const debtsPromises = groups.map((group) =>
          fetch("/api/debt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ group_id: group.group_id }),
          }).then((res) => res.json()),
        );
        const debtsResults = await Promise.all(debtsPromises);

        const formattedData = debtsResults.flatMap((debt, index) =>
          Object.entries(debt.amountsOwedPerUser).flatMap(([userId, amounts]) =>
            amounts.map((amount) => ({
              id: amount.expense_id,
              payer: amount.name,
              amount: parseFloat(amount.amount),
              group: groups[index].name,
              description: amount.description,
            })),
          ),
        );
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDebts();
  }, []);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Payback[]>([]);
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
