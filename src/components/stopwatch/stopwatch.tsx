"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgramState } from "@/contexts/program-state";
import { formatStopwatch } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";

export function Stopwatch() {
  const { state, startStopwatch, pauseStopwatch, resetStopwatch } =
    useProgramState();

  const { isRunning, time } = state.stopwatch;
  const formattedTime = formatStopwatch(time);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-6 w-6" aria-hidden="true" />
          Stoppuhr
          {isRunning && (
            <Badge variant="secondary" className="ml-auto text-xs">
              Läuft
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <div
                className="text-center font-mono text-5xl tabular-nums text-primary"
                role="timer"
                aria-live="polite"
              >
                {formattedTime}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <Button
                onClick={startStopwatch}
                size="lg"
                className="w-32 flex items-center gap-2"
                aria-label="Stoppuhr starten"
              >
                <Play className="h-4 w-4" />
                Start
              </Button>
            ) : (
              <Button
                onClick={pauseStopwatch}
                variant="secondary"
                size="lg"
                className="w-32 flex items-center gap-2"
                aria-label="Stoppuhr pausieren"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            )}
            <Button
              onClick={resetStopwatch}
              variant="outline"
              size="lg"
              className="w-32 flex items-center gap-2"
              aria-label="Stoppuhr zurücksetzen"
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
