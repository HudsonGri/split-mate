import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { NavBar } from "@/components/nav";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CreateGroup } from "@/components/create-group";

export default async function Create() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login?group=create");
    console.log("Show dialog");
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
