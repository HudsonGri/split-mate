import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request, res: Response) {
  const { group_id } = await req.json();

  // Create a Supabase client instance
  const supabase = createClient();

  // Define the start and end of the current month
  // NOT WORKING SO IM IGNORING THIS
  const startDate = new Date();
  startDate.setDate(1);
  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    0,
  );
  console.log("Start Date:", startDate.toISOString());
  console.log("End Date:", endDate.toISOString());

  // Query for paybacks approved
  const { data: paybacksApproved, error: paybacksApprovedError } =
    await supabase
      .from("paybacks")
      .select("amount")
      .eq("group_id", group_id)
      .eq("approved", true);
  //.gte("creation_date", startDate.toISOString())
  //.lte("creation_date", endDate.toISOString());

  // Query for paybacks pending
  const { data: paybacksPending, error: paybacksPendingError } = await supabase
    .from("paybacks")
    .select("amount")
    .eq("group_id", group_id)
    .eq("approved", false);
  //.gte("creation_date", startDate.toISOString())
  //.lte("creation_date", endDate.toISOString());

  // Query for items requested
  const { data: itemsRequested, error: itemsRequestedError } = await supabase
    .from("item_list")
    .select("item_id")
    .eq("group_id", group_id);
  //.gte("creation_date", startDate.toISOString())
  //.lte("creation_date", endDate.toISOString());

  // Query for items unapproved
  const { data: itemsUnapproved, error: itemsUnapprovedError } = await supabase
    .from("item_list")
    .select("item_id")
    .eq("group_id", group_id)
    .eq("approved", false);
  //.gte("creation_date", startDate.toISOString())
  //.lte("creation_date", endDate.toISOString());

  if (
    paybacksApprovedError ||
    paybacksPendingError ||
    itemsRequestedError ||
    itemsUnapprovedError
  ) {
    console.log(
      paybacksApprovedError ||
        paybacksPendingError ||
        itemsRequestedError ||
        itemsUnapprovedError,
    );
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

  // Sum up the amounts for paybacks approved
  const totalPaybacksApproved = paybacksApproved.reduce(
    (acc, { amount }) => acc + amount,
    0,
  );

  // Count the entries for each category
  const paybacksPendingCount = paybacksPending.length;
  const itemsRequestedCount = itemsRequested.length;
  const itemsUnapprovedCount = itemsUnapproved.length;

  // Return the results
  return new Response(
    JSON.stringify({
      paybacksApproved: totalPaybacksApproved,
      paybacksPending: paybacksPendingCount,
      itemsRequested: itemsRequestedCount,
      itemsUnapproved: itemsUnapprovedCount,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
