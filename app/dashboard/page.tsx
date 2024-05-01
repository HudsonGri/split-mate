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

  return (
    <>
      <div className="flex flex-col">
        <NavBar
          links={["Dashboard", "Request List", "Paybacks", "Profile", "Expenses"]}
          user_details={user}
          currentPage="Dashboard"
        />
        <DashboardContent />
      </div>
    </>
  );
}
