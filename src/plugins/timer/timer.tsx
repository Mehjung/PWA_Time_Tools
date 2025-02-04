"use client";

import { type FC, useEffect, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer as TimerIcon } from "lucide-react";
import { formatTimer } from "@/lib/utils";
import { useTimerStore } from "./timer-store";
import { PluginProps } from "@/components/hoc/with-plugin-ref";

// ========================= Time Presets =========================
const TIME_PRESETS = [
  { minutes: 5, seconds: 0 },
  { minutes: 10, seconds: 0 },
  { minutes: 15, seconds: 0 },
  { minutes: 25, seconds: 0 },
];

const QUICK_ADJUST = [
  { minutes: 1, seconds: 0 },
  { minutes: 0, seconds: 30 },
];

// ========================= Time Display Component =========================
const TimeDisplay = memo(() => {
  const time = useTimerStore((state) => state.time);
  const formattedTime = formatTimer(time);

  return (
    <div
      className="text-center font-mono text-5xl tabular-nums text-primary"
      aria-label={`Verbleibende Zeit: ${formattedTime}`}
    >
      {formattedTime}
    </div>
  );
});
TimeDisplay.displayName = "TimeDisplay";

// ========================= Preset Buttons Component =========================
const PresetButton = memo(
  ({ minutes, seconds }: { minutes: number; seconds: number }) => {
    const setTime = useTimerStore((state) => state.setTime);
    const totalSeconds = minutes * 60 + seconds;

    return (
      <Button
        variant="outline"
        onClick={() => setTime(totalSeconds)}
        aria-label={`Timer auf ${minutes} Minuten${
          seconds ? ` und ${seconds} Sekunden` : ""
        } setzen`}
      >
        {minutes}:{seconds.toString().padStart(2, "0")}
      </Button>
    );
  }
);
PresetButton.displayName = "PresetButton";

const PresetButtons = memo(() => {
  return (
    <div className="flex flex-wrap gap-2">
      {TIME_PRESETS.map(({ minutes, seconds }) => (
        <PresetButton
          key={`${minutes}:${seconds}`}
          minutes={minutes}
          seconds={seconds}
        />
      ))}
    </div>
  );
});
PresetButtons.displayName = "PresetButtons";

// ========================= Quick Adjust Button Component =========================
const QuickAdjustButton = memo(
  ({ minutes, seconds }: { minutes: number; seconds: number }) => {
    const adjustTime = useTimerStore((state) => state.adjustTime);
    const totalSeconds = minutes * 60 + seconds;

    return (
      <Button
        variant="outline"
        onClick={() => adjustTime(totalSeconds)}
        aria-label={`${minutes} Minuten${
          seconds ? ` und ${seconds} Sekunden` : ""
        } hinzufügen`}
      >
        +{minutes}:{seconds.toString().padStart(2, "0")}
      </Button>
    );
  }
);
QuickAdjustButton.displayName = "QuickAdjustButton";

const QuickAdjustButtons = memo(() => {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_ADJUST.map(({ minutes, seconds }) => (
        <QuickAdjustButton
          key={`${minutes}:${seconds}`}
          minutes={minutes}
          seconds={seconds}
        />
      ))}
    </div>
  );
});
QuickAdjustButtons.displayName = "QuickAdjustButtons";

// ========================= Start/Pause Button Component =========================
const StartPauseButton = memo(() => {
  const isRunning = useTimerStore((state) => state.isRunning);
  const isDisabled = useTimerStore((state) => state.time === 0);
  const start = useTimerStore((state) => state.start);
  const pause = useTimerStore((state) => state.pause);

  return !isRunning ? (
    <Button
      variant="outline"
      size="lg"
      className="w-24"
      onClick={start}
      disabled={isDisabled}
    >
      <TimerIcon className="mr-2 h-4 w-4" />
      Start
    </Button>
  ) : (
    <Button variant="outline" size="lg" className="w-24" onClick={pause}>
      <TimerIcon className="mr-2 h-4 w-4" />
      Pause
    </Button>
  );
});
StartPauseButton.displayName = "StartPauseButton";

// ========================= Reset Button Component =========================
const ResetButton = memo(() => {
  const reset = useTimerStore((state) => state.reset);
  const isDisabled = useTimerStore((state) => state.time === 0);

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-24"
      onClick={reset}
      disabled={isDisabled}
    >
      <TimerIcon className="mr-2 h-4 w-4" />
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

// ========================= Main Timer Component =========================
const TimerComponent: FC<PluginProps> = ({ running }) => {
  const isRunning = useTimerStore((state) => state.isRunning);
  const [, setRunning] = running;

  useEffect(() => {
    setRunning(isRunning);
  }, [isRunning, setRunning]);

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <TimeDisplay />
            </CardContent>
          </Card>
          <PresetButtons />
          <QuickAdjustButtons />
          <ControlButtons />
        </div>
      </CardContent>
    </Card>
  );
};

// Export the memoized TimerComponent as Timer
export const Timer = memo(TimerComponent);
Timer.displayName = "Timer";
