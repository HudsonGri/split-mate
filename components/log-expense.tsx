"use client"
import { Button } from "./ui/button"
import { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LogExpense({ user_details, group_id, requestdata }: {user_details?: any, group_id: string, requestdata: any[] }) {
    const [itemName, setItemName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');

    const handleAddExpense = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        //console.log("GROUP ID (component): ", group_id);

        // Call your API endpoint to log expense
        if (group_id != '') {
            const response = await fetch('/api/expenses/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ group_id, itemName, expenseAmount }),
            });

            const data = await response.json();

            if (data.success) {
                // Handle success (e.g., show a success message)
                console.log("Expense logged successfully");
                //window.location.reload();
            } else {
                // Handle error
                console.error("Failed to log expense");
            }

            const response2 = await fetch('/api/purchaserequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ group_id, itemName }),
            });

            const data2 = await response2.json();

            if (data2.success) {
                // Handle success (e.g., show a success message)
                console.log("Expense logged successfully");
                window.location.reload();
            } else {
                // Handle error
                console.error("Failed to log expense");
            }
            window.location.reload();
        }
    };

    return (
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
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
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
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" onClick={handleAddExpense}>Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    )
}