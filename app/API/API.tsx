import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!)

export default async function API() {
const { data, error } = await supabase.auth.getUser()
console.log(error)
if (error || !data?.user) {
  console.log("redirect to main")
  redirect('/')
}

const user = data.user;
}