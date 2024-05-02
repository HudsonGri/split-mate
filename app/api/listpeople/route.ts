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

    const { data: people, error: error3 } = await supabase
    .from("group_membership")
    .select("profiles!group_membership_user_id_fkey(id, first_name, last_name, email)")
    .eq("group_id", groupId);

  if (error3 || !people) {
    return new Response(
      JSON.stringify({ success: false, error: "People not found" }),
      {
        status: 302,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
   if (people) {
    return new Response(JSON.stringify(people), {
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
