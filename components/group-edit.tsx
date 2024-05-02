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
} from "@/components/ui/dialog";
import { FiEdit2 } from "react-icons/fi";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GroupEdit({ group_details }: { group_details?: any }) {
  const [groupName, setGroupName] = useState(
    group_details.name,
  );

  const handleSaveChanges = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Call your API endpoint to update the user's name
    const response = await fetch("/api/group/updatename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupName, groupID: group_details.group_id }),
    });

    const data = await response.json();
        if (data.success) {
            // Handle success (e.g., show a success message)
            console.log("Name updated successfully");
            window.location.reload();
        } else {
            // Handle error
            console.error("Failed to update group name");
        }
    };
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-base">
                    <FiEdit2 />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Group Name</DialogTitle>
                    <DialogDescription>
                        Make changes to your group name
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveChanges}>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="first-name" className="col-span-1">
                                Group Name
                                </Label>
                                <Input
                                id="first-name"
                                defaultValue={group_details.name}
                                className="col-span-3"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                        <Button type="submit" onClick={handleSaveChanges}>
                            Save changes
                        </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
      </DialogContent>
    </Dialog>
  );
}
