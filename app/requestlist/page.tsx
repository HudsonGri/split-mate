import { Request, columns } from "./columns"
import { Button } from "../../components/ui/button"
import { DataTable } from "../../components/ui/data-table"
import { NavBar } from "@/components/nav"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function getData(): Promise<Request[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "Paper Towels",
      user_submitted: "John B.",
      status: "pending approval",
    },
    // ...
  ]
}

export default async function RequestListPage() {
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
      <div className="flex flex-col">
      <NavBar links={["Profile"]} user_details={user}/>
        <div className="flex-1 space-y-4 px-8 pb-8">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Request List</h2>
            
              
            </div>
            <div className="flex items-center space-x-2">
              <Button>test</Button>
            </div>
          </div>
        </div>
      </div>
    
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={requestdata} />
        </div>
    </>
  )
}
