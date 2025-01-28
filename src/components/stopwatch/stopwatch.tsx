"use client";

import { type FC, useEffect, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { formatTimer } from "@/lib/utils";
import { useStopwatchStore } from "@/stores/stopwatch-store";

// ========================= Time Display Component =========================
const TimeDisplay = memo(() => {
  const time = useStopwatchStore((state) => state.time);
  const formattedTime = formatTimer(time);

  return (
    <div
      className="text-center font-mono text-5xl tabular-nums text-primary"
      aria-label={`Verstrichene Zeit: ${formattedTime}`}
    >
      {formattedTime}
    </div>
  );
});
TimeDisplay.displayName = "TimeDisplay";

// ========================= Start/Pause Button Component =========================
const StartPauseButton = memo(() => {
  const isRunning = useStopwatchStore((state) => state.isRunning);
  const start = useStopwatchStore((state) => state.start);
  const pause = useStopwatchStore((state) => state.pause);

  return !isRunning ? (
    <Button variant="outline" size="lg" className="w-24" onClick={start}>
      <Play className="mr-2 h-4 w-4" />
      Start
    </Button>
  ) : (
    <Button variant="outline" size="lg" className="w-24" onClick={pause}>
      <Pause className="mr-2 h-4 w-4" />
      Pause
    </Button>
  );
});
StartPauseButton.displayName = "StartPauseButton";

// ========================= Reset Button Component =========================
const ResetButton = memo(() => {
  const reset = useStopwatchStore((state) => state.reset);
  const isDisabled = useStopwatchStore((state) => state.time === 0);

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-24"
      onClick={reset}
      disabled={isDisabled}
    >
      <RotateCcw className="mr-2 h-4 w-4" />
      Reset
    </Button>
  );
});
ResetButton.displayName = "ResetButton";

// ========================= Control Buttons Container =========================
const ControlButtons = memo(() => {
  return (
    <div className="flex justify-center gap-2">
      <StartPauseButton />
      <ResetButton />
    </div>
  );
});
ControlButtons.displayName = "ControlButtons";

interface StopwatchProps {
  onRunningChange: (isRunning: boolean) => void;
}

// ========================= Main Stopwatch Component =========================
const StopwatchComponent: FC<StopwatchProps> = ({ onRunningChange }) => {
  const isRunning = useStopwatchStore((state) => state.isRunning);

  useEffect(() => {
    onRunningChange(isRunning);
  }, [isRunning, onRunningChange]);

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <TimeDisplay />
            </CardContent>
          </Card>
          <ControlButtons />
        </div>
      </CardContent>
    </Card>
  );
};

// Export the memoized StopwatchComponent as Stopwatch
export const Stopwatch = memo(StopwatchComponent);
Stopwatch.displayName = "Stopwatch";
