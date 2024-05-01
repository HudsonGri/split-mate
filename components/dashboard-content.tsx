"use client";
//import { History } from "../app/dashboard/history/history";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

import { Overview } from "@/components/overview";
import { RecentRequests } from "@/components/recent-requests";
import { NavBar } from "@/components/nav";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

import { redirect } from "next/navigation";
import { GroupSelect } from "@/components/group-select";
import { DashboardCards } from "@/components/dashboard-cards";
import { useState, useEffect } from "react";

export function DashboardContent() {
  const [defaultValue, setDefaultValue] = useState(
    "7146eef7-5f38-4113-a212-80ee31b63b8a",
  );

  const [currentGroup, setCurrentGroup] = useState(defaultValue);

  const handleGroupChange = (groupId) => {
    setCurrentGroup(groupId);
    console.log(groupId);
  };

  useEffect(() => {
    console.log("Refreshing Overview and Cards with group_id:", currentGroup);
  }, [currentGroup]);
  return (
    <div className="flex-1 space-y-4 px-8 pb-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-2">
          <GroupSelect
            onGroupChange={handleGroupChange}
            defaultValue={defaultValue}
          />
          <Link href="/" className={buttonVariants({ variant: "default" })}>
            Join/Create Group
          </Link>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DashboardCards group_id={currentGroup} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Paybacks</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview group_id={currentGroup} />
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
                <RecentRequests group_id={currentGroup} />
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
        <TabsContent value="history" className="space-y-4"></TabsContent>
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
  );
}

export default DashboardContent;
