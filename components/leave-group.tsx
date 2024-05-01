"use client";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LeaveGroup({ groupId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLeaveGroup = async () => {
    setIsLoading(true);
    setError("");

    
    const response = await fetch("/api/leavegroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupId }),
    });

    const data = await response.json();
    setIsLoading(false);

    if (response.ok) {
      
      window.location.reload();
    } else {
      
      if (data.error === "User not authenticated") {
        window.location.href = "/login?group=leave"; // Redirect to login
      } else {
        setError(data.message || "Failed to leave the group.");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-base bg-red-500">
          Leave
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Leave group</DialogTitle>
        Are you sure you want to leave this group?
        <div className="mt-4 flex justify-end space-x-4">
          <DialogClose asChild>
            <Button className="text-black bg-transparent hover:bg-gray-100">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleLeaveGroup} className="text-base bg-red-500 hover:bg-red-600" disabled={isLoading}>
              Confirm
            </Button>
          </DialogClose>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}

export default LeaveGroup;
