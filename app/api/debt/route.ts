import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request, res: Response) {

const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "User not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const user_id = user.id;

  // Extract the group ID and user ID from the request body
  const { group_id } = await req.json();
  console.log("group_id: ", group_id)

  // Query for all users in the group
  const { data: groupUsers, error: groupUsersError } = await supabase
    .from("group_membership")
    .select("user_id")
    .eq("group_id", group_id);

  if (groupUsersError) {
    console.log(groupUsersError);
    return new Response(
      JSON.stringify({
        error: "Failed to retrieve group users",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Query for all expenses within the group
  const { data: expenses, error: expensesError } = await supabase
    .from("expenses")
    .select("*")
    .eq("group_id", group_id);

  if (expensesError) {
    return new Response(
      JSON.stringify({
        error: "Failed to retrieve expenses",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Query for all paybacks by this user
  const { data: userPaybacks, error: userPaybacksError } = await supabase
    .from("paybacks")
    .select("*")
    .eq("payer_id", user_id)
    .eq("group_id", group_id);

  if (userPaybacksError) {
    return new Response(
      JSON.stringify({
        error: "Failed to retrieve user paybacks",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Calculate the total debt the user owes
  let totalOwed = 0;
  expenses.forEach(expense => {
    if (expense.payer_id !== user_id) { // Only consider expenses not paid by the user
      const sharedAmount = expense.amount / groupUsers.length;
      totalOwed += sharedAmount;
    }
  });

  // Calculate the total amount the user has paid back
  let totalPaidBack = userPaybacks.reduce((acc, payback) => acc + payback.amount, 0);

  // Net amount the user still owes
  const netOwed = totalOwed - totalPaidBack;

  // Calculate the total amount the user is owed by others
  let totalOwedToUser = 0;
  expenses.filter(expense => expense.payer_id === user_id).forEach(expense => {
    const sharedAmount = expense.amount / groupUsers.length;
    totalOwedToUser += (expense.amount - sharedAmount); // Total minus the user's share
  });

  // Adjust total owed to the user by subtracting the amount others have paid back to them
  let totalPaidToUser = userPaybacks.reduce((acc, payback) => acc + payback.amount, 0);
  const netOwedToUser = totalOwedToUser - totalPaidToUser;

  // Return the results
  return new Response(
    JSON.stringify({
      netOwed,
      netOwedToUser
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
