import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface StopwatchState {
  time: number;
  isRunning: boolean;
  onRunningChange?: (isRunning: boolean) => void;
}

interface StopwatchActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  setOnRunningChange: (callback?: (isRunning: boolean) => void) => void;
}

type StopwatchStore = StopwatchState & StopwatchActions;

export const useStopwatchStore = create<StopwatchStore>()(
  subscribeWithSelector((set, get) => ({
    time: 0,
    isRunning: false,
    onRunningChange: undefined,
    start: () => {
      set({ isRunning: true });
      get().onRunningChange?.(true);
    },
    pause: () => {
      set({ isRunning: false });
      get().onRunningChange?.(false);
    },
    reset: () => {
      set({ time: 0, isRunning: false });
      get().onRunningChange?.(false);
    },
    tick: () =>
      set((state) => ({
        time: state.time + 1,
      })),
    setOnRunningChange: (callback) => set({ onRunningChange: callback }),
  }))
);

// Stoppuhr-Tick-Logik (10ms für Hundertstelsekunden)
let intervalId: NodeJS.Timeout | undefined;

useStopwatchStore.subscribe(
  (state) => state.isRunning,
  (isRunning) => {
    if (isRunning) {
      intervalId = setInterval(() => {
        useStopwatchStore.getState().tick();
      }, 10);
    } else if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }
);
