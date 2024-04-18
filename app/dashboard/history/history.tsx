
import { Request, columns } from "./columns"
import { Button } from "../../../components/ui/button"
import { DataTable } from "../../../components/ui/data-table-history"
import { NavBar } from "@/components/nav"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function getData(): Promise<Request[]> {

  
  // Fetch data from your API here.
  const supabase = createClient()
  
  const { data, error: error1 } = await supabase.auth.getUser()
  console.log(error1)
  if (error1 || !data?.user) {
    console.log("redirect to main")
    redirect('/')
  }
  const user = data.user;

  let { data: expenses, error } = await supabase
  .from('expenses')
  .select('*')

  if (error) {
    console.log("redirect to main")
    redirect('/dashboard')
  } 
  
  // let { data: myGroup, error: error1 } = await supabase
  // .from('groups')
  // .select('*')
  // .eq('name', 'test');

  
  // let { data: expenses, error: error2 } = await supabase
  // .from('users')
  // .select(`
  //   *,
  //   groups (
  //     group_id
  //   )
  // `)
  // .eq('groups.group_id', myGroup);

  // if (error1 || error2) {
  //   console.log("redirect to main")
  //   redirect('/dashboard')
  // } 



  
  if (expenses) {
    const requests: Request[] = expenses.map((item: any) => ({
      id: item.id,
      date: new Date(item.creation_date), //rdy
      amount: item.amount, //rdy
      payer: user?.full_name, //rdy
      expense: item.description, //rdy
      typeOfAction: item.testingshit, //NOT IN TABLE
      receiver: item.receiver, //NOT IN TABLE
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
  const user = data.user;

  return (
    <>
      <div>
        {/* <h1><pre>{JSON.stringify(data.user.user_metadata.full_name, null, 2)}</pre></h1> */}
        <h1><pre>{JSON.stringify(user, null, 2)}</pre></h1>
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={requestdata} />
      </div>
      
    </>
  );
}

export { History };