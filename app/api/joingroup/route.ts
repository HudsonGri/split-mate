import { createClient } from "@/utils/supabase/server"; // Adjust the path as necessary

export async function POST(req: Request, res: Response) {
  const supabase = createClient();
  console.log(req.body)
  const { groupCode } = await req.json(); // Get the group_code from the request body

const group_code = groupCode;

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

  console.log(group_code)
  // Find the group by group_code
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .eq("group_code", group_code)
    .single(); // Ensures only one record is returned

  if (groupError || !group) {
    console.log(groupError)
    console.log(group)
    return new Response(JSON.stringify({ error: "Group not found or multiple groups found with the same code" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check if the user is already a member of the group
  const { data: existingMembership, error: membershipCheckError } = await supabase
    .from("group_membership")
    .select("*")
    .eq("group_id", group.group_id)
    .eq("user_id", user.id);

  if (membershipCheckError) {
    return new Response(JSON.stringify({ error: "Failed to verify group membership" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (existingMembership.length > 0) {
    return new Response(JSON.stringify({ error: "User already a member of this group" }), {
      status: 409, // Conflict status code
      headers: { "Content-Type": "application/json" },
    });
  }

  // Add the user to the group_membership table
  const { error: membershipError } = await supabase
    .from("group_membership")
    .insert([{ group_id: group.group_id, user_id: user.id }]);

  if (membershipError) {
    console.log(membershipError)
    return new Response(JSON.stringify({ error: "Failed to add user to group" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true, message: "User added to group successfully" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
