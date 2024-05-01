import { Request, columns } from "./columns";
import { Button } from "../../components/ui/button";
import { DataTable } from "../../components/ui/data-table";
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

export const dynamic = "force-dynamic";

async function getData(): Promise<Request[]> {
  // Fetch data from your API here.
  const supabase = createClient();

  let { data, error } = await supabase
    .from("item_list")
    .select("item_id, creation_date, name, creator, approved, claimer, profiles!item_list_creator_fkey(id, first_name, last_name)")
    .eq("purchased", false);

  if (error) {
    console.log(error);
    redirect("/error");
  }
  if (data) {
    const items: Request[] = data?.map(setItems);

    //console.log(items)
    return items;
  }
}

function setItems(value) {
  var item: Request = {
    id: value.item_id,
    date: value.creation_date,
    name: value.name,
    user_submitted: value.profiles.first_name + ' ' + value.profiles.last_name,
    status: "Unclaimed",
  };
  if (value.approved == false) {
    item.status = "Pending approval";
  } else if (value.claimer == null) {
    item.status = "Claimed";
  }
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
  const requestdata = await getData()

  return (
    <>
      <div className="flex flex-col">
        <NavBar
          links={["Dashboard", "Request List", "Paybacks", "Profile"]}
          user_details={user}
          currentPage="Request List"
        />
        <div className="flex-1 space-y-4 px-8 pb-8">
          <div className="flex items-center justify-center space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Request List
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
            <AddRequest user_details={user} group_id={selectedGroup}/>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="m-1">Log Expense</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Log Expense</DialogTitle>
                  <DialogDescription>
                    Select item purchased and log total amount of the expense to split with group. Click submit when finished.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="list" className="text-right">
                      Items
                    </Label>
                    <Input
                      list="items"
                      id="list"
                      className="col-span-3"
                    />
                      <datalist id="items">
                        {requestdata.map((item) => (
                          <option key={item.id} value={item.name} />
                        ))}
                      </datalist>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      type="number"
                      min={0.00}
                      placeholder="0.00"
                      pattern="^[0-9]{1,}\.[0-9]{2}$"
                      id="amount"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <DataTable columns={columns} data={requestdata} />
        </div>
    </>
  );
}
