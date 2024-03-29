// components/NavBar.js
import Image from "next/image";
import mainLogo from "../public/split-mate-logo.svg";

export function NavBar(
) {
  return (
    <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur">
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
            <a
              href="/dashboard"
              className="px-3 py-2 rounded-md text-sm sm:text-base hover:text-zinc-100"
            >
              Dashboard
            </a>
            <a
              href="/login"
              className="px-3 py-2 rounded-md text-sm sm:text-base hover:text-zinc-100"
            >
              Login
            </a>
          </div>
          <div className="sm:hidden flex items-center text-zinc-300 hover:text-zinc-100">
            <a
              href="/login"
              className="px-3 py-2 rounded-md text-sm sm:text-base"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};