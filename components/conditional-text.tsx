"use client";
import { useSearchParams } from "next/navigation";

export function ConitionalText() {
    const searchParams = useSearchParams();
    const group = searchParams.get("group");
    return (
        <h1 className="text-2xl font-semibold tracking-tight">
            {group === 'create' ? 'Please log in to create a group' :
                group === 'join' ? 'Please log in to join a group' :
                    group ? 'Welcome Back' : 'Welcome Back'}
        </h1>
    );
}
