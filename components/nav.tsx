// components/NavBar.js
import Image from "next/image";
import mainLogo from "../public/split-mate-logo.svg";
import { UserNav } from "./user-nav";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from 'next/link'

export function NavBar({ links, user_details }: { links: string[], user_details?: any }) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur dark:bg-black/70 bg-white">
      <div className="px-4 sm:px-6 lg:px-16">
        <div className="flex justify-between items-center h-20">
          <a href='/'>
            <div className="flex-shrink-0 flex items-center">
              <Image
                priority
                src={mainLogo}
                width={200}
                alt="Split Mate Logo"
                className="w-32 sm:w-40"
              />
            </div>
          </a>

          <div className="hidden sm:flex items-center space-x-4 text-zinc-300 ">
            {links.map((link, index) => (
              <div key={index}>
                {link == "Log In" &&
                  <Link className={buttonVariants({ variant: "outline" })} href='/login'>Log In <ArrowTopRightIcon className="ml-2 h-4 w-4" /></Link>
                }
                {link == "Dashboard" &&
                  <Link className={buttonVariants({ variant: "ghost" })} href='/dashboard'>Dashboard</Link>
                }
                {link == "Profile" &&
                  <UserNav user_details={user_details} />

                }
              </div>
            ))}
          </div>
          <div className="sm:hidden flex items-center text-zinc-300 hover:text-zinc-100">
          {links.map((link, index) => (
              <div key={index}>
                {link == "Log In" &&
                  <Link className={buttonVariants({ variant: "outline" })} href='/login'>Log In <ArrowTopRightIcon className="ml-2 h-4 w-4" /></Link>
                }
                {link == "Dashboard" &&
                  <Link className={buttonVariants({ variant: "ghost" })} href='/dashboard'>Dashboard</Link>
                }
                {link == "Profile" &&
                  <UserNav user_details={user_details} />

                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};