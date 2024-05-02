import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request, res: Response) {

    const { group_id, itemName }= await req.json();

    if (!group_id || !itemName ) {
        return new Response(JSON.stringify({ error: 'Missing groupId' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Check if the user is authenticated
    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'User not authenticated' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { data, error } = await supabase
        .from('item_list')
        .update({
            claimer: user.id,
            purchased: true
        })
        .eq('name', itemName)
        .eq('purchased', false)
        .eq('group_id', group_id)
        .select();

    if (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ message: 'success' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
}