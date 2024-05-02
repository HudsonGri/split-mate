"use client";
import { Request, columns } from "./columns";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table-history";
import { NavBar } from "@/components/nav";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Icons } from "@/components/icons"; // Assuming Icons is exported from a certain path

export default function History({ groupId }) {
  const [requestData, setRequestData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ group_id: groupId }),
      });
      if (response.ok) {
        const data = await response.json();
        setRequestData(data);
      } else {
        console.error("Failed to fetch data");
        // Handle errors appropriately
      }
      setIsLoading(false);
    }

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Icons.spinner className="mt-2 h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="container mx-auto">
          <DataTable columns={columns} data={requestData} />
        </div>
      )}
    </>
  );
}

export { History };
