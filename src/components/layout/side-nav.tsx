"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ClockIcon, TimerIcon, Timer } from "lucide-react"

const navItems = [
  {
    title: "Timer",
    href: "/timer",
    icon: TimerIcon
  },
  {
    title: "World Clock",
    href: "/world-clock",
    icon: ClockIcon
  },
  {
    title: "Stopwatch",
    href: "/stopwatch",
    icon: Timer // Wir verwenden Timer als Stopwatch-Icon, da es ähnlich aussieht
  }
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Time Tools</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
                isActive && "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
