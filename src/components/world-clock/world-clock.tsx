"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClockIcon } from "lucide-react"

const timeZones = [
  { name: "Local Time", zone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  { name: "New York", zone: "America/New_York" },
  { name: "London", zone: "Europe/London" },
  { name: "Paris", zone: "Europe/Paris" },
  { name: "Tokyo", zone: "Asia/Tokyo" },
  { name: "Sydney", zone: "Australia/Sydney" },
]

export function WorldClock() {
  const [times, setTimes] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: { [key: string]: string } = {}
      const now = new Date()

      timeZones.forEach(({ zone }) => {
        newTimes[zone] = new Intl.DateTimeFormat("en-US", {
          timeZone: zone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now)
      })

      setTimes(newTimes)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {timeZones.map(({ name, zone }) => (
        <Card key={zone}>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <ClockIcon className="h-6 w-6 text-gray-500" />
            <div>
              <CardTitle className="text-xl">{name}</CardTitle>
              <p className="text-sm text-gray-500">{zone}</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono">{times[zone] || "--:--:--"}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
