"use client";
import { Request, columns } from "./columns";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table-history";
import { NavBar } from "@/components/nav";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function History({ groupId }) {
  const [requestData, setRequestData] = useState([]);

  useEffect(() => {
    async function fetchData() {
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
    }

    fetchData();
  }, []);

  return (
    <>
      {/* <div>
        <h1><pre>{JSON.stringify(data.user.user_metadata.full_name, null, 2)}</pre></h1><br></br>
        <h1><pre>{JSON.stringify(data, null, 2)}</pre></h1>
        <h1><pre>{data.user.}</pre></h1>
      </div> */}
      <div className="container mx-auto">
        <DataTable columns={columns} data={requestData} />
      </div>
    </>
  );
}

export { History };
