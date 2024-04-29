import { createClient } from "@/utils/supabase/server"; // Adjust the path as necessary

export async function POST(req: Request, res: Response) {
  const { groupName } = await req.json(); 

  // Create a Supabase client instance
  const supabase = createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log(user);

  // Check if the user is authenticated
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "User not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create a new row in the 'groups' table
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({ name: groupName, admin: user.id })
    .select();

  console.log(groupError);
  console.log(group);

  // Check if there was an error creating the group
  if (groupError) {
    console.error("Error creating group:", groupError);
    return new Response(
      JSON.stringify({ success: false, error: groupError.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Add a row to the 'group_membership' table
  const { error: membershipError } = await supabase
    .from("group_membership")
    .insert([{ group_id: group[0].group_id, user_id: user.id }]);

  // Check if there was an error adding the user to the group
  if (membershipError) {
    console.error("Error adding user to group:", membershipError);
    return new Response(
      JSON.stringify({ success: false, error: membershipError.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Return a success response
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
