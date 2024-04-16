
import { Request, columns } from "./columns"
import { Button } from "../../../components/ui/button"
import { DataTable } from "../../../components/ui/data-table-history"
import { NavBar } from "@/components/nav"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function getData(): Promise<Request[]> {
  // Fetch data from your API here.
  const supabase = createClient()

  let { data: expenses, error } = await supabase
  .from('expenses')
  .select('*')

  if (error) {
    console.log("redirect to main")
    redirect('/')
  }


  if (expenses) {
    console.log("got here");
    const requests: Request[] = expenses.map((item: any) => ({
      id: item.id,
      date: new Date(item.date),
      amount: item.amount,
      payer: item.payer_id,
      expense: item.expense,
      typeOfAction: item.typeOfAction,
      receiver: item.receiver,
    }));

    return requests;
  }
  

  return [];
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