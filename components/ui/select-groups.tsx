"use client"
  import React from 'react';
  import { useEffect, useState } from 'react';
  
  import type { ChangeEvent } from "react";
  import { usePathname, useRouter, useSearchParams } from "next/navigation";



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
    selected: string
  }

  export type Group_ID = {
    id: string
  }

  export function SelectGroups<TData>({
    selected,

  }: SelectGroupsProps<TData>) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const onSelect = (event: ChangeEvent<HTMLSelectElement>) => {
      const current = new URLSearchParams(searchParams);
  
      const value = event.target.value.trim();
  
      if (!value) {
        current.delete("selected");
      } else {
        current.set("selected", event.target.value);
      }
  
      const search = current.toString();
      const query = search ? `?${search}` : "";
  
      router.push(`${pathname}${query}`);
    };


    const [groups, setGroups] = useState([]);

    useEffect(() => {
      async function fetchGroups() {
        const res = await fetch('/api/listgroups', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ list_all_members: false }),
        });
        const data = await res.json();
        if (res.ok) {
          setGroups(data);
        } else {
          console.error('Failed to fetch groups:', data.error);
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

        <select value={selected} onChange={onSelect}>
          <option value="">Select Group</option>
          {(groups).map(group => (
            <option key={group.id} value={group.group_id}>{group.name}</option>
          ))}
        </select>
    )

  }