

import { NavBar } from "@/components/nav";
import { Landing } from "@/components/landing";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Split Mate',
  description: 'Manage group expenses the fair way.',
}

export default function LandingPage() {
  return (
    <>
      <div className="min-h-screen">
        <NavBar links={["Log In"]} currentPage="Landing" />
        <Landing />
      </div>
    </>
  );
}
