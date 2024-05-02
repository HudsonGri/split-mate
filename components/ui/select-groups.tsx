"use client"
import React, { useState } from 'react';
import {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
  } from "../../components/ui/select"
  import type { ChangeEvent } from "react";
  import { usePathname, useRouter, useSearchParams } from "next/navigation";
  import {
    Button,
  } from "../../components/ui/button"


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
    data: Group_ID[]
    selected: string
    // onValueChange: Function
  }

  export type Group_ID = {
    id: string
  }

  export function SelectGroups<TData>({
    data,
    selected,
    // onValueChange,
  }: SelectGroupsProps<TData>) {
    // const [selectedGroup, setSelectedGroup] = React.useState<string>(
    //     data[0].id
    // )
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

    // const [selectedGroup, setSelectedGroup] = React.useState('');
    // const handleValueChange = (value: string) => {
    //   setSelectedGroup(value);
    // };

    // const handleChange = (selected) => {
    //   setSelectedGroup(selected);
    //   // Call the callback function with the selected value
    //   if (onValueChange) {
    //     onValueChange(selected ? selected.value : '');
    //   }
    // };

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
          {(data).map((item) => (
            <option value={item.id}>{item.id}</option>
          ))}
        </select>
    )

  }