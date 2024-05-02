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
import { Button } from "@/components/ui/button";
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

  async function deleteMember(userID: string, groupID: string) {
    // Fetch data from your API here.

    const response = await fetch("/api/group/deletemember", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID , groupID}),
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
  }

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
                  <TableCell>
                    <Button variant={"destructive"} onClick={() => deleteMember(person.profiles.id, groupId)}>Delete</Button>
                    </TableCell>
                 </TableRow>
              ))}
            </TableBody>
          </Table>
    </>
  );
}

export {PeopleTable};
