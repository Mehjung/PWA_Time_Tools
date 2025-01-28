"use client";

import Fuse from "fuse.js";
import { Globe, ListTodo } from "lucide-react";
import { Timer as TimerIcon, StopCircle as StopwatchIcon } from "lucide-react";
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { Timer } from "@/components/timer/timer";
import { Stopwatch } from "@/components/stopwatch/stopwatch";
import WorldClock from "@/components/world-clock/world-clock";
import { Todo, checkInitialRunning } from "@/components/todo/todo";

interface BaseProgram {
  id: string;
  name: string;
  description: string;
  path: string;
  keywords: readonly string[];
  icon: LucideIcon;
}

export interface RunnableProgram extends BaseProgram {
  supportsRunning: true;
  component: ComponentType<{ onRunningChange: (isRunning: boolean) => void }>;
  checkInitialRunning?: () => boolean;
}

interface StaticProgram extends BaseProgram {
  supportsRunning: false;
  component: ComponentType<Record<string, never>>;
}

export type Program = RunnableProgram | StaticProgram;

// Die Programme als Konstante definieren
const PROGRAM_CONFIGS = [
  {
    id: "worldclock" as const,
    name: "Weltzeituhr",
    description: "Zeitzonen im Überblick",
    path: "#world-clock",
    keywords: ["weltzeit", "uhr", "zeitzonen", "global"] as const,
    icon: Globe,
    component: WorldClock,
    supportsRunning: false as const,
  },
  {
    id: "timer" as const,
    name: "Timer",
    description: "Ein einfacher Timer zum Herunterzählen",
    path: "#timer",
    keywords: ["timer", "countdown", "alarm", "zeit"] as const,
    icon: TimerIcon,
    component: Timer,
    supportsRunning: true as const,
  },
  {
    id: "stopwatch" as const,
    name: "Stoppuhr",
    description: "Eine Stoppuhr zum Zeitmessen",
    path: "#stopwatch",
    keywords: ["stoppuhr", "zeit", "messen", "runden"] as const,
    icon: StopwatchIcon,
    component: Stopwatch,
    supportsRunning: true as const,
  },
  {
    id: "todo" as const,
    name: "Todo",
    description: "Eine einfache Todo-Liste",
    path: "#todo",
    keywords: [
      "todo",
      "aufgaben",
      "liste",
      "organisation",
      "planen",
      "notizen",
    ] as const,
    icon: ListTodo,
    component: Todo,
    supportsRunning: true as const,
    checkInitialRunning,
  },
] as const;

// Typ für ein einzelnes Programm aus dem Array
export type ProgramConfig = (typeof PROGRAM_CONFIGS)[number];

// Export der Programme mit korrektem Typ
export const PROGRAMS: readonly ProgramConfig[] = PROGRAM_CONFIGS;

// ProgramId aus dem Array ableiten
export type ProgramId = ProgramConfig["id"];

// Fuse.js Instanz für Fuzzy-Suche
const fuse = new Fuse(PROGRAMS, {
  keys: [
    { name: "id", weight: 2 }, // ID soll hoch gewichtet sein
    { name: "name", weight: 2 }, // Name ebenfalls hoch gewichtet
    { name: "keywords", weight: 1 },
    { name: "description", weight: 0.5 },
  ],
  threshold: 0.3, // eher streng, damit Ergebnisse genauer sind
  distance: 100,
  location: 0, // bevorzugt Matches am Wortanfang
  ignoreLocation: false, // Wortanfang wird stärker gewichtet
  includeScore: true,
  minMatchCharLength: 1, // Mindestens 1 Zeichen für Fuzzy
});

/**
 * Kombinierte Suche:
 * 1) Prefix-Matching (höchste Priorität)
 * 2) Fuzzy-Matching über Fuse (ergänzend)
 * 3) Zusammenführen & Duplikate entfernen
 */
export function searchPrograms(query: string): ProgramConfig[] {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) {
    return [];
  }

  // 1) Prefix-Matches (id, name oder keyword beginnt mit query)
  const prefixMatches = PROGRAMS.filter(
    (program) =>
      program.id.toLowerCase().startsWith(searchTerm) ||
      program.name.toLowerCase().startsWith(searchTerm) ||
      program.keywords.some((k) => k.toLowerCase().startsWith(searchTerm))
  );

  // 2) Fuzzy-Suche
  // Wir lassen Fuse sortieren und liefern es dann in Reihenfolge zurück
  const fuseResults = fuse.search(searchTerm);
  const fuzzyMatches = fuseResults.map((r) => r.item);

  // 3) Zusammenführen: Prefix-Ergebnisse zuerst, dann Fuzzy
  //    Per Set Duplikate entfernen (Set behält Reihenfolge des ersten Auftretens)
  const combined = [...prefixMatches, ...fuzzyMatches];
  const unique = Array.from(new Set(combined));

  return unique;
}
