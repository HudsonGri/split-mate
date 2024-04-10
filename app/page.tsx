"use client";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import mainLogo from "../../public/split-mate-logo.svg";
import { Input } from "@/components/ui/input";
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ChartPieIcon,
} from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useTheme } from 'next-themes';
import { NavBar } from "@/components/nav";
import { createClient } from '@/utils/supabase/client'


const features = [
  {
    name: "Shared Cart Management",
    description:
      "Any roommate can add items to a unified list — pending mutual approval — for perfect pantry parity.",
    icon: ShoppingCartIcon,
  },
  {
    name: "Selective Splitting",
    description:
      "Choose who pays for what with advanced splitting, ensuring everyone only covers their share, like for that milk not everyone drinks.",
    icon:  ChartPieIcon,
},
  {
    name: "Payment Simplified",
    description:
      "Seamlessly integrate with Venmo or CashApp to settle up instantly, right from within the app.",
    icon: CurrencyDollarIcon,
  },
];

export default function LandingPage() {
  const headerWords = "Manage group expenses the fair way with smarter splits.".split(    " "
  );
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const { theme } = useTheme();
  const imageSrc = theme === 'dark' ? '/hero-graphic.png' : '/hero-graphic-light.png';
  const isLightTheme = theme === 'light';

  return (
    <>
      <div className="min-h-screen">
        
        <NavBar links={["Log In"]} />
        <header className="py-8 sm:grid sm:grid-flow-col">
          <div className="max-w-4xl px-4 mx-auto lg:ml-12 py-2 sm:py-10 text-zinc-50">
            <motion.div
              variants={containerVariants}       
                initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl font-semibold"
            >
              {headerWords.map((word, index) => (
                <motion.span
                  key={index}
                  variants={wordVariants}
                  className="inline-block mr-[0.5rem] leading-tight text-black dark:text-white"
               
                >
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
                <motion.div
                  variants={cardVariants}
                  custom={0.2}
                  initial="hidden"
                  animate="visible"
                >
                  <Card className="w-full mt-9 h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-3xl">
                        Join an existing group
                      </CardTitle>
                      <CardDescription>Join an already created group by inputing the group code
                        below.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Input type="text" placeholder="KBX-Q2N" />
                    </CardContent>
                    <CardFooter className="justify-center">
                      <Button className="w-1/2">Join</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
                <motion.div
                  variants={cardVariants}
                  custom={0.4}
                  initial="hidden"
                  animate="visible"
                >
                  <Card className="w-full mt-9 h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-3xl">
                        Create a new group
                      </CardTitle>
                      <CardDescription>
                        Create a new group and invite others by clicking the
                        button below.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className=""></CardContent>
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
            className="hidden lg:block lg:px-2 text-zinc-50"
          >
            <Image
              src={imageSrc}
              width={700}
              height={700}
              alt="Hero illustration"
              className={`sm:w-auto sm:max-w-sm lg:max-w-lg ${isLightTheme ? 'min-w-[500px] min-h-[500px]' : ''}`}
            />
          </motion.div>
        </header>
        <main>
          {/* Feature section */}
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="py-24 sm:py-32"
          >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:text-center">
                <motion.p
                  variants={wordVariants}
                  className="mt-2 text-3xl font-semibold text-black dark:text-white sm:text-4xl"
                >
                  Streamline your groceries, split expenses effortlessly.
                </motion.p>
                <motion.p
                  variants={wordVariants}
                  className="mt-6 text-lg leading-8 text-gray-700 dark:text-gray-300"
                >
                  Shared shopping simplified — never debate who owes what again.
                  Our app is your ultimate roommate harmony tool: half grocery
                  list, half expense manager. Stay organized with a communal
                  list for shared groceries and supplies, like dish soap, and
                  rest easy as every purchase made is fairly split among the                  roommates.
                </motion.p>
              </div>
              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      variants={cardVariants}
                      custom={index * 0.2}
                      className="flex flex-col"
                    >                      <dt className="flex items-center gap-x-3 text-gray-800 dark:text-white font-semibold leading-7 text-white">
                        <feature.icon
                          className="h-6 w-6 flex-none text-green-400"
                          aria-hidden="true"
                        />
                        {feature.name}
                      </dt>
                      <dd className="mt-4 flex flex-auto flex-col text-gray-600 dark:text-white leading-7 text-gray-300">
                        <p className="flex-auto">{feature.description}</p>
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </div>
            </div>
          </motion.div>
          
        </main>
      </div>
    </>
  );
}