"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming Skeleton is imported from a similar path

export function RecentRequests({ group_id }) {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added state to track loading status

  useEffect(() => {
    setIsLoading(true); // Set loading to true when group_id changes
    fetch(`/api/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ group_id: group_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setRequests(data);
        setIsLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setIsLoading(false); // Ensure loading is set to false on error as well
      });
  }, [group_id]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {requests
        .slice(-5)
        .reverse()
        .map((item, index) => (
          <div className="flex items-center" key={index}>
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {item.creator.first_name.slice(0, 1).toUpperCase()}
                {item.creator.last_name.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {item.name}

                {!item.approved && (
                  <Badge variant="outline" className="ml-2">
                    Unapproved
                  </Badge>
                )}
                {item.purchased && (
                  <Badge variant="secondary" className="ml-2">
                    Purchased
                  </Badge>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                - {item.creator.first_name} {item.creator.last_name}
                {", "}
                {new Date(item.creation_date).toLocaleDateString("en-US")}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
