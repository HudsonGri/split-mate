"use client";
import Image from "next/image"
import { motion } from 'framer-motion';
import { Button } from "../../components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import mainLogo from "../../public/split-mate-logo.svg";
import { Input } from "@/components/ui/input"

import { CurrencyDollarIcon, ShoppingCartIcon, ChartPieIcon } from '@heroicons/react/24/solid'

const features = [
    {
        name: 'Shared Cart Management',
        description:
            'Any roommate can add items to a unified list — pending mutual approval — for perfect pantry parity.',
        icon: ShoppingCartIcon,
    },
    {
        name: 'Selective Splitting',
        description:
            'Choose who pays for what with advanced splitting, ensuring everyone only covers their share, like for that milk not everyone drinks.',
        icon: ChartPieIcon,
    },
    {
        name: 'Payment Simplified',
        description:
            'Seamlessly integrate with Venmo or CashApp to settle up instantly, right from within the app.',
        icon: CurrencyDollarIcon,
    },
]




export default function LandingPage() {

    const headerWords = "Manage group expenses the fair way with smarter splits.".split(" ");

    // Variants for animating each word
    const wordVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    // Card variants for staggering appearance
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (delay) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay }
        })
    };

    // Variants for the container to stagger the child animations
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    return (
        <>


            <div className="min-h-screen">
                <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur">
                    <div className="px-4 sm:px-6 lg:px-16">
                        <div className="flex justify-between items-center h-20">
                            <div className="flex-shrink-0 flex items-center">
                                <Image
                                    priority
                                    src={mainLogo}
                                    width={200}
                                    alt="Split Mate"
                                    className="w-32 sm:w-40"
                                />
                            </div>
                            <div className="hidden sm:flex items-center space-x-4 text-zinc-300">
                                <a href="/dashboard" className="px-3 py-2 rounded-md text-sm sm:text-base">Dashboard</a>
                                <a href="/login" className="px-3 py-2 rounded-md text-sm sm:text-base">Login</a>
                            </div>
                            <div className="sm:hidden flex items-center text-zinc-300">
                                <a href="/login" className="px-3 py-2 rounded-md text-sm sm:text-base">Login</a>
                            </div>
                        </div>
                    </div>
                </nav>

                <header className="py-8 sm:grid sm:grid-flow-col">
                    <div className="max-w-4xl px-4 mx-auto lg:ml-12 py-2 sm:py-10 text-zinc-50">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-4xl sm:text-5xl font-semibold leading-tight"
                        >
                            {headerWords.map((word, index) => (
                                <motion.span key={index} variants={wordVariants} style={{ display: 'inline-block', marginRight: '0.5rem' }}>
                                    {word}
                                </motion.span>
                            ))}
                        </motion.div>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="grid sm:grid-cols-2 gap-4 lg:pt-6">
                                <motion.div variants={cardVariants} custom={0.2} initial="hidden" animate="visible">
                                    <Card className="w-full mt-9 h-full flex flex-col">
                                        <CardHeader>
                                            <CardTitle className="text-xl sm:text-3xl">Join an existing group</CardTitle>
                                            <CardDescription>Join an already created group by inputing the group code below.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Input type="text" placeholder="KBX-Q2N" />
                                        </CardContent>
                                        <CardFooter className="justify-center">
                                            <Button className="w-1/2">Join</Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>

                                <motion.div variants={cardVariants} custom={0.4} initial="hidden" animate="visible">
                                    <Card className="w-full mt-9 h-full flex flex-col">
                                        <CardHeader>
                                            <CardTitle className="text-xl sm:text-3xl">Create a new group</CardTitle>
                                            <CardDescription >Create a new group and invite others by clicking the button below.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="">
                                        </CardContent>
                                        <CardFooter className="justify-center">
                                            <Button className="w-1/2">Create</Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hidden lg:block lg:px-2 text-zinc-50">
                        <Image
                            src="/hero-graphic.png"
                            width={700}
                            height={700}
                            alt="Hero illustration"
                            className="sm:w-auto sm:max-w-sm lg:max-w-lg" // Responsive image sizes
                        />

                    </motion.div>

                </header>

                <main>
                    {/* Feature section */}
                    <div className="py-24 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl lg:text-center">
                                <p className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                                    Streamline your groceries, split expenses effortlessly.
                                </p>
                                <p className="mt-6 text-lg leading-8 text-gray-300">
                                    Shared shopping simplified — never debate who owes what again. Our app is your ultimate roommate harmony tool: half grocery list, half expense manager. Stay organized with a communal list for shared groceries and supplies, like dish soap, and rest easy as every purchase made is fairly split among the roommates.
                                </p>
                            </div>
                            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                                    {features.map((feature) => (
                                        <div key={feature.name} className="flex flex-col">
                                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                                                <feature.icon className="h-6 w-6 flex-none text-green-400" aria-hidden="true" />
                                                {feature.name}
                                            </dt>
                                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                                                <p className="flex-auto">{feature.description}</p>
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="px-4 py-6 sm:px-0">
                            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex justify-around items-center">

                                <div className="text-center">
                                    placeholder
                                </div>
                                <div className="text-center">
                                    placeholder 2
                                </div>
                            </div>
                        </div>
                    </div>
                </main>


            </div>
        </>

    )
}
