import { createClient } from '@/utils/supabase/server'; // Adjust the path as necessary

export async function POST(req: Request, res: Response) {
  const { firstName, lastName } = await req.json(); // Parse the request body

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

  // Prepare the user updates
  const updates = {
    id: user.id,
    data: {
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
    },
    updated_at: new Date(),
  };

  // Update the user in the 'users' table
  const { error: updateError } = await supabase.auth.updateUser(updates);


  // Check if there was an error during the update
  if (updateError) {
    console.error('Error updating user:', updateError);
    console.log(updateError);
    return new Response(JSON.stringify({ success: false, error: updateError.message }), {
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