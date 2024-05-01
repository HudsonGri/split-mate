import { createClient } from "@/utils/supabase/server";
import { sendInvitationEmails } from "./email";

function generateGroupCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomChar = () => chars[Math.floor(Math.random() * chars.length)];
  return `${randomChar()}${randomChar()}${randomChar()}-${randomChar()}${randomChar()}${randomChar()}`;
}


export async function POST(req: Request, res: Response) {
  const { groupName, emails } = await req.json();

  // Create a Supabase client instance
  const supabase = createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();


  // Check if the user is authenticated
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "User not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let unique = false;
  let groupCode = "";
  let retries = 0;

  while (!unique && retries < 10) {
    groupCode = generateGroupCode();
    console.log("Checking group code uniqueness:", groupCode);
    const { data: existingGroups, error } = await supabase
      .from("groups")
      .select("group_code")
      .eq("group_code", groupCode);

    if (error) {
      console.error("Error checking group code uniqueness:", error);
      return new Response(
        JSON.stringify({ success: false, error: error }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    if (existingGroups.length === 0) {
      unique = true;
    } else {
      retries++;
    }
  }
  if (!unique) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to generate a unique group code" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Create a new row in the 'groups' table with the unique group_code
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({ name: groupName, admin: user.id, group_code: groupCode })
    .select();



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

    // Send invitation emails
    const emailSuccess = await sendInvitationEmails(emails, groupName, groupCode);
    if (!emailSuccess) {
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send invitation emails" }),
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
