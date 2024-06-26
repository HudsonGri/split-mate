"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "../ui/checkbox"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { User } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Expense = {
  id: string
  group: string
  payer: string
  amount: string
  date: string
  description: string
}

export const admincolumns: ColumnDef<Expense>[] = [
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
            const expense = row.original;
            async function deleteExpense(expenseID: string, groupID: string) {
                // Fetch data from your API here.
            
                const response = await fetch("/api/expenses/delete", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ expenseID , groupID}),
                });
            
                const data = await response.json();
                    if (data.success) {
                        // Handle success (e.g., show a success message)
                        console.log("Name updated successfully");
                        window.location.reload();
                    } else {
                        // Handle error
                        console.error("Failed to update group name");
                    }
            }
        
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
                    onClick={() => navigator.clipboard.writeText(expense.id)}
                >
                    Copy expense ID
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => deleteExpense(expense.id, expense.group)}
                >
                    Delete expense
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View expense</DropdownMenuItem>
                <DropdownMenuItem>View expense details</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            )
        },
    },
  
    {
        accessorKey: "description",
        header: "Description",
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
        cell: ({ row }) => {
            const expense = row.original;
            const handleClick = () => {
                console.log("View profile of", expense.payer);
            }
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>{expense.payer}</DropdownMenuTrigger>
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
        accessorKey: "amount",
        header: "Amount",
    },
]
