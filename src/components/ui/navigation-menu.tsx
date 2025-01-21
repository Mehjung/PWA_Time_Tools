"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NavigationMenuProps {
  children: React.ReactNode
}

export function NavigationMenu({ children }: NavigationMenuProps) {
  return (
    <nav className="relative">{children}</nav>
  )
}

export function NavigationMenuList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex gap-4 items-center">{children}</ul>
  )
}

export function NavigationMenuItem({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>
}

export function NavigationMenuTrigger({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 group">
      {children}
      <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
    </button>
  )
}

export function NavigationMenuContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-0 top-full w-full">
      <div className="relative mt-1.5 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
        {children}
      </div>
    </div>
  )
}
