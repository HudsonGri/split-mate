import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request, res: Response) {
  const supabase = createClient();

  const { group_id } = await req.json();

  if (!group_id) {
    return new Response(JSON.stringify({ error: "Group ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: paybacks, error: paybacksError } = await supabase
    .from("paybacks")
    .select("*")
    .eq("group_id", group_id);

  if (paybacksError || !paybacks) {
    return new Response(JSON.stringify({ error: "Failed to get paybacks" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(paybacks), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
