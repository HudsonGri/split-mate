"use client";
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export function GroupSelect({ onGroupChange, defaultValue }) {
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

  const handleChange = (e) => {
    onGroupChange(e);
  };

  return (
    <Select onValueChange={handleChange} value={defaultValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a group" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
        <SelectLabel>
            Your Groups</SelectLabel>
          {groups.map(group => (
            <SelectItem key={group.id} value={group.group_id}>{group.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default GroupSelect;
