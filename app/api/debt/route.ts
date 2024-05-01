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

  // Fetch group members and profiles in one combined query to get names
  const { data: groupMembers, error: groupMembersError } = await supabase
    .from("group_membership")
    .select(
      `
      user_id,
      profiles (
        id,
        first_name,
        last_name
      )
    `,
    )
    .eq("group_id", group_id);

  if (groupMembersError) {
    return new Response(
      JSON.stringify({ error: "Failed to retrieve group members" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Convert group members list into a map for quick access
  let memberNames = {};
  groupMembers.forEach((member) => {
    if (member.profiles) {
      memberNames[member.user_id] =
        `${member.profiles.first_name} ${member.profiles.last_name}`;
    }
  });

  const [expenses, userPaybacks, paybacksToUser] = await Promise.all([
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

  let amountsOwedPerUser = {};
  let totalOwed = 0;

  expenses.data.forEach((expense) => {
    if (expense.payer_id !== user_id) {
      const sharedAmount = expense.amount / groupMembers.length;
      totalOwed += sharedAmount;
      if (!amountsOwedPerUser[expense.payer_id]) {
        amountsOwedPerUser[expense.payer_id] = [];
      }
      amountsOwedPerUser[expense.payer_id].push({
        amount: sharedAmount.toFixed(2),
        expense_id: expense.expense_id,
        name: memberNames[expense.payer_id], // Include the payer's full name
      });
    }
  });

  let totalPaidBack = userPaybacks.data.reduce(
    (acc, payback) => acc + payback.amount,
    0,
  );
  const netOwed = Math.max(0, totalOwed - totalPaidBack);

  let totalOwedToUser = 0;
  expenses.data.forEach((expense) => {
    if (expense.payer_id === user_id) {
      const sharedAmount = expense.amount / groupMembers.length;
      totalOwedToUser += expense.amount - sharedAmount;
    }
  });

  let totalPaidToUser = paybacksToUser.data.reduce(
    (acc, payback) => acc + payback.amount,
    0,
  );
  const netOwedToUser = Math.max(0, totalOwedToUser - totalPaidToUser);

  return new Response(
    JSON.stringify({
      netOwed: netOwed.toFixed(2),
      netOwedToUser: netOwedToUser.toFixed(2),
      amountsOwedPerUser: amountsOwedPerUser,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
