import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { createClient } from "@/utils/supabase/server";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiEdit2, FiPlus } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Metadata } from "next";
import { ModeToggle } from "@/components/toggle-mode";
import { NavBar } from "@/components/nav";
import React, { useState } from "react";
import { redirect } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { UserEdit } from "@/components/user-edit";

export const metadata: Metadata = {
  title: "Settings",
  description: "User settings page.",
};

export default async function SettingsPage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  console.log(error);
  if (error || !data?.user) {
    console.log("redirect to main");
    redirect("/");
  }

  const user = data.user;

  return (
    <>
      <div className="flex flex-col">
        <NavBar
          links={["Dashboard", "Request List", "Paybacks", "Profile"]}
          user_details={user}
          currentPage="Settings"
        />
        <div className="flex-1 px-8 pb-8">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <br></br>
          <div className="flex flex-row">
            {/* nav menu */}
            <div
              className="w-1/4 sticky top-[80px] space-y-4 mr-8 z-10"
              style={{ height: "fit-content" }}
            >
              <nav className="divide-y divide-gray-200 dark:divide-gray-700">
                <a
                  className="flex items-center rounded-md font-medium px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition-colors"
                  href="#profile"
                >
                  Profile
                </a>
                <a
                  className="flex items-center rounded-md font-medium px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition-colors"
                  href="#security"
                >
                  Security
                </a>
                <a
                  className="flex items-center rounded-md font-medium px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition-colors"
                  href="#payment-methods"
                >
                  Payment Methods
                </a>
                <a
                  className="flex items-center rounded-md font-medium px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition-colors"
                  href="#display"
                >
                  Display
                </a>
                <a
                  className="flex items-center rounded-md font-medium px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition-colors"
                  href="#notifications"
                >
                  Notifications
                </a>
              </nav>
            </div>

            {/* profile settings */}
            <div className="w-3/4 space-y-4">
              <div id="profile">
                <Card>
                  <CardHeader className="flex justify-between">
                    <div className="flex">
                      <span className="mr-2">Profile</span>
                      <UserEdit user_details={user} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label>Profile Picture</Label>
                      <br></br>
                      <br></br>
                      <div className="flex justify-start items-center space-x-4">
                        <Avatar className="w-32 h-32 ml-4">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            className="w-full h-full object-cover rounded-full"
                          />
                          <AvatarFallback>
                            {(user.user_metadata.first_name
                              ?.slice(0, 1)
                              .toUpperCase() ?? "") +
                              (user.user_metadata.last_name
                                ?.slice(0, 1)
                                .toUpperCase() ?? "")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <br></br>
                    <Separator></Separator>
                    <br></br>

                    <div className="flex space-x-4">
                      <div className="w-1/2 space-y-2">
                        <Label>First Name</Label>
                        <div className="text-gray-600 dark:text-gray-400">
                          {user.user_metadata.first_name}
                        </div>
                      </div>

                      <div className="w-0.5 bg-border self-stretch"></div>

                      <div className="w-1/2 space-y-2">
                        <Label>Last Name</Label>
                        <div className="text-gray-600 dark:text-gray-400">
                          {user.user_metadata.last_name}
                        </div>
                      </div>
                    </div>
                    <br></br>
                    <Separator></Separator>
                    <br></br>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="text-gray-600 dark:text-gray-400">
                        {user.user_metadata.email}
                      </div>
                    </div>
                    <br></br>

                    {/*
                                <Separator></Separator>
                                <br></br>

                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <div className="w-64 text-gray-600 dark:text-gray-400">{user.user_metadata.email}</div>
                                </div>
                                */}
                  </CardContent>
                </Card>
              </div>

              {/* security settings */}
              <div id="security">
                <Card>
                  <CardHeader>Security</CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <Label>Password</Label>
                      <Input
                        id="password"
                        defaultValue={user.email}
                        type="password"
                        className="w-32"
                        disabled
                      />
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-base flex items-center justify-center">
                            <FiEdit2 />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Change Your Password</DialogTitle>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="current-password">
                                Current Password
                              </Label>
                              <Input
                                id="current-password"
                                type="password"
                                placeholder="Enter current password"
                                className="mt-1 block w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-password">New Password</Label>
                              <Input
                                id="new-password"
                                type="password"
                                placeholder="Enter new password"
                                className="mt-1 block w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="confirm-password">
                                Confirm New Password
                              </Label>
                              <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm new password"
                                className="mt-1 block w-full"
                              />
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
                    <Separator></Separator>
                    <br></br>
                    <div className="flex items-center justify-between">
                      <Label>Two-Factor Authentication (2FA)</Label>
                      <Switch />
                    </div>
                    <br></br>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </div>

              {/* payment methods settings */}
              <div id="payment-methods">
                <Card>
                  <CardHeader>Payment Methods (Venmo)</CardHeader>
                  <CardContent>
                    <br></br>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Dialog>
                      <div className="z-40"></div>
                      <div className="max-w-md">
                        <DialogTrigger asChild>
                          <div className="flex items-center gap-2 underline">
                            <span>Add new payment method</span>
                            <FiPlus className="text-base" />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="flex flex-col">
                          <div className="flex items-center space-x-2 mb-4">
                            <DialogTitle>Add New Payment Method</DialogTitle>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="venmo">Venmo Username</Label>
                              <Input
                                id="venmo"
                                type="text"
                                placeholder="Enter your venmo username"
                                autoComplete="off"
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2 justify-end">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button>Add</Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </div>
                    </Dialog>
                  </CardFooter>
                </Card>
              </div>

              {/* display settings */}
              <div id="display">
                <Card>
                  <CardHeader>Display</CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="theme">Appearance</Label>
                      <div className="pl-2">
                        <ModeToggle></ModeToggle>
                      </div>
                    </div>
                    <br></br>
                  </CardContent>
                </Card>
              </div>

              {/* notifications settings */}
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
  );
}
