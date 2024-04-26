
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
  
  //get all users
  const { data: allUsers, error: errorAllUsers } = await supabase.auth.getUser() //get all users

  const { data: test, error: errortest } = await supabase // test all users
  .from('auth.users')
  .select('*');

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
  console.log("groupId = ", groupId);

  let { data: expenses, error: error3 } = await supabase //get expenses in group & get payer names
    .from('expenses')
    .select('*')
    .eq('group_id', groupId)

  if (error3 || !expenses) {
    console.log("redirect to main")
    redirect('/dashboard')
  } 

  
  if (expenses) {

    // const payerIds = expenses.map((item: any) => item.payer_id);

    // const { data: payerNames, error: error4 } = await supabase //get payer names
    //   .from('auth.users')
    //   .select('full_name')
    //   .in('id', payerIds);
    
    // if (error4 || !payerNames) {
    //   console.log("redirect to main")
    //   redirect('/dashboard')
    // }

    // const payerMap = new Map(payerNames.map((payer) => [payer.id, payer.full_name]));

    const requests: Request[] = expenses.map((item: any) => ({
      id: item.id,
      date: new Date(item.creation_date), //rdy
      amount: item.amount, //rdy
      // payer: payerMap.get(item.payer_id), //NEED FIXING
      payer: item.payer_id, //NEED FIXING
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
        <h1><pre>{JSON.stringify(data.user.user_metadata.full_name, null, 2)}</pre></h1><br></br>
        <h1><pre>{JSON.stringify(user, null, 2)}</pre></h1>
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={requestdata} />
      </div>
      
    </>
  );
}

export { History };