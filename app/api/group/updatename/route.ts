import { createClient } from '@/utils/supabase/server'; // Adjust the path as necessary

export async function POST(req: Request, res: Response) {
  const { groupName, groupID } = await req.json(); // Parse the request body

  // Create a Supabase client instance
  const supabase = createClient();

  // Get the authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Check if the user is authenticated
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabase
  .from('groups')
  .update({ name: groupName })
  .eq('group_id', groupID)
  .select();
  
  // Check if there was an error during the update
  if (error) {
    console.error('Error updating user:', error);
    console.log(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Return a success response
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}