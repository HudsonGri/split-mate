import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request, res: Response) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized access" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const user = data.user;

  if (!req.json) {
    return new Response(
      JSON.stringify({ success: false, error: "Bad request" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  const { group_id } = await req.json();

  const groupId = group_id;

  if (!groupId) {
    return new Response(
      JSON.stringify({ success: false, error: "Group ID is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const { data: expenses, error: error3 } = await supabase
    .from("expenses")
    .select("*")
    .eq("group_id", groupId);

  if (error3 || !expenses) {
    return new Response(
      JSON.stringify({ success: false, error: "Expenses not found" }),
      {
        status: 302,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const { data: paybacks, error: error4 } = await supabase
    .from("paybacks")
    .select("*")
    .eq("group_id", groupId);

  if (error4) {
    console.error("Error fetching paybacks:", error4.message);
    return new Response(
      JSON.stringify({ success: false, error: error4.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const { data: allusers, error: error5 } = await supabase
    .from("profiles")
    .select("*");

  if (error5) {
    console.error("Error fetching all users:", error5.message);
    return new Response(
      JSON.stringify({ success: false, error: error5.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  console.log(expenses, paybacks);
  if (expenses && allusers && paybacks) {
    const getUserName = (user: any) => {
      return user?.first_name
        ? `${user.first_name} ${user.last_name}`
        : user.email;
    };

    const userName = new Map(
      allusers.map((user: any) => [user.id, getUserName(user)]),
    );

    const expenseRequests = expenses.map((item: any) => ({
      id: item.id,
      date: new Date(item.creation_date),
      amount: item.amount,
      payer: userName.get(item.payer_id) || item.payer_id,
      expense: item.description,
      receiver: item.receiver,
      typeOfAction: "Purchase",
    }));

    const paybackRequests = paybacks.map((item: any) => ({
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

    return new Response(JSON.stringify(allRequests), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(
      JSON.stringify({ success: false, error: "Data not found" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
