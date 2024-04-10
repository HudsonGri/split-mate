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
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create a new group</CardTitle>
            <CardDescription>
              Groups are a great way to share with and learn from your friends.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input id="group-name" placeholder="The Great Group" />
            </div>
            <div className="space-y-2">
              <Label>Members</Label>
              <div>
                Start typing to add members to your group. You can add up to 100
                members.
              </div>
              <div className="mt-1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rules">Group Rules</Label>
              <Textarea
                className="min-h-[100px]"
                id="rules"
                placeholder="Enter the rules of the group"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg">Create Group</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
