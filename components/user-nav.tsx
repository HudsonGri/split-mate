import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import Link from 'next/link';

export function UserNav({ user_details }: { user_details?: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {user_details.user_metadata.first_name ? 
            <AvatarFallback>{user_details.user_metadata.first_name.slice(0,1).toUpperCase()}{user_details.user_metadata.last_name.slice(0,1).toUpperCase()}</AvatarFallback>
            : <AvatarFallback>{user_details.email.slice(0,2).toUpperCase()}</AvatarFallback>}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <Link href="/profile" className="font-normal">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user_details.user_metadata.first_name} {user_details.user_metadata.last_name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user_details.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/settings">
            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      <DropdownMenuSeparator />
        <a href="/logout">
          <DropdownMenuItem>
            Log out
          </DropdownMenuItem>
        </a>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
