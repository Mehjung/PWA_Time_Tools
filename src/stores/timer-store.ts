// timer-store.ts
import { create } from "zustand";

// 1) Definiere ein Interface / Typen für deinen Timer-Store.
export interface TimerState {
  isRunning: boolean;
  time: number;
  lastTick: number | null;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setTime: (seconds: number) => void;
  adjustTime: (delta: number) => void;
}

// 2) Erstelle den Zustand via create<TimerState>(...), und implementiere die Logik.
export const useTimerStore = create<TimerState>((set, get) => {
  let frameId: number | null = null;

  const tick = (timestamp: number) => {
    const state = get();
    if (!state.isRunning || state.time <= 0) {
      console.log("Timer stopped:", {
        time: state.time,
        isRunning: state.isRunning,
      });
      frameId = null;
      set({ isRunning: false });
      return;
    }

    if (state.lastTick === null) {
      set({ lastTick: timestamp });
      frameId = requestAnimationFrame(tick);
      return;
    }

    const delta = timestamp - state.lastTick;
    if (delta >= 1000) {
      console.log("Timer tick:", { currentTime: state.time - 1 });
      set({
        time: state.time - 1,
        lastTick: timestamp,
      });
    }

    frameId = requestAnimationFrame(tick);
  };

  return {
    isRunning: false,
    time: 0,
    lastTick: null,

    // Start: Setze isRunning auf true (bzw. deine Timer-Logik)
    start: () => {
      const { time, isRunning } = get();
      console.log("Starting timer:", { time, isRunning });
      if (time > 0 && !isRunning && !frameId) {
        set({ isRunning: true, lastTick: null });
        frameId = requestAnimationFrame(tick);
      }
    },

    // Pause: Setze isRunning auf false
    pause: () => {
      console.log("Pausing timer");
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      set({ isRunning: false, lastTick: null });
    },

    // Reset: Setze isRunning auf false und Zeit auf 0
    reset: () => {
      console.log("Resetting timer");
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      set({ isRunning: false, time: 0, lastTick: null });
    },

    // setTime: Zeit manuell setzen (z. B. wenn Preset-Buttons geklickt werden)
    setTime: (seconds: number) => {
      console.log("Setting time:", seconds);
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      set({ time: seconds, isRunning: false, lastTick: null });
    },

    // adjustTime: Zeit anpassen (z. B. +30 Sek)
    adjustTime: (delta: number) => {
      const { time } = get();
      const newTime = Math.max(time + delta, 0);
      console.log("Adjusting time:", { delta, newTime });
      set({ time: newTime });
    },
  };
});
