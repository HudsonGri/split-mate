"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import { signInWithGithub, signup } from "@/app/login/actions"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthFormSignUp({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const [gitHubIsLoading, setGitHubIsLoading] = React.useState<boolean>(false)

  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    //MUST MODIFY TO ALSO HANDLE NAME
    event.preventDefault();
    setIsLoading(true);
    console.log("here")

    const formData = new FormData(event.currentTarget as HTMLFormElement)
    console.log("FORM Data Print:")
    console.log(event)

    const signupSuccess = await signup(formData);
    setIsLoading(false);

    if (signupSuccess) {
      setIsDialogOpen(true); // Open the dialog on successful signup
    }
  }

  async function gitHubSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setGitHubIsLoading(true)
    signInWithGithub();


  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First name</Label>
            <Input
              type="text"
              id="first-name"
              name="first-name"
              className="input-class"
              placeholder="First name"
              autoComplete="given-name"
              aria-required="true"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input
              type="text"
              id="last-name"
              name="last-name"
              className="input-class"
              placeholder="Last name"
              autoComplete="family-name"
              aria-required="true"
              required
            />
          </div>
        </div>
        <div className="my-4 space-y-4">
          <div className="grid space-y-2">
            <Label htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={gitHubIsLoading || isLoading}
            />
          </div>
          <div className="grid space-y-2">
            <Label htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={gitHubIsLoading || isLoading}
            />
          </div>
          <Button disabled={gitHubIsLoading || isLoading} className="w-full">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up
          </Button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
          <DialogDescription>
          Please check your email for a verification link to confirm your email address.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={gitHubIsLoading || isLoading} onClick={gitHubSubmit}>
        {gitHubIsLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button>
    </div>
  )
}
