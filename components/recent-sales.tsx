"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function RecentSales() {
  const [requests, setRequests] = useState([]);
  const groupId = "7146eef7-5f38-4113-a212-80ee31b63b8a"; // Hardcoded group_id for testing

  useEffect(() => {
    fetch(`/api/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ group_id: groupId }),
    })
      .then((response) => response.json())
      .then((data) => setRequests(data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, [groupId]);

  return (
    <div className="space-y-8">
      {requests.map((item, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {item.creator.first_name.slice(0, 1).toUpperCase()}
              {item.creator.last_name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {item.name} <Badge variant="outline">Badge</Badge>
            </p>
            <p className="text-sm text-muted-foreground">
              - {item.creator.first_name} {item.creator.last_name}
              {", "}
              {new Date(item.creation_date).toLocaleDateString("en-US")}
            </p>
          </div>
          <div className="ml-auto font-medium">${item.cost}</div>
        </div>
      ))}
    </div>
  );
}
