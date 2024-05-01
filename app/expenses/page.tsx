import { Expense, columns } from "./columns";
import { Button } from "../../components/ui/button";
import { DataTable } from "./data-table-expense";
import { NavBar } from "@/components/nav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddRequest } from "@/components/add-request";
import { SelectGroups } from "../../components/ui/select-groups";
import { LogExpense } from "@/components/log-expense";

export const dynamic = "force-dynamic";

async function getData(selectedGroup: string): Promise<Expense[]> {
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

export default async function RequestListPage({
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
  //console.log(user);
  const expensedata = await getData(selectedGroup)

  return (
    <>
      <div className="flex flex-col">
        <NavBar
          links={["Dashboard", "Request List", "Paybacks", "Profile", "Expenses"]}
          user_details={user}
          currentPage="Expenses"
        />
        <div className="flex-1 space-y-4 px-8 pb-8">
          <div className="flex items-center justify-center space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Expenses
              </h2>
            </div>
          </div>
        </div>
      </div>
      
        <div className="container mx-auto py-10">
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
            <DataTable columns={columns} data={expensedata} />
        </div>
    </>
  );
}
