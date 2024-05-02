"use client";
import { Metadata } from "next"
import Image from "next/image"
import React, { useState, useEffect } from 'react';

import { Button } from "../../components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs"
import { CalendarDateRangePicker } from "../../components/date-range-picker"
import { MainNav } from "../../components/main-nav"
import { Overview } from "../../components/overview"
import { RecentSales } from "../../components/recent-sales"
import { Search } from "../../components/search"
import TeamSwitcher from "../../components/team-switcher"
import { UserNav } from "../../components/user-nav"
import mainLogo from "../../public/split-mate-logo.svg";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import Head from 'next/head'


export default function LandingPage() {
    const [startPositions, setStartPositions] = useState([]);
    const [animationDone, setAnimationDone] = useState(false); // New state to track if animation is done

    useEffect(() => {
        const positions = new Array(4).fill(null).map(() => ({
            top: `${Math.random() * 50 + 25}vh`,
            left: `${Math.random() * 50 + 25}vw`,
        }));
        setStartPositions(positions);

        const timeoutId = setTimeout(() => {
            setStartPositions(new Array(4).fill({ top: '50vh', left: '50vw' }));
        }, 1000); // Start the animation

        // Set another timeout for when the animation is supposed to end
        // Here assuming the transition takes 3s as defined in the style
        const finishTimeoutId = setTimeout(() => {
            setAnimationDone(true); // Set animation done to true
        }, 4000); // 1s delay + 3s animation duration

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(finishTimeoutId);
        };
    }, []);

    return (
        <>
            <Head>
                <title>Placeholder Title</title>
            </Head>

            <div className="min-h-screen">
                <main>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div style={{ position: 'relative', height: '100vh', width: '100vw', transition: 'opacity 2s ease-in-out' }}>
                            {!animationDone ? (
                                startPositions.map((pos, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            position: 'absolute',
                                            width: '300px', // Adjust based on your image size
                                            height: '480px', // Adjust based on your image size
                                            transition: 'all 3s ease-in-out',
                                            top: pos.top,
                                            left: pos.left,
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    >
                                        <img src={`/jigsaw/piece-${index + 1}.png`} alt={`Piece ${index + 1}`} style={{ width: '100%', height: '100%' }} />
                                    </div>
                                ))
                            ) : (
                                // This div will fade in after the animation is done
                                <div style={{
                                    position: 'absolute',
                                    width: '300px', // Match the size of the animated images
                                    height: '480px', // Match the size of the animated images
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    opacity: 100, // Start fully transparent
                                    backgroundColor: 'red', // Placeholder background color
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    transition: 'opacity 2s ease-in-out',
                                }}>
                                    <h1 style={{ textAlign: 'center' }}>Animation Complete</h1>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}