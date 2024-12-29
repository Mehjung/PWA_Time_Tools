import { Timer } from "@/components/timer/timer"

export default function TimerPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Timer</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Set and manage your timers to stay focused and productive
        </p>
      </div>
      <Timer />
    </div>
  )
}
