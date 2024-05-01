import { Metadata } from "next";
import { History } from "./history/history";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../../components/ui/table";

import { Overview } from "../../components/overview";
import { RecentRequests } from "../../components/recent-requests";
import { NavBar } from "@/components/nav";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { GroupSelect } from "@/components/group-select";
import { DashboardCards } from "@/components/dashboard-cards";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  console.log(error);
  if (error || !data?.user) {
    console.log("redirect to main");
    redirect("/");
  }
  const user = data.user;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      // Optionally, redirect user after logout
      window.location.href = "/login"; // Adjust the path to your login page as necessary
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <NavBar
          links={["Dashboard", "Request List", "Paybacks", "Profile"]}
          user_details={user}
          currentPage="Dashboard"
        />
        <div className="flex-1 space-y-4 px-8 pb-8">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-2">
              <GroupSelect />
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <DashboardCards />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Paybacks</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Request List</CardTitle>
                    <CardDescription>
                      Recent requests within your current group.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentRequests />
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Link
                      className={buttonVariants({ variant: "outline" })}
                      href="/requestlist"
                    >
                      View All Requests
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="history" className="space-y-4">
              <History></History>
            </TabsContent>
            <TabsContent value="people" className="space-y-4">
              <Table>
                <TableCaption>A list of people in this group.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Phone Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Albert Gator</TableCell>
                    <TableCell>algator@ufl.edu</TableCell>
                    <TableCell className="text-right">123-456-7890</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Alberta Gator</TableCell>
                    <TableCell>alberta.gator@ufl.edu</TableCell>
                    <TableCell className="text-right">111-444-7777</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
