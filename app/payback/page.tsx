import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaybackTable } from "@/components/payback-table";
import { PaybackForm } from "@/components/payback-form";
import { NavBar } from "@/components/nav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PaybackOwed } from "@/components/payback-owed";

export const metadata: Metadata = {
  title: "Paybacks",
};

export default async function PaybackPage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.log("redirect to main");
    redirect("/");
  }
  const user = data.user;

  return (
    <>
      <div className="flex flex-col">
        <NavBar
          links={[
            "Dashboard",
            "Request List",
            "Paybacks",
            "Expenses",
            "Profile",
          ]}
          user_details={user}
          currentPage="Paybacks"
        />
        <div className="flex-1 space-y-4 px-8 pb-8">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Paybacks</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Log Payback</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <PaybackForm />
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>
                  Approve that a payback has been made.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaybackTable />
                <CardTitle>Amounts Owed</CardTitle>
                <CardDescription className="mt-2">
                  View the amount you owe to others.
                </CardDescription>
                <div className="mt-6">
                  <PaybackOwed />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
