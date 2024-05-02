'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)


  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData): Promise<boolean>  {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      emailRedirectTo: 'http://localhost:3000/login',
      data: {
        first_name: formData.get('first-name') as string,
        last_name: formData.get('last-name') as string,
        full_name: formData.get('first-name') as string + " " +  formData.get('last-name') as string,
      }
    }
  }


  const { error } = await supabase.auth.signUp(data)
  console.log(error)

  if (error) {
    redirect('/error')
    return false; // Signup failed
  } else {
    return true; // Signup successful
  }
}

export async function signInWithGithub() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'https://www.split-mate.com/auth/callback'
    }
  })
  if (error == null) {
    redirect(data.url)
  }

  console.log(error)
  console.log(data)
}