"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

import { useState, useEffect } from "react";

export default function PeopleTable({ groupId }) {
  const [peopleData, setPeopleData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/listpeople", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ group_id: groupId }),
      });
      if (response.ok) {
        const data = await response.json();
        setPeopleData(data);
      } else {
        console.error("Failed to fetch data");
        // Handle errors appropriately
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Table>
            <TableCaption>A list of people in this group.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(peopleData).map(person => (
                 <TableRow>
                  <TableCell className="font-medium">{person.profiles.first_name + " " + person.profiles.last_name}</TableCell>
                  <TableCell>{person.profiles.email}</TableCell>
                 </TableRow>
              ))}
            </TableBody>
          </Table>
    </>
  );
}

export {PeopleTable};
