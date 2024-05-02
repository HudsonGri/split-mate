import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request, res: Response) {
  const supabase = createClient();
  const { list_all_members } = await req.json();

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

  const groupsWithDetails = await Promise.all(
    groups.map(async (group) => {
      const { data: members, error: membersError } = await supabase
        .from("group_membership")
        .select("user_id")
        .eq("group_id", group.group_id);

      if (membersError) {
        console.log(membersError);
        return { ...group, userCount: 0 }; // Fallback in case of an error
      }

      // Fetch detailed member profiles if requested
      let memberDetails = [];
      if (list_all_members === true) {
        const memberIds = members.map((m) => m.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, email")
          .in("id", memberIds);

        if (profilesError) {
          console.log(profilesError);
          return { ...group, members: [] };
        }
        memberDetails = profiles;
      }

      return { ...group, userCount: members.length, members: memberDetails };
    }),
  );

  return new Response(JSON.stringify(groupsWithDetails), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
