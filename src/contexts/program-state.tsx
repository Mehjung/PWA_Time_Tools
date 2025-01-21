"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { type ProgramId } from "@/lib/program-config";
import { useToast } from "@/hooks/use-toast";
import { formatTimer } from "@/lib/utils";

interface TimerState {
  isRunning: boolean;
  time: number;
  initialTime: number;
}

interface StopwatchState {
  isRunning: boolean;
  time: number;
}

interface ProgramState {
  activeProgram: ProgramId | null;
  stopwatch: StopwatchState;
  timer: TimerState;
}

type TimerAction =
  | { type: "START_TIMER" }
  | { type: "PAUSE_TIMER" }
  | { type: "RESET_TIMER" }
  | { type: "SET_TIMER"; payload: number }
  | { type: "TICK_TIMER" };

type StopwatchAction =
  | { type: "START_STOPWATCH" }
  | { type: "PAUSE_STOPWATCH" }
  | { type: "RESET_STOPWATCH" }
  | { type: "TICK_STOPWATCH" };

type NavigationAction = { type: "ACTIVATE_PROGRAM_ID"; id: ProgramId };

type Action = TimerAction | StopwatchAction | NavigationAction;

const initialState: ProgramState = {
  activeProgram: null,
  stopwatch: {
    isRunning: false,
    time: 0,
  },
  timer: {
    isRunning: false,
    time: 0,
    initialTime: 0,
  },
};

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "START_TIMER":
      return { ...state, isRunning: true };
    case "PAUSE_TIMER":
      return { ...state, isRunning: false };
    case "RESET_TIMER":
      return { time: 0, isRunning: false, initialTime: 0 };
    case "SET_TIMER":
      return { ...state, time: action.payload, initialTime: action.payload };
    case "TICK_TIMER":
      if (state.time <= 0) {
        return { isRunning: false, time: 0, initialTime: state.initialTime };
      }
      return { ...state, time: state.time - 1 };
    default:
      return state;
  }
}

function stopwatchReducer(
  state: StopwatchState,
  action: StopwatchAction
): StopwatchState {
  switch (action.type) {
    case "START_STOPWATCH":
      return { ...state, isRunning: true };
    case "PAUSE_STOPWATCH":
      return { ...state, isRunning: false };
    case "RESET_STOPWATCH":
      return { time: 0, isRunning: false };
    case "TICK_STOPWATCH":
      return { ...state, time: state.time + 1 };
    default:
      return state;
  }
}

function programReducer(state: ProgramState, action: Action): ProgramState {
  switch (action.type) {
    case "START_TIMER":
    case "PAUSE_TIMER":
    case "RESET_TIMER":
    case "SET_TIMER":
    case "TICK_TIMER":
      return { ...state, timer: timerReducer(state.timer, action) };
    case "START_STOPWATCH":
    case "PAUSE_STOPWATCH":
    case "RESET_STOPWATCH":
    case "TICK_STOPWATCH":
      return { ...state, stopwatch: stopwatchReducer(state.stopwatch, action) };
    case "ACTIVATE_PROGRAM_ID":
      return { ...state, activeProgram: action.id };
    default:
      return state;
  }
}

interface ProgramStateContextType {
  state: ProgramState;
  dispatch: React.Dispatch<Action>;
  activateProgramId: (id: ProgramId) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimer: (time: number) => void;
  startStopwatch: () => void;
  pauseStopwatch: () => void;
  resetStopwatch: () => void;
}

const ProgramStateContext = createContext<ProgramStateContextType | null>(null);

const TIMER_INTERVAL = 1000; // 1 second
const STOPWATCH_INTERVAL = 10; // 10 milliseconds

export function ProgramStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(programReducer, initialState);
  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    if (!state.timer.isRunning || state.timer.time <= 0) {
      // Timer ist abgelaufen
      if (state.timer.isRunning && state.timer.time <= 0) {
        toast({
          title: "Timer abgelaufen!",
          description: `Der Timer für ${formatTimer(
            state.timer.initialTime
          )} ist abgelaufen.`,
          variant: "default",
          duration: 5000,
        });
      }
      return;
    }

    const interval = setInterval(() => {
      dispatch({ type: "TICK_TIMER" });
    }, TIMER_INTERVAL);

    return () => clearInterval(interval);
  }, [state.timer.isRunning, state.timer.time, state.timer.initialTime, toast]);

  // Stopwatch effect
  useEffect(() => {
    if (!state.stopwatch.isRunning) return;

    const interval = setInterval(() => {
      dispatch({ type: "TICK_STOPWATCH" });
    }, STOPWATCH_INTERVAL);

    return () => clearInterval(interval);
  }, [state.stopwatch.isRunning]);

  // Action creators
  function activateProgramId(id: ProgramId) {
    dispatch({ type: "ACTIVATE_PROGRAM_ID", id });
  }

  function startTimer() {
    dispatch({ type: "START_TIMER" });
  }

  function pauseTimer() {
    dispatch({ type: "PAUSE_TIMER" });
  }

  function resetTimer() {
    dispatch({ type: "RESET_TIMER" });
  }

  function setTimer(time: number) {
    dispatch({ type: "SET_TIMER", payload: time });
  }

  function startStopwatch() {
    dispatch({ type: "START_STOPWATCH" });
  }

  function pauseStopwatch() {
    dispatch({ type: "PAUSE_STOPWATCH" });
  }

  function resetStopwatch() {
    dispatch({ type: "RESET_STOPWATCH" });
  }

  const contextValue = {
    state,
    dispatch,
    activateProgramId,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimer,
    startStopwatch,
    pauseStopwatch,
    resetStopwatch,
  };

  return (
    <ProgramStateContext.Provider value={contextValue}>
      {children}
    </ProgramStateContext.Provider>
  );
}

export function useProgramState(): ProgramStateContextType {
  const context = useContext(ProgramStateContext);
  if (!context) {
    throw new Error(
      "useProgramState muss innerhalb eines ProgramStateProvider verwendet werden"
    );
  }
  return context;
}
