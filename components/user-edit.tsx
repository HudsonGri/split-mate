"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { FiEdit2 } from "react-icons/fi";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UserEdit({ user_details }: { user_details?: any }) {
  const [firstName, setFirstName] = useState(
    user_details.user_metadata.first_name || "First Name",
  );
  const [lastName, setLastName] = useState(
    user_details.user_metadata.last_name || "Last Name",
  );

  const handleSaveChanges = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Call your API endpoint to update the user's name
    const response = await fetch("/api/updatename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName }),
    });

    const data = await response.json();

    if (data.success) {
      // Handle success (e.g., show a success message)
      console.log("Name updated successfully");
      window.location.reload();
    } else {
      // Handle error
      console.error("Failed to update name");
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
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSaveChanges}>
          <div className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-1">
                <Label htmlFor="file" className="font-medium cursor-pointer">
                  Profile Picture
                </Label>
              </div>
              <div className="col-span-3 flex items-center gap-4">
                <Avatar className="w-32 h-32 ml-4">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <AvatarFallback>
                    {firstName.slice(0, 1).toUpperCase()}
                    {lastName.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Input
                  accept="image/*"
                  className="sr-only"
                  id="file"
                  type="file"
                />
                <Label htmlFor="file" className="cursor-pointer underline">
                  Change
                </Label>
              </div>
            </div>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first-name" className="col-span-1">
                  First Name
                </Label>
                <Input
                  id="first-name"
                  defaultValue={
                    user_details.user_metadata.first_name || "First Name"
                  }
                  className="col-span-3"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="last-name" className="col-span-1">
                  Last Name
                </Label>
                <Input
                  id="last-name"
                  defaultValue={
                    user_details.user_metadata.last_name || "Last Name"
                  }
                  className="col-span-3"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="col-span-1">
                  Email
                </Label>
                <Input
                  id="username"
                  placeholder={user_details.email}
                  className="col-span-3"
                  disabled
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
