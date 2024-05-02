import { NavBar } from "@/components/nav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CreateGroup } from "@/components/create-group";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create a Group',
}


export default async function Create() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login?group=create");
  }

  const user = data.user;

  return (
    <>
      <div className="flex flex-col">
        <NavBar links={["Dashboard", "Create a Group"]} />
        <div className="container relative h-[600px] pt-10 flex-col items-center justify-center md:pt-0 md:grid lg:max-w-none lg:px-0">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create a new group
              </h1>
              <p className="text-sm text-muted-foreground">
                Groups can be for any purpose from roomates to a local
                organization.
              </p>
            </div>
            <CreateGroup />
          </div>
        </div>
      </div>
    </>
  );
}
