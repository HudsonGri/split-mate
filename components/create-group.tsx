"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreateGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CreateGroup({ className, ...props }: CreateGroupProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [emails, setEmails] = React.useState<string[]>([]);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [groupNameError, setGroupNameError] = React.useState<string | null>(
    null,
  );

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const groupName = formData.get("groupName")?.toString() || "";

    if (!groupName) {
      setGroupNameError("Group name is required.");
      setIsLoading(false);
      return;
    }

    const response = await fetch("/api/creategroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupName, emails }),
    });

    const data = await response.json();

    setIsLoading(false);

    if (response.ok) {
      window.location.href = "/dashboard";
    } else {
      console.error(data.message);
    }
  }

  function validateEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function handleAddEmail() {
    const emailInput = document.getElementById("email") as HTMLInputElement;
    if (emailInput.value && validateEmail(emailInput.value)) {
      setEmails([...emails, emailInput.value]);
      emailInput.value = ""; // Clear the input after adding
      setEmailError(null);
    } else {
      setEmailError("Please enter a valid email address.");
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              name="groupName"
              placeholder="Enter group name"
              type="text"
              autoComplete="off"
              disabled={isLoading}
            />
            {groupNameError && <p className="text-red-500 text-sm">{groupNameError}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Invite Members (Email)</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoComplete="off"
              disabled={isLoading}
            />
            <Button
              className="mt-2"
              variant="secondary"
              type="button" // Prevent form submission on click
              onClick={handleAddEmail}
              disabled={isLoading}
            >
              + Add email
            </Button>
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            <div>
              {emails.length > 0 && (
                <p className="font-medium text-primary">Added Emails:</p>
              )}
              <div className="flex flex-col gap-2 mt-2">
                {emails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Avatar className="w-6 h-6 border">
                      <AvatarImage
                        alt={email}
                        src="/placeholder-user-inv.png"
                      />
                      <AvatarFallback>{email[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium text-muted-foreground">
                      {email}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create Group"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
