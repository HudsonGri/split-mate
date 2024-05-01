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

  const { group_id } = await req.json();

  if (!group_id) {
    return new Response(JSON.stringify({ error: "Group ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: items, error: itemsError } = await supabase
    .from("item_list")
    .select("*, creator:creator (first_name, last_name, email )")
    .eq("group_id", group_id);

  if (itemsError || !items) {
    console.log(itemsError);
    return new Response(JSON.stringify({ error: "Failed to get items" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(items), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
