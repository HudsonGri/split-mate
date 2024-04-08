import { Metadata } from "next"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../../components/ui/table"
import { Switch } from "@/components/ui/switch"


export const metadata: Metadata = {
  title: "Profile",
  description: "Profile page with information about user.",
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

  {/* sample placeholder data */}
  const groups = [
    {
      name: "CHASM",
      type: "Group",
      image: "http://localhost:3000/_next/image?url=%2Fhero-graphic.png&w=1920&q=75",
      url: "https://github.com/HudsonGri/split-mate",
    }
  ];
  
  const payment_methods = [
    {
      name: "American Express Platinum",
      type: "Credit",
      identifier: "6908",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/2052px-American_Express_logo_%282018%29.svg.png",
    },
    {
      name: "PayPal",
      type: "",
      identifier: "algator@ufl.edu",
      url: "https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-monotone-transparent.svg",
    },
    {
      name: "Chase Sapphire Reserve",
      type: "Credit",
      identifier: "8096",
      url: "https://1000logos.net/wp-content/uploads/2016/11/Shape-of-the-Chase-logo-500x311.jpg",
    }
  ];

  const history = [
    {
      date: "2/10/24",
      amount: -15,
      roommate: "Alberta Gator",
      expense: "Dinner",
      amount_pending: 5.23,
      amount_owed: 12.32,
    },
    {
      date: "2/18/24",
      amount: -5.55,
      roommate: "Bob Student",
      expense: "Dish Soap",
      amount_pending: 6.23,
      amount_owed: 27.32,
    },
    {
      date: "2/14/24",
      amount: 8.32,
      roommate: "John Doe",
      expense: "Groceries",
      amount_pending: 7.23,
      amount_owed: 32.87,
    },
    {
      date: "2/14/24",
      amount: 8.32,
      roommate: "John Doe",
      expense: "Groceries",
      amount_pending: 7.23,
      amount_owed: 32.87,
    },
    {
      date: "2/14/24",
      amount: 8.32,
      roommate: "John Doe",
      expense: "Groceries",
      amount_pending: 7.23,
      amount_owed: 32.87,
    }
  ]
    
  return (
    <>
      <div className="flex flex-col">
      <NavBar links={["Profile"]} user_details={user}/>
      <div className="flex-1 space-y-4 px-8 pb-8">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>

        {/* avatar */} 
        <div className="flex items-center justify-center space-y-2">
          <div>
            <br></br> 
            <Avatar className="h-32 w-32 mx-auto">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* name and email */}
        <div className="order-0 md:order-none flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="font-bold text-2xl mr-4">Albert Gator</h1>

              {/* edit name, email, and avatar */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-base">
                    <FiEdit2 />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      {/* Avatar section with left-aligned label */}
                      <div className="col-span-1">
                        <Label htmlFor="file" className="font-medium cursor-pointer">
                          Avatar
                        </Label>
                      </div>
                      <div className="col-span-3 flex items-center gap-4">
                        <img
                          alt="Your avatar"
                          className="rounded-full"
                          src="https://github.com/shadcn.png"
                          style={{
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                            width: "64px",
                            height: "64px",
                          }}
                        />
                        <Input accept="image/*" className="sr-only" id="file" type="file" />
                        <Label htmlFor="file" className="cursor-pointer">
                          Change
                        </Label>
                      </div>
                    </div>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="col-span-1">
                          Name
                        </Label>
                        <Input
                          id="name"
                          defaultValue="Albert Gator"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="col-span-1">
                          Email
                        </Label>
                        <Input
                          id="username"
                          placeholder={user.email}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit">Save changes</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* profile cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-start-1 lg:col-span-3 flex flex-col">

            {/* settings (temp) */}
            <Sheet>
              <SheetTrigger asChild>
                <div className="cursor-pointer">
                  <Card className="flex items-center justify-between p-4 mb-4">
                    <CardTitle>Settings</CardTitle>
                    <FiChevronRight className="text-base"/>
                  </Card>
                </div>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="space-y-8 p-4"> {/* Add padding here if needed */}
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium leading-6">Account Settings</h2>
                    <div className="flex justify-between">
                      <Label htmlFor="profile-visibility" className="flex-initial">Profile visibility</Label>
                      <Switch defaultChecked id="profile-visibility" />
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-8 space-y-2">
                    <h2 className="text-lg font-medium leading-6">Privacy Settings</h2>
                    <div className="flex justify-between">
                      <Label htmlFor="allow-dms" className="flex-initial font-medium">Allow direct messages</Label>
                      <Switch id="allow-dms" />
                    </div>
                    <div className="flex justify-between">
                      <Label htmlFor="last-online" className="flex-initial font-medium">Show when I was last online</Label>
                      <Switch defaultChecked id="last-online" />
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-8 space-y-2">
                    <h2 className="text-lg font-medium leading-6">Notification Settings</h2>
                    <div className="flex justify-between">
                      <Label htmlFor="email-notifications" className="flex-initial font-medium">Email notifications</Label>
                      <Switch defaultChecked id="email-notifications" />
                    </div>
                    <div className="flex justify-between">
                      <Label htmlFor="push-notifications" className="flex-initial font-medium">Push notifications</Label>
                      <Switch id="push-notifications" />
                    </div>
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* groups */}
            <Card className="flex-1 mb-4">
              <CardHeader>
                <CardTitle>Your Groups</CardTitle>
              </CardHeader>
              <CardContent>
                {groups.slice(0, 3).map((entry, index) => (
                  <div key={index} className="divide-y divide-gray-200 dark:divide-gray-800">
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center space-x-4">
                        <Avatar className="mx-auto">
                          <AvatarImage src={entry.image} />
                          <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="leading-none">
                          <h3 className="text-sm font-medium leading-none">{entry.name}</h3>
                          <p className="text-sm font-normal leading-none text-gray-500 dark:text-gray-400">{entry.type}</p>
                        </div>
                      </div>
                      <a href={entry.url}>
                        <Button>View</Button>
                      </a>
                    </div>
                  </div>
                ))}
                <div className="mt-4 flex justify-center items-center gap-2 p-4">
                <a href="" className="flex items-center gap-2 underline">
                  <span>View All Groups</span>
                  <FiChevronRight className="text-base" />
                </a>
              </div>
              </CardContent>
            </Card>

            {/* payment methods */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                {payment_methods.slice(0, 3).map((entry, index) => (
                  <div key={index} className="divide-y divide-gray-200 dark:divide-gray-800">
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center space-x-4">
                        <img
                          alt="Logo"
                          height="40"
                          src={entry.url}
                          style={{
                            aspectRatio: "40/40",
                            objectFit: "cover",
                          }}
                          width="40"
                        />
                        <div className="leading-none">
                          <h3 className="text-sm font-medium leading-none">{entry.name}</h3>
                          <p className="text-sm font-normal leading-none text-gray-500 dark:text-gray-400">{entry.type + " " + entry.identifier}</p>
                        </div>
                      </div>

                      {/* edit payment method dialog */}                      
                      <Dialog>
                        <div className="z-40"></div>
                        <div className="max-w-md">
                          <DialogTrigger asChild>
                            <Button>Edit</Button>
                          </DialogTrigger>
                          <DialogContent className="flex flex-col justify-between" style={{ minHeight: '80vh' }}>
                            <div>
                              <div className="flex items-center space-x-2 mb-4">
                                <DialogTitle>Edit Payment Method</DialogTitle>
                              </div>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="card_name">Card Name</Label>
                                  <Input id="card_name" placeholder="Enter a name for this card" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="name">Cardholder Name</Label>
                                  <Input id="name" placeholder="Enter your name" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="number">Card Number</Label>
                                  <Input id="number" placeholder="Enter your card number"/>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="month">Expires</Label>
                                    <Select>
                                      <SelectTrigger aria-label="Month" id="month">
                                        <SelectValue placeholder="Month" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {/* Assuming your Select component works like this, adjust if different */}
                                        <SelectItem value="1">January</SelectItem>
                                        <SelectItem value="2">February</SelectItem>
                                        <SelectItem value="3">March</SelectItem>
                                        <SelectItem value="4">April</SelectItem>
                                        <SelectItem value="5">May</SelectItem>
                                        <SelectItem value="6">June</SelectItem>
                                        <SelectItem value="7">July</SelectItem>
                                        <SelectItem value="8">August</SelectItem>
                                        <SelectItem value="9">September</SelectItem>
                                        <SelectItem value="10">October</SelectItem>
                                        <SelectItem value="11">November</SelectItem>
                                        <SelectItem value="12">December</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="year">Year</Label>
                                    <Select>
                                      <SelectTrigger aria-label="Year" id="year">
                                        <SelectValue placeholder="Year" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="2023">2023</SelectItem>
                                        <SelectItem value="2024">2024</SelectItem>
                                        <SelectItem value="2025">2025</SelectItem>
                                        <SelectItem value="2026">2026</SelectItem>
                                        <SelectItem value="2027">2027</SelectItem>
                                        <SelectItem value="2028">2028</SelectItem>
                                        <SelectItem value="2029">2029</SelectItem>
                                        <SelectItem value="2030">2030</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="cvc">CVV</Label>
                                    <Input id="cvc" placeholder="CVC" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex justify-between items-center">

                                {/* remove payment method dialog */}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <span className="text-red-500 underline cursor-pointer">Remove Payment</span>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogTitle>Confirm Removal</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to remove this payment method?
                                    </DialogDescription>
                                    <DialogFooter className="flex justify-end gap-2">
                                      <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                      </DialogClose>
                                      <DialogClose asChild>
                                        <Button className="bg-red-500 text-white hover:bg-red-700 transition duration-150 ease-in-out">Confirm</Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <div className="flex gap-2">
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <Button>Save Changes</Button>
                                    </DialogClose>
                                  </div>
                              </div>
                            </div>
                          </DialogContent>
                        </div>
                      </Dialog>
                    </div>
                  </div>
                ))}

                {/* view all payment methods in settings */}
                <div className="mt-4 flex justify-center items-center gap-2 p-4">
                  <a href="" className="flex items-center gap-2 underline">
                    <span>Manage Payment Methods</span>
                    <FiChevronRight className="text-base" />
                  </a>
              </div>
              </CardContent>
            </Card>
          </div>

          {/* personal history */}
          <Card className="lg:col-start-4 lg:col-span-4 flex flex-col" style={{ height: 'auto' }}>
            <CardHeader>
              <CardTitle>Personal History</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between flex-grow">
              <Table>
                <TableCaption>A list of your recent transactions</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Roommate</TableHead>
                    <TableHead>Expense</TableHead>
                    <TableHead>Amount Pending</TableHead>
                    <TableHead className="text-right">Amount Owed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.slice(0, 11).map((entry) => (
                      <TableRow key={entry.date}>
                        <TableCell className="font-medium">{entry.date}</TableCell>
                        <TableCell className={`text-center ${entry.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>{(entry.amount >= 0 ? `+` : `-`)}${Math.abs(entry.amount).toFixed(2)}</TableCell>
                        <TableCell className="text-left">{entry.roommate}</TableCell>
                        <TableCell className="text-left">{entry.expense}</TableCell>
                        <TableCell className={`text-center ${entry.amount_pending >= 0 ? 'text-green-500' : 'text-red-500'}`}>${entry.amount_pending.toFixed(2)}</TableCell>
                        <TableCell className={`text-center ${entry.amount_owed > 0 ? 'text-red-500' : 'text-green-500'}`}>${entry.amount_owed.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {/* view all transactions*/}
              <div className="mt-4 flex justify-center items-center gap-2 p-4">
                <a href="" className="flex items-center gap-2 underline">
                  <span>View All Transactions</span>
                  <FiChevronRight className="text-base" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  </div>
  </>
  )
}
