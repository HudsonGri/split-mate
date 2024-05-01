"use client"
import React, { Suspense } from 'react';
import Image from "next/image";
import Link from "next/link";

import { UserAuthForm } from "@/components/user-auth-form";
import { NavBar } from "@/components/nav";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { ConitionalText } from '@/components/conditional-text';


export default function AuthenticationPage() {
  const supabase = createClient();


  // Async fetch operations need to be handled differently in Next.js
  // Consider using getServerSideProps or getStaticProps for initial data fetching
  // Here, we use useEffect to simulate fetching the user state
  React.useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      // If the user is logged in already, then redirect to dashboard
      if (data?.user && !error) {
        redirect("/dashboard");
      }
    }

    checkUser();
  }, [supabase]);

  return (
    <>
      <NavBar links={[]} currentPage='Login' />
      <div className="container relative h-[600px] pt-10 flex-col items-center justify-center md:pt-0 md:grid lg:max-w-none lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Suspense fallback={<div>Loading...</div>}>
              <ConitionalText />
            </Suspense>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to sign in to your account
            </p>
          </div>
          <UserAuthForm />
          <Link
            className="px-8 text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
            href="/signup"
          >
            Need an account? Sign up
          </Link>
        </div>
      </div>
    </>
  );
}
