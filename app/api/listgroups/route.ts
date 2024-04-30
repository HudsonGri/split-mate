import { createClient } from "@/utils/supabase/server"; // Adjust the path as necessary

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

  const { data: memberships, error: membershipError } = await supabase
    .from("group_membership")
    .select("group_id")
    .eq("user_id", user.id);

  if (membershipError || !memberships) {

    return new Response(
      JSON.stringify({ error: "Failed to get group memberships" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (memberships.length === 0) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const groupIds = memberships.map((m) => m.group_id);
  const { data: groups, error: groupsError } = await supabase
    .from("groups")
    .select("group_id, name, admin")
    .in("group_id", groupIds);

  if (groupsError || !groups) {
    console.log(groupsError);
    return new Response(JSON.stringify({ error: "Failed to get groups" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(groups), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
