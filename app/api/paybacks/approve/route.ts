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
        .from('paybacks')
        .select(`
            id:payback_id,
            amount,
            payer:profiles!paybacks_payer_id_fkey(first_name, last_name),
            group:groups!paybacks_group_id_fkey(name),
            description
        `)
        .eq('recipient_id', user.id)
        .eq('approved', false)
        .returns<any[]>(); // Hack to fix issue in supabase https://github.com/supabase/postgrest-js/issues/303


    if (error) {
        return new Response(JSON.stringify({ error: error }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const formattedData = data.map(item => {
        const payerName = `${item.payer.first_name} ${item.payer.last_name}`;
        const groupName = item.group.name;
        return {
            ...item,
            payer: payerName,
            group: groupName
        };
    });

    return new Response(JSON.stringify(formattedData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function PUT(req: Request, res: Response) {

    const { approvedPaybacks } = await req.json();

    if (!approvedPaybacks) {
        return new Response(JSON.stringify({ error: 'Missing list of approvedPaybacks' }), {
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
        .from('paybacks')
        .update({ approved: true })
        .in('payback_id', approvedPaybacks);


    if (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
}