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
  const { group_id } = await req.json();

  // Query for all expenses and paybacks related to the group and user
  const [groupUsers, expenses, userPaybacks, paybacksToUser] =
    await Promise.all([
      supabase
        .from("group_membership")
        .select("user_id")
        .eq("group_id", group_id),
      supabase.from("expenses").select("*").eq("group_id", group_id),
      supabase
        .from("paybacks")
        .select("*")
        .eq("payer_id", user_id)
        .eq("group_id", group_id),
      supabase
        .from("paybacks")
        .select("*")
        .eq("recipient_id", user_id)
        .eq("group_id", group_id)
        .eq("approved", true),
    ]);

  if (
    groupUsers.error ||
    expenses.error ||
    userPaybacks.error ||
    paybacksToUser.error
  ) {
    return new Response(
      JSON.stringify({
        error: "Failed to retrieve data",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Calculate the total debt the user owes for expenses they did not initiate
  const totalOwed = expenses.data.reduce((acc, expense) => {
    if (expense.payer_id !== user_id) {
      const sharedAmount = expense.amount / groupUsers.data.length;
      return acc + sharedAmount;
    }
    return acc;
  }, 0);

  const totalPaidBack = userPaybacks.data.reduce(
    (acc, payback) => acc + payback.amount,
    0,
  );

  // Net amount the user still owes
  const netOwed = Math.max(0, totalOwed - totalPaidBack); // Prevent negative values

  // Calculate the total amount the user is owed for expenses they paid
  const totalOwedToUser = expenses.data.reduce((acc, expense) => {
    if (expense.payer_id === user_id) {
      const sharedAmount = expense.amount / groupUsers.data.length;
      return acc + (expense.amount - sharedAmount);
    }
    return acc;
  }, 0);

  const totalPaidToUser = paybacksToUser.data.reduce(
    (acc, payback) => acc + payback.amount,
    0,
  );

  // Net amount owed to the user
  const netOwedToUser = Math.max(0, totalOwedToUser - totalPaidToUser); // Prevent negative values

  // Return the results
  return new Response(
    JSON.stringify({
      netOwed: netOwed.toFixed(2),
      netOwedToUser: netOwedToUser.toFixed(2),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
