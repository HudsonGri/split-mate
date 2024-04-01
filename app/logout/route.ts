
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET() {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut()
    console.log(error)

    // URL to redirect to after sign up process completes
    return redirect("/");
}