import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request, res: Response) {

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
        .from('group_membership')
        .select(`
            id:group_id,
            groups(name)
        `)
        .eq('user_id', user.id)
        .returns<any[]>(); // Hack to fix issue in supabase https://github.com/supabase/postgrest-js/issues/303

    if (error) {
        return new Response(JSON.stringify({ error: error }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const formattedData = data.map(item => {
        return {
            id: item.id,
            name: item.groups.name
        };
    });

    return new Response(JSON.stringify(formattedData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function PUT(req: Request, res: Response) {

    const { groupId } = await req.json();

    if (!groupId) {
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
        .from('group_membership')
        .select(`
            profiles(first_name, last_name),
            user_id
        `)
        .eq('group_id', groupId)
        .neq('user_id', user.id)
        .returns<any[]>(); // Hack to fix issue in supabase https://github.com/supabase/postgrest-js/issues/303;

    if (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const formattedData = data.map(item => {
        const name = `${item.profiles.first_name} ${item.profiles.last_name}`
        return {
            id: item.user_id,
            name: name
        };
    });

    return new Response(JSON.stringify(formattedData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
}

export async function POST(req: Request, res: Response) {

    const { group_id, itemName, expenseAmount }= await req.json();

    if (!group_id || !itemName || !expenseAmount) {
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
        .from('expenses')
        .insert({
            payer_id: user.id,
            group_id: group_id,
            amount: expenseAmount * 100,
            description: itemName,
            creation_date: new Date()
        });

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