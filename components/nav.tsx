// components/NavBar.js
"use client";
import Image from "next/image";
import mainLogo from "../public/split-mate-logo.svg";
import lightLogo from "../public/logo-light.png";
import { UserNav } from "./user-nav";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";
import { ModeToggleNav } from "./toggle-mode-nav";

export function NavBar({
  links,
  user_details,
  currentPage,
  isAdmin,
}: {
  links: string[];
  user_details?: any;
  currentPage: string;
  isAdmin: boolean;
}) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const effectiveTheme = theme === "system" ? resolvedTheme : theme;
  const imageSrc = mounted
    ? effectiveTheme === "dark"
      ? mainLogo
      : lightLogo
    : null;

  const isActive = (link) => currentPage === link;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur dark:bg-background/70 bg-white">
      <div className="px-4 sm:px-6 lg:px-16">
        <div className="flex justify-between items-center h-20">
          <a href="/dashboard">
            <div className="flex-shrink-0 flex items-center">
              {imageSrc && (
                <Image
                  src={imageSrc}
                  height={200}
                  width={200}
                  alt="Split Mate Logo"
                  className="w-32 sm:w-40"
                />
              )}
            </div>
          </a>
          <div className="hidden sm:flex items-center space-x-4 text-zinc-300 ">
            {links.map((link, index) => (
              <div key={index} className={isActive(link) ? "text-white" : ""}>
                {link == "Log In" && (
                  <Link
                    className={buttonVariants({
                      variant: "outline"
                    })}
                    href="/login"
                  >
                    Log In <ArrowTopRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                )}
                {link == "Dashboard" && (
                  <Link
                    className={buttonVariants({
                      variant: isActive(link) ? "outline" : "ghost",
                    })}
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                )}
                {link == "Paybacks" && (
                  <Link
                    className={buttonVariants({
                      variant: isActive(link) ? "outline" : "ghost",
                    })}
                    href="/payback"
                  >
                    Paybacks
                  </Link>
                )}
                {link == "Request List" && (
                  <Link
                    className={buttonVariants({
                      variant: isActive(link) ? "outline" : "ghost",
                    })}
                    href="/requestlist"
                  >
                    Request List
                  </Link>
                )}
                {link == "Expenses" && (
                  <Link
                    className={buttonVariants({
                      variant: isActive(link) ? "outline" : "ghost",
                    })}
                    href="/expenses"
                  >
                    Expenses
                  </Link>
                )}
                {link == "Profile" && <UserNav user_details={user_details} isAdmin={isAdmin}/>}
              </div>
            ))}
          </div>
          <div className="sm:hidden flex items-center text-zinc-300 hover:text-zinc-100">
            {links.map((link, index) => (
              <div key={index} className={isActive(link) ? "text-white" : ""}>
                {link == "Log In" && (
                  <Link
                    className={buttonVariants({
                      variant: "outline"
                    })}
                    href="/login"
                  >
                    Log In <ArrowTopRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                )}
                {link == "Paybacks" && (
                  <Link
                    className={buttonVariants({
                      variant: isActive(link) ? "outline" : "ghost",
                    })}
                    href="/payback"
                  >
                    Paybacks
                  </Link>
                )}
                {link == "Request List" && (
                  <Link
                    className={buttonVariants({
                      variant: isActive(link) ? "outline" : "ghost",
                    })}
                    href="/requestlist"
                  >
                    Request List
                  </Link>
                )}
                {link == "Dashboard" && (
                  <Link
                    className={buttonVariants({
                      variant: isActive(link) ? "outline" : "ghost",
                    })}
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                )}
                {link == "Expenses" && (
                  <Link
                    className={buttonVariants({
                      variant: isActive(link) ? "outline" : "ghost",
                    })}
                    href="/expenses"
                  >
                    Expenses
                  </Link>
                )}
                {link == "Profile" && <UserNav user_details={user_details} isAdmin={isAdmin} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
