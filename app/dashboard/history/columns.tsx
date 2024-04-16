"use client"
// columns.tsx
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "../../../components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"

import { User } from "lucide-react"

export type Request = {
    id: string
    date: Date
    amount: string
    payer: string
    expense: string
    typeOfAction: "Payment" | "Request" // Add more if needed
    receiver: string
}

export const columns: ColumnDef<Request>[] = [
    {
        id: "actions",
        header: "Actions",
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(request.id)}>
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
        header: "Payer",
        cell: ({ row }) => {
            const request = row.original;
            const handleClick = () => {
                console.log("View profile of", request.payer);
            }
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>{request.payer}</DropdownMenuTrigger>
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
    {
        accessorKey: "receiver",
        header: "Receiver",
    },
    {
        accessorKey: "expense",
        header: "Expense",
    },
    {
        accessorKey: "typeOfAction",
        header: "Type of Action",
    },
]