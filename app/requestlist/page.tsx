import { Request, columns } from "./columns"
import { Button } from "../../components/ui/button"
import { DataTable } from "../../components/ui/data-table"
import { NavBar } from "@/components/nav"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { json } from "stream/consumers"

async function getData(): Promise<Request[]> {
  // Fetch data from your API here.
  
  const supabase = createClient()

  let { data, error } = await supabase
  .from('item_list')
  .select("*")
  .eq('purchased', false);

  if (error) {
    console.log("redirect to main")
    redirect('/')
  }
  if (data) {


  const items: Request[] = data?.map(setItems);

  console.log(items)
  return items
    // {
    //   id: "1",
    //   date: new Date().toDateString(),
    //   name: "Paper Towels",
    //   user_submitted: "John B.",
    //   status: "Pending approval",
    // },
    // ...

}

}
function setItems(value) {
  var item: Request = {
    id: value.item_id,
    date: value.creation_date,
    name: value.name,
    user_submitted: value.creator,
    status: "Unclaimed",
  }
  if (value.approved == false) {
    item.status = "Pending approval"
  }
  else if (value.claimer == null) {
    item.status = "Claimed"
  }
  return item
}

export default async function RequestListPage() {
  //

  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  console.log(error)
  if (error || !data?.user) {
    console.log("redirect to main")
    redirect('/')
  }
  const user = data.user
  const requestdata = await getData()

  return (
    <>
      <div className="flex flex-col">
        <NavBar links={["Profile"]} user_details={user}/>
        <div className="flex-1 space-y-4 px-8 pb-8">
          <div className="flex items-center justify-center space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Request List</h2>
            </div>
          </div>
        </div>
      </div>
      
        <div className="container mx-auto py-10">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="m-1">Add Item</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Item</DialogTitle>
                  <DialogDescription>
                    Add an item to the request list here. Click submit when finished.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
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
                        <option value="Paper Towels"/>
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
  )
}
