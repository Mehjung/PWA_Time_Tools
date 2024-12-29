import { Stopwatch } from "@/components/stopwatch/stopwatch"

export default function StopwatchPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Stopwatch</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track elapsed time with precision and record laps
        </p>
      </div>
      <Stopwatch />
    </div>
  )
}
