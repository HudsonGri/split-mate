"use client"

/**
 * Template Code taken from: https://ui.shadcn.com/docs/components/data-table
 */

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export type Payback = {
  id: string
  payer: string
  amount: number
  group: string
  description: string
}

export const columns: ColumnDef<Payback>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
        )
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
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("group")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div>Amount</div>,
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("amount")) / 100;

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>
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
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-xs w- truncate">
                    { row.original.description }
                </PopoverContent>
            </Popover>
        </div>   
      )
    },
  },
]

export function PaybackTable() {
    const fetchPaybacks = async () => {
        const res = await fetch('/api/paybacks/approve', { method: "GET" });

        if (!res.ok) {
            return router.push('/error');
        }

        const data = await res.json();
        setData(data);
        table.toggleAllPageRowsSelected(false);
    }

    const approvePaybacks = async (approvedPaybacks: string[]) => {
        setSubmitting(true);

        const res = await fetch('/api/paybacks/approve', { 
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ approvedPaybacks })
            })
        
        if (res.ok) {
            await fetchPaybacks();
            setSubmitting(false);
        }
        else {
            router.push('/error');
        }
    };

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const [data, setData] = React.useState<Payback[]>([]);
    const router = useRouter();

    React.useEffect(() => { fetchPaybacks(); }, []);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
        sorting,
        columnFilters,
        rowSelection,
        },
    })

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
                            header.getContext()
                        )}
                    </TableHead>
                )
                })}
            </TableRow>
            ))}
        </TableHeader>
        <TableBody>
            {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
                <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                >
                {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                    {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
    <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
        <Button
            size="sm"
            onClick={() => approvePaybacks(table.getRowModel().rows.filter((row) => row.getIsSelected() ).map((row) => row.original.id))}
            disabled={table.getFilteredSelectedRowModel().rows.length === 0 || submitting}
        >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Approve Paybacks
        </Button>
        </div>
    </div>
    </div>
)
}
