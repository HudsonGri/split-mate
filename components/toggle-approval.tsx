"use client"
import * as React from "react"
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ApprovalToggle({ group_details }: { group_details?: any }) {
    const [approval, setApproval] = useState(
        group_details.require_approval
    );
    
    const handleSaveChanges = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Call your API endpoint to update the user's name
        const response = await fetch("/api/group/updateapproval", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ approval: approval, groupID: group_details.group_id }),
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
    <form onSubmit={handleSaveChanges}>
        <RadioGroup defaultValue={String(approval)}>
        <div className="flex items-center space-x-2">
            <RadioGroupItem onClick={() => setApproval(true)} value="true" id="r1" />
            <Label htmlFor="r1">Require approval for item requests</Label>
        </div>
        <div className="flex items-center space-x-2">
            <RadioGroupItem onClick={() => setApproval(false)} value="false" id="r2" />
            <Label htmlFor="r2">No approval needed for item requests</Label>
        </div>
        </RadioGroup>
        <br></br>
        <Button type="submit">
            Save changes
        </Button>
    </form>
    
  )
}