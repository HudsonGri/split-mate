import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Expense, admincolumns } from "../../components/expenses/admin-columns";
import { AdminDataTable } from "../../components/expenses/admin-table-expenses";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { createClient } from "@/utils/supabase/server";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiEdit2, FiPlus } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Metadata } from "next";
import { ModeToggle } from "@/components/toggle-mode";
import { NavBar } from "@/components/nav";
import React, { useState } from "react";
import { redirect } from "next/navigation";
import { SelectGroups } from "../../components/ui/select-groups";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { GroupEdit } from "@/components/group-edit";
import { ApprovalToggle } from "@/components/toggle-approval";
import PeopleTable from "@/components/people-table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "Admin settings page.",
};

type GroupData = {
  group_id: string
  name: string
  admin: string
  group_code: string
  require_approval: boolean
}

async function getData(selectedGroup: string): Promise<GroupData> {
  if (selectedGroup != "") {
    // Fetch data from your API here.
    const supabase = createClient();

    let { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("group_id", selectedGroup);

    if (error) {
      console.log(error);
      redirect("/error");
    }
    if (data) {
      var groupData: GroupData = {
        group_id: data[0].group_id,
        name: data[0].name,
        admin: data[0].admin,
        group_code: data[0].group_code,
        require_approval: data[0].require_approval,
      }
      return groupData;
    }
  }
  else {
    var groupData: GroupData = {
      group_id: "",
      name: "",
      admin: "",
      group_code: "",
      require_approval: false,
    }
    return groupData;
  }
}

async function getExpenseData(selectedGroup: string): Promise<Expense[]> {
  if (selectedGroup != "") {
      // Fetch data from your API here.
      const supabase = createClient();

      let { data, error } = await supabase
          .from("expenses")
          .select("*, profiles!expenses_payer_id_fkey(id, first_name, last_name)")
          .eq("group_id", selectedGroup);

      if (error) {
          console.log(error);
          redirect("/error");
      }
      if (data) {
          const items: Expense[] = data?.map(setItems);

          //console.log(items)
          return items;
      }
  }
  else {
      const items: Expense[] = [];
      return items;
  }
}

function setItems(value) {
var item: Expense = {
  id: value.expense_id,
  group: value.group_id,
  payer: value.profiles.first_name + ' ' + value.profiles.last_name,
  amount: '$' + (value.amount/100).toFixed(2),
  date: value.creation_date,
  description: value.description,
};
return item;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const selectedSearch = searchParams?.selected ?? "";
  const selected = Array.isArray(selectedSearch)
    ? selectedSearch[0]
    : selectedSearch;

  const selectedGroup = await selected;
  //////////////////////////////////////////////
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  console.log(error);
  if (error || !data?.user) {
    console.log("redirect to main");
    redirect("/");
  }

  const user = data.user;

  const groupdata = await getData(selectedGroup);
  const expensedata = await getExpenseData(selectedGroup)

  return (
    <>
      <div className="flex flex-col">
        <NavBar
          links={["Dashboard", "Request List", "Paybacks", "Profile"]}
          user_details={user}
          currentPage="Admin"
        />
        <div className="flex-1 px-8 pb-8">
          <h2 className="text-3xl font-bold tracking-tight">Group Admin Settings</h2>
          <div className="flex justify-end items-center space-x-2">
              <SelectGroups selected={selected || ""} />
              {/* {selectedGroup ? (
                <section>
                  {selectedGroup}
                </section>
              ) : (
                <p>Select a group</p>
              )} */}
          </div>
          <br></br>
          <div className="flex flex-row">
            {/* nav menu */}
            <div
              className="w-1/4 sticky top-[80px] space-y-4 mr-8 z-10"
              style={{ height: "fit-content" }}
            >
              <nav className="divide-y divide-gray-200 dark:divide-gray-700">
                <a
                  className="flex items-center rounded-md font-medium px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition-colors"
                  href="#group-name"
                >
                  Edit Group Name
                </a>
                <a
                  className="flex items-center rounded-md font-medium px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition-colors"
                  href="#approval"
                >
                  Approval
                </a>
                <a
                  className="flex items-center rounded-md font-medium px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition-colors"
                  href="#edit-expenses"
                >
                  Edit Expenses
                </a>
                <a
                  className="flex items-center rounded-md font-medium px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition-colors"
                  href="#edit-group"
                >
                  Edit Group
                </a>
              </nav>
            </div>

            <div className="w-3/4 space-y-4">
              <div id="group-name">
                <Card>
                  <CardHeader className="flex justify-between">
                    <div className="flex">
                      <span className="mr-2">Edit Group Name</span>
                      <GroupEdit group_details={groupdata} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label>Group Name</Label>
                      <div className="text-gray-600 dark:text-gray-400">
                        {groupdata.name}
                      </div>
                    </div>
                    <br></br>
                    <div className="space-y-2">
                      <Label>Group Code</Label>
                      <div className="text-gray-600 dark:text-gray-400">
                        {groupdata.group_code}
                      </div>
                    </div>
                    <br></br>

                  </CardContent>
                </Card>
              </div>

              <div id="approval">
                <Card>
                  <CardHeader>Approval</CardHeader>
                  <CardContent>
                  <div className="space-y-2">
                      <div className="pl-2">
                      {selectedGroup ? (
                            <ApprovalToggle group_details={groupdata} />
                        ) : (
                          <p>Select a group</p>
                        )}
                        
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div id="edit-expenses">
                <Card>
                  <CardHeader>Edit Expenses</CardHeader>
                  <CardContent>
                    <AdminDataTable columns={admincolumns} data={expensedata} />
                  </CardContent>
                  <CardFooter className="justify-center">
                  </CardFooter>
                </Card>
              </div>

              <div id="edit-group">
                <Card>
                  <CardHeader>Edit Group</CardHeader>
                  <CardContent>
                    <PeopleTable groupId={selectedGroup} />
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
