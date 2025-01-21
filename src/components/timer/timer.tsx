"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatTimer } from "@/lib/utils";
import { useProgramState } from "@/contexts/program-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";
import {
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
} from "lucide-react";

interface TimePreset {
  minutes: number;
  seconds: number;
  label: string;
  icon: React.ReactNode;
}

interface QuickAdjust {
  seconds: number;
  label: string;
  icon: React.ReactNode;
}

const TIME_PRESETS: TimePreset[] = [
  {
    minutes: 0,
    seconds: 30,
    label: "30 Sek.",
    icon: <TimerIcon className="h-4 w-4" />,
  },
  {
    minutes: 1,
    seconds: 0,
    label: "1 Min.",
    icon: <TimerIcon className="h-4 w-4" />,
  },
  {
    minutes: 2,
    seconds: 0,
    label: "2 Min.",
    icon: <TimerIcon className="h-4 w-4" />,
  },
  {
    minutes: 5,
    seconds: 0,
    label: "5 Min.",
    icon: <TimerIcon className="h-4 w-4" />,
  },
  {
    minutes: 10,
    seconds: 0,
    label: "10 Min.",
    icon: <TimerIcon className="h-4 w-4" />,
  },
  {
    minutes: 15,
    seconds: 0,
    label: "15 Min.",
    icon: <TimerIcon className="h-4 w-4" />,
  },
];

const QUICK_ADJUST: QuickAdjust[] = [
  { seconds: -1, label: "0:01", icon: <Minus className="h-4 w-4" /> },
  { seconds: -10, label: "0:10", icon: <Minus className="h-4 w-4" /> },
  { seconds: -30, label: "0:30", icon: <Minus className="h-4 w-4" /> },
  { seconds: -60, label: "1:00", icon: <Minus className="h-4 w-4" /> },
  { seconds: 1, label: "0:01", icon: <Plus className="h-4 w-4" /> },
  { seconds: 10, label: "0:10", icon: <Plus className="h-4 w-4" /> },
  { seconds: 30, label: "0:30", icon: <Plus className="h-4 w-4" /> },
  { seconds: 60, label: "1:00", icon: <Plus className="h-4 w-4" /> },
];

export function Timer() {
  const { state, startTimer, pauseTimer, resetTimer, setTimer } =
    useProgramState();
  const { time, isRunning } = state.timer;

  function adjustTime(seconds: number) {
    if (!isRunning) {
      const newTime = Math.max(0, time + seconds);
      setTimer(newTime);
    }
  }

  function setPresetTime(minutes: number, seconds: number) {
    if (!isRunning) {
      const newTime = minutes * 60 + seconds;
      setTimer(newTime);
    }
  }

  function handleStartTimer() {
    if (!isRunning && time > 0) {
      startTimer();
    }
  }

  const formattedTime = formatTimer(time);
  const isTimerEmpty = time === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TimerIcon className="h-6 w-6" aria-hidden="true" />
          Timer
          {isRunning && (
            <Badge variant="secondary" className="ml-auto text-xs">
              Läuft
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6" role="timer" aria-live="polite">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <div
                className="text-center font-mono text-5xl tabular-nums text-primary"
                aria-label={`Verbleibende Zeit: ${formattedTime}`}
              >
                {formattedTime}
              </div>
            </CardContent>
          </Card>

          {!isRunning && (
            <ScrollArea className="h-[16rem] px-1">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                    Voreinstellungen
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIME_PRESETS.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() =>
                          setPresetTime(preset.minutes, preset.seconds)
                        }
                        aria-label={`Timer auf ${preset.label} setzen`}
                        className="flex items-center gap-2"
                      >
                        {preset.icon}
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {time > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                      Zeit anpassen
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {QUICK_ADJUST.map((adjust, index) => (
                        <Button
                          key={index}
                          variant={
                            adjust.seconds < 0 ? "destructive" : "secondary"
                          }
                          size="sm"
                          onClick={() => adjustTime(adjust.seconds)}
                          className="flex items-center gap-2"
                          aria-label={`Zeit ${
                            adjust.seconds < 0 ? "reduzieren" : "erhöhen"
                          } um ${adjust.label}`}
                        >
                          {adjust.icon}
                          {adjust.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <Button
                onClick={handleStartTimer}
                disabled={isTimerEmpty}
                size="lg"
                className="w-32 flex items-center gap-2"
                aria-label="Timer starten"
              >
                <Play className="h-4 w-4" />
                Start
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                variant="secondary"
                size="lg"
                className="w-32 flex items-center gap-2"
                aria-label="Timer pausieren"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            )}
            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="w-32 flex items-center gap-2"
              aria-label="Timer zurücksetzen"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
