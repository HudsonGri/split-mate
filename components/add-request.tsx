"use client";
import { Button } from "./ui/button";
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
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddRequest({
  user_details,
  group_id,
}: {
  user_details?: any;
  group_id: string;
}) {
  const [itemName, setItemName] = useState("");

  const handleAddItem = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    //console.log("GROUP ID (component): ", group_id);

    // Call your API endpoint to add request
    if (group_id != "") {
      const response = await fetch("/api/addrequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ group_id, itemName }),
      });

      const data = await response.json();

      if (data.success) {
        // Handle success (e.g., show a success message)
        console.log("Request added successfully");
        window.location.reload();
      } else {
        // Handle error
        console.error("Failed to add request");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="m-1" disabled={group_id == null}>
          Add Item
        </Button>
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
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleAddItem}
            disabled={group_id == null}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
