"use client"

/**
 * Template Code taken from: https://ui.shadcn.com/docs/components/form and https://ui.shadcn.com/docs/components/combobox#form
 */

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useRouter } from "next/navigation"
 
const formSchema = z.object({
    group: z.string({ required_error: "Please select a group" }),
    recipient: z.string({ required_error: "Please select a recipient" }),
    description: z.string().min(1, { message: "Enter a description" }).max(255, { message: "Max 255 characters" }),
    amount: z.coerce.number({ message: "Enter a monetary value" }).multipleOf(0.01, { message: "Round to the nearest cent" }).min(0.01, { message: "Enter a positive value" }),
})
 
export function PaybackForm() {
    const fetchGroups = async () => {
        const res = await fetch('/api/paybacks/log', { method: "GET" });

        if (res.ok) {
            const data = await res.json();
            setGroups(data);
        }
        else {
            router.push('/error');
        }
    };

    const fetchPeople = async (groupId: string) => {
        const res = await fetch('/api/paybacks/log', { 
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ groupId })
        })
            
        if (res.ok) {
            const data = await res.json();
            setPeople(data);
        }
        else {
            router.push('/error');
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const res = await fetch('/api/paybacks/log', { 
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(values)
        });
            
        if (!res.ok) {
            router.push('/error');
        }

        form.reset();
        setPeople([]);
    }

    const [people, setPeople] = React.useState<{id: string, name: string}[]>([]);
    const [groups, setGroups] = React.useState<{id: string, name: string}[]>([]);
    const router = useRouter();

    React.useEffect(() => { fetchGroups(); }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          description: "",
          amount: "",
        },
      })
 
    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ml-4">
            <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Group</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                        )}
                        disabled={!groups.length}
                        >
                        {field.value
                            ? groups.find(
                                (group) => group.id === field.value
                            )?.name
                            : "Select group"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search group..." />
                        <CommandEmpty>No groups found.</CommandEmpty>
                        <CommandGroup>
                        {groups.map((group) => (
                            <CommandItem
                            value={group.name}
                            key={group.id}
                            onSelect={() => {
                                form.setValue("group", group.id);
                                fetchPeople(group.id);
                            }}
                            >
                            <Check
                                className={cn(
                                "mr-2 h-4 w-4",
                                group.name === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                            />
                            {group.name}
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </Command>
                    </PopoverContent>
                </Popover>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="recipient"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Person</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                        )}
                        disabled={!people.length}
                        >
                        {field.value
                            ? people.find(
                                (person) => person.id === field.value
                            )?.name
                            : "Select person"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search people..." />
                        <CommandEmpty>No people found.</CommandEmpty>
                        <CommandGroup>
                        {people.map((person) => (
                            <CommandItem
                            value={person.name}
                            key={person.id}
                            onSelect={() => {
                                form.setValue("recipient", person.id);
                            }}
                            >
                            <Check
                                className={cn(
                                "mr-2 h-4 w-4",
                                person.name === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                            />
                            {person.name}
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </Command>
                    </PopoverContent>
                </Popover>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                        <div className="flex items-center">
                            <span className="text-gray-500 mr-2">$</span>
                            <Input placeholder="0.00" {...field} />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Input placeholder="..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex justify-center">
                <Button type="submit">Submit</Button>
            </div>
        </form>
        </Form>
    )
}