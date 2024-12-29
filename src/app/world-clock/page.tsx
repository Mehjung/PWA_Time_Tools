import { WorldClock } from "@/components/world-clock/world-clock"

export default function WorldClockPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">World Clock</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Keep track of time across different time zones
        </p>
      </div>
      <WorldClock />
    </div>
  )
}
