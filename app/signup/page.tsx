import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthFormSignUp } from "@/components/user-auth-form-signup"
import { NavBar } from "@/components/nav"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default async function AuthenticationPage() {

  const supabase = createClient()


  const { data, error } = await supabase.auth.getUser()
  
  // If the user is logged in already, then redirect to dashboard
  if (data?.user && !error) {
    redirect('/dashboard')
  }

  return (
    <>
      <NavBar links={[]} />
      <div className="container relative h-[600px] pt-10 flex-col items-center justify-center md:pt-0 md:grid lg:max-w-none lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign Up
            </h1>
            <p className="text-sm text-muted-foreground">
              Please enter your information below to sign up.
            </p>
          </div>
          <UserAuthFormSignUp />
        </div>
      </div>
    </>
  )
}
