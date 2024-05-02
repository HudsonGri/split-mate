import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request, res: Response) {
  const supabase = createClient();
  
  // Parse the request body to get the groupId
  const { groupId } = await req.json();
  
  if (!groupId) {
    return new Response(JSON.stringify({ error: "Group ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Retrieve the authenticated user
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

  // Delete the user's membership from the group
  const { error: deleteError } = await supabase
    .from("group_membership")
    .delete()
    .match({ group_id: groupId, user_id: user.id });

  if (deleteError) {
    return new Response(JSON.stringify({ error: "Failed to leave the group" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Respond with success
  return new Response(JSON.stringify({ success: true, message: "Successfully left the group" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}