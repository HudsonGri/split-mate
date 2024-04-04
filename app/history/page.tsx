// page.tsx
import { columns, Request } from "./columns"
import { Button } from "../../components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { NavBar } from "@/components/nav"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function getData(): Promise<Request[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      date: "2021-10-01",
      amount: "100",
      sender: "John B.",
      expense: "Paper Towels",
      typeOfAction: "Payment",
      receiver: "Jane D.",
    },
    {
      id: "2",
      date: "2021-10-02",
      amount: "200",
      sender: "Jane D.",
      expense: "Toilet Paper",
      typeOfAction: "Payment",
      receiver: "Jane D.",
    },
    // ...
  ]
}

export default async function HistoryPage() {
  const requestdata = await getData()
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  console.log(error)

  if (error || !data?.user) {
    console.log("redirect to main")
    redirect('/')
  }

  const user = data.user

  return (
    <>
      <NavBar links={["Profile"]} user_details={user} />
      <div className="flex items-center justify-center space-y-2 pt-8">
        <h2 className="text-3xl font-bold tracking-tight">History</h2>
      </div>

      <div className="container mx-auto py-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Column 1</TableHead>
              <TableHead>Column 2</TableHead>
              <TableHead>Column 3</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Row 1, Cell 1</TableCell>
              <TableCell>Row 1, Cell 2</TableCell>
              <TableCell>Row 1, Cell 3</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 2, Cell 1</TableCell>
              <TableCell>Row 2, Cell 2</TableCell>
              <TableCell>Row 2, Cell 3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="container mx-auto py-10">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.header}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
      </div>

    </>
  )
}