"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Clock, Timer as TimerIcon, Globe } from "lucide-react";
import { ProgramCard } from "../program-card";
import { Stopwatch } from "../stopwatch/stopwatch";
import { Timer } from "../timer/timer";
import { WorldClock } from "../world-clock/world-clock";
import { useProgramState } from "@/contexts/program-state";
import { PROGRAMS, type ProgramId } from "@/lib/program-config";
import { Header } from "./header";

interface Program {
  id: ProgramId;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const PROGRAM_ICONS = {
  stopwatch: <Clock className="w-6 h-6" />,
  timer: <TimerIcon className="w-6 h-6" />,
  worldclock: <Globe className="w-6 h-6" />,
} as const;

const PROGRAM_COMPONENTS = {
  stopwatch: <Stopwatch />,
  timer: <Timer />,
  worldclock: <WorldClock />,
} as const;

const programs: Program[] = PROGRAMS.map((program) => ({
  id: program.id as ProgramId,
  title: program.name,
  description: program.description,
  icon: PROGRAM_ICONS[program.id as ProgramId],
  component: PROGRAM_COMPONENTS[program.id as ProgramId],
}));

export function MainLayout() {
  const [showPrograms, setShowPrograms] = useState(false);
  const { state, activateProgramId } = useProgramState();
  const isInitialMount = useRef(true);

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const programId = hash.replace(/-/g, "") as ProgramId;
        if (programId !== state.activeProgram) {
          activateProgramId(programId);
          setShowPrograms(false);
        }
      }
    }

    if (isInitialMount.current) {
      handleHashChange();
      isInitialMount.current = false;
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [activateProgramId, state.activeProgram]);

  const isProgramRunning = useCallback(
    (programId: ProgramId) => {
      switch (programId) {
        case "timer":
          return state.timer.isRunning;
        case "stopwatch":
          return state.stopwatch.isRunning;
        default:
          return false;
      }
    },
    [state.timer.isRunning, state.stopwatch.isRunning]
  );

  const runningPrograms = useMemo(() => {
    const running: ProgramId[] = [];
    if (state.timer.isRunning) running.push("timer");
    if (state.stopwatch.isRunning) running.push("stopwatch");
    return running;
  }, [state.timer.isRunning, state.stopwatch.isRunning]);

  const handleProgramClick = useCallback(
    (programId: ProgramId) => {
      if (programId !== state.activeProgram) {
        activateProgramId(programId);
        requestAnimationFrame(() => {
          window.location.hash =
            programId === "worldclock" ? "world-clock" : programId;
        });
      }
      setShowPrograms(false);
    },
    [state.activeProgram, activateProgramId]
  );

  const activeComponent = useMemo(() => {
    if (!state.activeProgram) return null;
    const program = programs.find((p) => p.id === state.activeProgram);
    return program?.component || null;
  }, [state.activeProgram]);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Header
          onProgramsClick={() => setShowPrograms((prev) => !prev)}
          activePrograms={runningPrograms}
        />
      </div>

      <main className="container mx-auto px-4 py-6" role="main">
        <div className="bg-card rounded-xl shadow-sm min-h-[calc(100vh-8rem)]">
          {showPrograms ? (
            <div className="h-full flex flex-col">
              {/* Angepasster Bereich für tiefere Positionierung */}
              <div className="flex-1 flex items-start justify-center pt-16 pb-8">
                <div className="max-w-sm mx-auto w-full px-4">
                  <div
                    className="grid grid-cols-1 gap-4 mt-8"
                    role="menu"
                    aria-label="Programme"
                  >
                    {programs.map((program) => (
                      <ProgramCard
                        key={program.id}
                        title={program.title}
                        description={program.description}
                        icon={program.icon}
                        onClick={() => handleProgramClick(program.id)}
                        isActive={program.id === state.activeProgram}
                        isRunning={
                          program.id !== "worldclock" &&
                          isProgramRunning(program.id)
                        }
                        role="menuitem"
                        aria-current={program.id === state.activeProgram}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
              <div className="max-w-4xl w-full p-8">
                {activeComponent || (
                  <div className="text-center space-y-4" role="status">
                    <h2 className="text-2xl font-semibold text-foreground">
                      Willkommen bei Time Tools
                    </h2>
                    <p className="text-muted-foreground">
                      Wählen Sie ein Programm aus dem Menü aus, um zu beginnen
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
