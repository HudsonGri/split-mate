
import { Request, columns } from "./columns"
import { Button } from "../../../components/ui/button"
import { DataTable } from "../../../components/ui/data-table-history"
import { NavBar } from "@/components/nav"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function getData(): Promise<Request[]> {

  
  // Fetch data from your API here.
  const supabase = createClient()
  
  const { data, error: error1 } = await supabase.auth.getUser() //get self user
  console.log(error1)
  if (error1 || !data?.user) {
    console.log("redirect to main")
    redirect('/')
  }
  const user = data.user;
  
  //filter & select correct group
  let { data: userGroup, error: error2 } = await supabase //get group
    .from('group_membership')
    .select('group_id')
    .eq('user_id', user.id);

  if (error2 || !userGroup || userGroup.length === 0) {
    console.log("redirect to main");
    redirect('/dashboard');
  }

  const groupId = userGroup[0].group_id;

  let { data: expenses, error: error3 } = await supabase //get expenses in group & get payer names
    .from('expenses')
    .select('*')
    .eq('group_id', groupId)

  if (error3 || !expenses) {
    console.log("redirect to main")
    redirect('/dashboard')
  } 

  let { data: paybacks, error: error4 } = await supabase
    .from('paybacks')
    .select('*')
    .eq('group_id', groupId);

  if (error4) {
    console.error('Error fetching paybacks:', error4.message);
  }

  let {data: allusers, error: error5} = await supabase //get all users
    .from('auth_view')
    .select('*') //MAYBE optimize by groupid
  
  if (error5) {
    console.error('Error fetching all users:', error5.message);
  } else {
    console.log("All users = ", allusers);
  }
  
  if (expenses && allusers && paybacks) {

    const userName = new Map(allusers.map((user: any) => [user.id, user.raw_user_meta_data.full_name]));

    const expenseRequests: Request[] = expenses.map((item: any) => ({
      id: item.id,
      date: new Date(item.creation_date),
      amount: item.amount,
      payer: userName.get(item.payer_id) || item.payer_id,
      expense: item.description,
      receiver: item.receiver,
      typeOfAction: "Purchase",
    }));

    const paybackRequests: Request[] = paybacks.map((item: any) => ({
      id: item.payback_id,
      date: new Date(item.creation_date),
      amount: item.amount,
      payer: userName.get(item.payer_id) || item.payer_id,
      expense: item.description,
      typeOfAction: "Payment",
      receiver: userName.get(item.recipient_id) || item.recipient_id,
    }));

    const allRequests = [...expenseRequests, ...paybackRequests];
    allRequests.sort((a, b) => b.date.getTime() - a.date.getTime());

    return allRequests;
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
      {/* <div>
        <h1><pre>{JSON.stringify(data.user.user_metadata.full_name, null, 2)}</pre></h1><br></br>
        <h1><pre>{JSON.stringify(data, null, 2)}</pre></h1>
        <h1><pre>{data.user.}</pre></h1>
      </div> */}
      <div className="container mx-auto">
        <DataTable columns={columns} data={requestdata} />
      </div>
      
    </>
  );
}

export { History };