import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/user-auth-form"
import { NavBar } from "@/components/nav"
import { signInWithGithub } from "./actions"
import { login } from "./actions"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {

  return (
    <>
      <NavBar links={[]} />
      <div className="container relative h-[600px] pt-10 flex-col items-center justify-center md:pt-0 md:grid lg:max-w-none lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to sign in to your account
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">
          Need an account? Sign up
          </p>
        </div>
      </div>
    </>
  )
}
