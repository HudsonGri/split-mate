"use client";
import React from "react";
import { useEffect, useState } from "react";

import type { ChangeEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// export async function getGroups(user_details: any): Promise<Group_ID[]>{
//   // Fetch data from your API here.

//   const supabase = createClient()

//   let { data, error } = await supabase
//   .from('group_membership')
//   .select("group_id")
//   .eq('user_id', user_details.id);

//   //console.log("USER ID = ", user_details.id);
//   if (error) {
//     console.log(error)
//     redirect('/error')
//   }
//   if (data) {
//     //console.log("DATA: ", data);
//     // if (!Array.isArray(data)) {
//     //   console.log('Data is not an array:', data);
//     //   data = [data];
//     // }
//     const groups: Group_ID[] = data.map(setGroups);
//     return groups;
//   }
// }

// export function setGroups(value) {
//   var item: Group_ID = {
//     id: value.group_id,
//   }
//   return item
// }

interface SelectGroupsProps<TData> {
  selected: string;
}

export type Group_ID = {
  id: string;
};

export function SelectGroups<TData>({ selected }: SelectGroupsProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onSelect = (e) => {
    const current = new URLSearchParams(searchParams);

    const value = e.trim();

    if (!value) {
      current.delete("selected");
    } else {
      current.set("selected", e);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function fetchGroups() {
      const res = await fetch("/api/listgroups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ list_all_members: false }),
      });
      const data = await res.json();
      if (res.ok) {
        setGroups(data);
      } else {
        console.error("Failed to fetch groups:", data.error);
      }
    }

    fetchGroups();
  }, []);

  return (
    // <Select value={selected} onChange={onSelect}>
    //   <SelectTrigger className="w-[180px]">
    //     <SelectValue placeholder="Select Group"/>
    //   </SelectTrigger>
    //   <SelectContent>
    //     <SelectGroup>
    //       <SelectLabel>Groups</SelectLabel>
    //       {(data).map((item) => (
    //         <SelectItem value={item.id}>{item.id}</SelectItem>
    //       ))}
    //     </SelectGroup>
    //   </SelectContent>
    // {/* <Button variant="secondary">Switch Groups</Button> */}
    // </Select>

    <Select value={selected} onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a group" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Groups</SelectLabel>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.group_id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
