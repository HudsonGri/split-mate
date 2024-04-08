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

export function UserNav({ user_details }: { user_details?: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" />
            <AvatarFallback>EX</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <a href="/profile">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Name</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user_details.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </a>
      <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
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
