"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "../../components/ui/checkbox"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { User } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Request = {
  id: string
  date: string
  name: string
  user_submitted: string
  status: "Pending approval" | "Claimed" | "Purchased" | "Unclaimed"
}

export const columns: ColumnDef<Request>[] = [
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
        id: "actions",
        cell: ({ row }) => {
            const request = row.original
        
            return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(request.id)}
                >
                    Copy payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View requestor</DropdownMenuItem>
                <DropdownMenuItem>View request details</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            )
        },
    },
  
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorFn: (row) => new Date(row.date),
        accessorKey: "date",
        header: "Date",
        cell: ({ cell }) => {
            const date = cell.getValue() as Date;
            return <div>{date.toLocaleDateString()}</div>
        }
    },
    {
        accessorKey: "user_submitted",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                User Submitted
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        cell: ({ row }) => {
            const request = row.original;
            const handleClick = () => {
                console.log("View profile of", request.user_submitted);
            }
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>{request.user_submitted}</DropdownMenuTrigger>
                    <DropdownMenuContent>
                    <DropdownMenuItem onSelect={handleClick}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
    },
]
