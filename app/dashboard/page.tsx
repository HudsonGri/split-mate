import { Metadata } from "next";
import { History } from "../../components/history/history";
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
import { DashboardContent } from "@/components/dashboard-content";

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

  async function getAdminData(): Promise<boolean> {
    // Fetch data from your API here.
    const userID = user.id;

    let { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('admin', userID);

    if (error) {
      console.log(error);
      redirect("/error");
    }

    if (data) {
        // Handle success (e.g., show a success message)
        console.log("Data fetched successfully");
        if (data.length > 0) {
          return true;
        }
        else {
          return false;
        }
        //window.location.reload();
    } else {
        // Handle error
        console.error("Failed to fetch admin data");
        return false;
    }
  }

  const isAdmin: boolean = await getAdminData();
  console.log("ADMIN: ", isAdmin);
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
          currentPage="Dashboard"
          isAdmin={isAdmin}
        />
        <DashboardContent user_details={user} />
      </div>
    </>
  );
}
