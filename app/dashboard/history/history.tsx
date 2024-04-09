
import { Request, columns } from "./columns"
import { Button } from "../../../components/ui/button"
import { DataTable } from "../../../components/ui/data-table-history"
import { NavBar } from "@/components/nav"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function getData(): Promise<Request[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      date: new Date("2021-10-01"),
      amount: "100",
      sender: "John B.",
      expense: "Paper Towels",
      typeOfAction: "Payment",
      receiver: "Jane D.",
    },
  ]
}

export default async function History() {
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
      <div className="container mx-auto">
        <DataTable columns={columns} data={requestdata} />
      </div>
    </>
  )
}

export { History };