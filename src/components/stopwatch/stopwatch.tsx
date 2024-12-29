"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayIcon, PauseIcon, RefreshCwIcon, FlagIcon } from "lucide-react"

interface Lap {
  number: number
  time: string
  duration: string
}

export function Stopwatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])

  const formatTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10)
      }, 10)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRunning])

  const toggleStopwatch = () => {
    setIsRunning(!isRunning)
  }

  const resetStopwatch = () => {
    setIsRunning(false)
    setTime(0)
    setLaps([])
  }

  const addLap = () => {
    const lapNumber = laps.length + 1
    const lapTime = formatTime(time)
    const previousLapTime = laps[0]?.time || "00:00.00"
    
    // Calculate lap duration
    const currentTimeMs = time
    const previousTimeMs = laps[0] 
      ? timeToMs(laps[0].time)
      : 0
    
    const duration = formatTime(currentTimeMs - previousTimeMs)

    setLaps([
      { number: lapNumber, time: lapTime, duration },
      ...laps,
    ])
  }

  const timeToMs = (timeStr: string) => {
    const [minutesSeconds, centiseconds] = timeStr.split(".")
    const [minutes, seconds] = minutesSeconds.split(":")
    return (
      parseInt(minutes) * 60000 +
      parseInt(seconds) * 1000 +
      parseInt(centiseconds) * 10
    )
  }

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Stopwatch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-mono text-center py-8">
            {formatTime(time)}
          </div>
        </CardContent>
        <CardFooter className="justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleStopwatch}
          >
            {isRunning ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={addLap}
            disabled={!isRunning && time === 0}
          >
            <FlagIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={resetStopwatch}
          >
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {laps.length > 0 && (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Laps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {laps.map((lap) => (
                <div
                  key={lap.number}
                  className="flex justify-between items-center text-sm font-mono"
                >
                  <span>Lap {lap.number}</span>
                  <span>{lap.duration}</span>
                  <span>{lap.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
