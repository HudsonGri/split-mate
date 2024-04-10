import { Metadata } from "next"
import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { createClient } from '@/utils/supabase/server'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  FiEdit2,
  FiChevronRight
} from 'react-icons/fi';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NavBar } from "@/components/nav"
import React, { useState } from 'react';
import { redirect } from 'next/navigation'
import { Switch } from "@/components/ui/switch"

export const metadata: Metadata = {
  title: "Settings",
  description: "User settings page.",
}

export default async function ProfilePage() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  console.log(error)
  if (error || !data?.user) {
    console.log("redirect to main")
    redirect('/')
  }

  const user = data.user
    
  return (
    <>
        <div className="flex flex-col">
            <NavBar links={["Profile"]} user_details={user}/>
            <div className="flex-1 px-8 pb-8">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <br></br>
                <div className="flex flex-row">
                    <div className="w-1/4 space-y-4 mr-8">
                        <header className="space-y-2">
                        <p className="text-gray-500 dark:text-gray-400">Manage your account settings here.</p>
                        </header>
                        <nav className="space-y-2">
                        <a className="flex items-center rounded-md font-medium px-3 py-2 text-gray-500 dark:text-gray-400" href="#account">
                            Account
                        </a>
                        <a className="flex items-center rounded-md font-medium px-3 py-2 text-gray-500 dark:text-gray-400" href="#security">
                            Security
                        </a>
                        <a className="flex items-center rounded-md font-medium px-3 py-2 text-gray-500 dark:text-gray-400" href="#notifications">
                            Notifications
                        </a>
                        </nav>
                    </div>
                    <div className="w-3/4 space-y-4">
                        <div id="account">
                        <Card>
                            <CardHeader>Account</CardHeader>
                            <CardContent>
                                {/* profile picture scuffs layout --> allows user to scroll horizontally */}

                                {/*
                                <div className="space-y-2">
                                    <Label>Profile Picture</Label>
                                    <div className="flex justify-start items-center space-x-4">
                                        <Avatar className="w-20 h-20 relative">
                                            <AvatarImage src="https://github.com/shadcn.png" className="w-full h-full object-cover rounded-full" />
                                            <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex items-center space-x-2">
                                            <Input accept="image/*" id="file" type="file" className="sr-only" />
                                            <Label htmlFor="file" className="cursor-pointer underline">
                                                Change
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                                <br></br>
                                */}
                                <div className="flex space-x-4">
                                    <div className="w-1/2 space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" placeholder="Albert" />
                                    </div>
                                    <div className="w-1/2 space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" placeholder="Gator" />
                                    </div>
                                </div>
                                <br></br>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" placeholder={user.email} type="email" />
                                </div>
                                <br></br>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" placeholder={user.phone} type="tel" className="w-64" />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button>Save Changes</Button>
                            </CardFooter>
                        </Card>
                        </div>
                        <div id="security">
                            <Card>
                                <CardHeader>Security</CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" placeholder="Password" type="password" className="w-64" />
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="underline flex justify-center items-center gap-2">
                                                    <span className="text-sm italic">Change Password</span>
                                                    <FiChevronRight className="text-base" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>Change Your Password</DialogHeader>
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label htmlFor="current-password">Current Password</Label>
                                                        <Input id="current-password" type="password" placeholder="Enter current password" className="mt-1 block w-full" />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="new-password">New Password</Label>
                                                        <Input id="new-password" type="password" placeholder="Enter new password" className="mt-1 block w-full" />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                        <Input id="confirm-password" type="password" placeholder="Confirm new password" className="mt-1 block w-full" />
                                                    </div>
                                                    <div className="flex justify-end gap-4">
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <Button>Save</Button>
                                                        </DialogClose>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <br></br>
                                    <div className="flex items-center justify-between">
                                        <Label>Two-Factor Authentication (2FA)</Label>
                                        <Switch/>
                                    </div>
                                    <br></br>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button>Save Changes</Button>
                                </CardFooter>
                            </Card>
                        </div>
                        <div id="notifications">
                            <Card>
                                <CardHeader>Notifications</CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label>SMS Notifications</Label>
                                            <Switch id="smsNotifications" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label>Email Notifications</Label>
                                            <Switch id="emailNotifications" />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button>Save Changes</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
