"use client"
import * as React from "react"
import { useTheme } from "next-themes"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  return (

    <RadioGroup defaultValue={theme}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem onClick={() => setTheme("system")} value="system" id="r1" />
        <Label htmlFor="r1">System</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem onClick={() => setTheme("dark")} value="dark" id="r2" />
        <Label htmlFor="r2">Dark</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem onClick={() => setTheme("light")} value="light" id="r3" />
        <Label htmlFor="r3">Light</Label>
      </div>
    </RadioGroup>
  )
}