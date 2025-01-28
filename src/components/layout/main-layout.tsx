"use client";

import { useState, useCallback, useEffect } from "react";
import { Header } from "./header";
import { ProgramCard } from "../program-card";
import {
  PROGRAMS,
  type ProgramId,
  type RunnableProgram,
} from "@/lib/program-config";
import { useProgramStore } from "@/stores/program-store";

export const MainLayout = () => {
  const [showPrograms, setShowPrograms] = useState(false);
  const { activeProgram, runningPrograms, setActiveProgram } =
    useProgramStore();
  const activeConfig = activeProgram
    ? PROGRAMS.find((p) => p.id === activeProgram)
    : null;

  // Memoisiere die onRunningChange-Funktion
  const onRunningChange = useCallback(
    (isRunning: boolean) => {
      if (!activeConfig?.supportsRunning) return;
      console.log("DEBUG: MainLayout onRunningChange", {
        programId: activeConfig.id,
        isRunning,
        currentRunningPrograms: runningPrograms,
      });
      useProgramStore.getState().getRunningCallback(activeConfig.id)(isRunning);
    },
    [activeConfig?.id, activeConfig?.supportsRunning, runningPrograms]
  );

  // Initialer Running-State Check für alle Programme
  useEffect(() => {
    PROGRAMS.forEach((program) => {
      if (program.supportsRunning) {
        const runnableProgram = program as RunnableProgram;
        if (typeof runnableProgram.checkInitialRunning === "function") {
          console.log(
            "DEBUG: MainLayout initial running check for:",
            program.id
          );
          const isRunning = runnableProgram.checkInitialRunning();
          if (isRunning) {
            console.log(
              "DEBUG: MainLayout setting initial running state for:",
              program.id
            );
            useProgramStore.getState().getRunningCallback(program.id)(true);
          }
        }
      }
    });
  }, []); // Nur beim Mounting ausführen

  // Funktion zum Aktivieren eines Programms und Schließen der Programmauswahl
  const handleProgramActivation = useCallback(
    (programId: ProgramId) => {
      console.log("DEBUG: MainLayout handleProgramActivation", {
        programId,
        currentShowPrograms: showPrograms,
      });

      setShowPrograms(false);
      setActiveProgram(programId);
    },
    [setShowPrograms, setActiveProgram, showPrograms]
  );

  // Diese Funktion dem Header übergeben
  const handleHeaderProgramSelect = useCallback(
    (programId: ProgramId) => {
      handleProgramActivation(programId);
    },
    [handleProgramActivation]
  );

  const renderContent = () => {
    console.log("DEBUG: MainLayout renderContent", {
      activeProgram,
      showPrograms,
      activeConfig: activeConfig?.id,
    });

    // Wenn kein Programm aktiv ist und keine Programme angezeigt werden -> Willkommensseite
    if (!activeProgram && !showPrograms) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
          <div className="max-w-4xl w-full p-8">
            <div className="text-center space-y-4" role="status">
              <h2 className="text-2xl font-semibold text-foreground">
                Willkommen bei Time Tools
              </h2>
              <p className="text-muted-foreground">
                Wählen Sie ein Programm aus dem Menü aus, um zu beginnen
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Programme anzeigen
    if (showPrograms) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-start justify-center pt-16 pb-8">
            <div className="max-w-sm mx-auto w-full px-4">
              <div
                className="grid grid-cols-1 gap-4 mt-8"
                role="menu"
                aria-label="Programme"
              >
                {PROGRAMS.map((program) => (
                  <ProgramCard
                    key={program.id}
                    title={program.name}
                    description={program.description}
                    icon={program.icon}
                    isActive={program.id === activeProgram}
                    isRunning={runningPrograms.includes(program.id)}
                    onClick={() => {
                      handleProgramActivation(program.id);
                    }}
                    role="menuitem"
                    aria-current={program.id === activeProgram}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Aktives Programm anzeigen
    if (!activeConfig) return null;
    return activeConfig.supportsRunning ? (
      <activeConfig.component onRunningChange={onRunningChange} />
    ) : (
      <activeConfig.component />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Header
          onProgramsClick={() => setShowPrograms((prev) => !prev)}
          activePrograms={runningPrograms}
          onProgramSelect={handleHeaderProgramSelect}
        />
      </div>

      <main className="container mx-auto px-4 py-6" role="main">
        <div className="bg-card rounded-xl shadow-sm min-h-[calc(100vh-8rem)]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
