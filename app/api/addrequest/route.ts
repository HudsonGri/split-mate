import { createClient } from '@/utils/supabase/server'; // Adjust the path as necessary

export async function POST(req: Request, res: Response) {
  const { group_id, itemName } = await req.json(); // Parse the request body
  //console.log("REQUEST: ", req);
  console.log("GROUP ID (route): ", group_id);
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

  const creator_id = user.id
  const creationDate = new Date()
  const approved = false;
  const purchased = false;


  const { error } = await supabase
  .from('item_list')
  .insert({ group_id: group_id, name: itemName, creator: creator_id, creation_date: creationDate, approved: false, purchased: false })

  // Check if there was an error during the update
  if (error) {
    console.error('Error adding request:', error);
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