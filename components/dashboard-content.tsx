"use client";
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
import { Skeleton } from "@/components/ui/skeleton";

import { Overview } from "@/components/overview";
import { RecentRequests } from "@/components/recent-requests";
import { NavBar } from "@/components/nav";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

import { redirect } from "next/navigation";
import { GroupSelect } from "@/components/group-select";
import { DashboardCards } from "@/components/dashboard-cards";
import { useState, useEffect } from "react";
import { Icons } from "@/components/icons";

import { History } from "@/components/history/history";
import {PeopleTable} from "@/components/people-table";

export function DashboardContent({ user_details }) {
  const [currentGroup, setCurrentGroup] = useState("");
  const [hasGroups, setHasGroups] = useState(false);
  const [peopleData, setPeopleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupPeople, setGroupPeople] = useState([]);

  useEffect(() => {
    fetch("/api/listgroups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ list_all_members: true }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data && data.length > 0) {
          setHasGroups(true);
          data.sort((a, b) => b.userCount - a.userCount);
          setCurrentGroup(data[0].group_id);

          const groupData = data.find(
            (group) => group.group_id === data[0].group_id,
          );
          if (groupData) {
            // Set the people data for the current group
            setPeopleData(groupData.members);
          }
        } else {
          setHasGroups(false);
        }

      })
      .catch((error) => console.error("Failed to fetch groups", error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleGroupChange = (groupId) => {
    setCurrentGroup(groupId);
    console.log(groupId);
  };

  useEffect(() => {
    console.log("Refreshing Overview and Cards with group_id:", currentGroup);
  }, [currentGroup]);

  if (!user_details.user_metadata.first_name) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome to Split Mate!
          </h2>
          <p className="mb-6">
            Please update your profile to include your first and last name to
            start using Split Mate!
          </p>
          <Link
            href="/settings"
            className={buttonVariants({ variant: "default" })}
          >
            Update Profile
          </Link>
        </div>
      </div>
    );
  }
  if (!hasGroups && !isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No Groups Found</h2>
          <p className="mb-6">
            You are not part of any groups. Please join or create a new group.
          </p>
          <Link href="/" className={buttonVariants({ variant: "default" })}>
            Create/Join a Group
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 px-8 pb-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-2">
          <GroupSelect
            onGroupChange={handleGroupChange}
            defaultValue={currentGroup}
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
          {isLoading ? (
            <div className="flex justify-between w-full">
              <Skeleton className="h-[100px] w-[320px] rounded-lg" />
              <Skeleton className="h-[100px] w-[320px] rounded-lg" />
              <Skeleton className="h-[100px] w-[320px] rounded-lg" />
              <Skeleton className="h-[100px] w-[320px] rounded-lg" />
            </div>
          ) : (
            <DashboardCards group_id={currentGroup} />
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Paybacks</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Skeleton className="h-[300px] w-[500px] rounded-lg" />
                  </div>
                ) : (
                  <Overview group_id={currentGroup} />
                )}
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
                {isLoading ? (
                  <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <RecentRequests group_id={currentGroup} />
                )}
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
          <History groupId={currentGroup} />
        </TabsContent>
        <TabsContent value="people" className="space-y-4">
        <Table>
            <TableCaption>A list of people in this group.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {peopleData.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>
                    {person.first_name} {person.last_name}
                  </TableCell>
                  <TableCell>{person.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
