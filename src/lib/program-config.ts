"use client";

import { Globe, StopCircle, Timer as TimerIcon, ListTodo } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import { Stopwatch } from "@/plugins/stopwatch/stopwatch";
import { Timer } from "@/plugins/timer/timer";
import { Todo, onPluginPreMount } from "@/plugins/todo/todo";
import { WorldClock } from "@/plugins/worldclock/worldclock";
import type { PluginProps } from "@/components/hoc/with-plugin-ref";
// Basis Plugin-Typ
export interface PluginConfig<P = PluginProps> {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  keywords: string[];
  component: ComponentType<P>;
  persistent?: boolean;
  onPluginPreMount?: () => boolean;
}

// Plugin-Konfigurationen
export const PLUGINS: PluginConfig[] = [
  {
    id: "worldclock",
    name: "Weltzeituhr",
    description: "Zeitzonen im Überblick",
    icon: Globe,
    keywords: ["weltzeit", "uhr", "zeitzonen", "global"],
    component: WorldClock,
    persistent: false,
  },
  {
    id: "stopwatch",
    name: "Stoppuhr",
    description: "Eine Stoppuhr zum Zeitmessen",
    icon: StopCircle,
    keywords: ["stoppuhr", "zeit", "messen", "runden"],
    component: Stopwatch,
    persistent: true,
  },
  {
    id: "timer",
    name: "Timer",
    description: "Ein einfacher Timer zum Herunterzählen",
    icon: TimerIcon,
    keywords: ["timer", "countdown", "alarm", "zeit"],
    component: Timer,
    persistent: true,
  },
  {
    id: "todo",
    name: "Todo",
    description: "Eine einfache Todo-Liste",
    icon: ListTodo,
    keywords: [
      "todo",
      "aufgaben",
      "liste",
      "organisation",
      "planen",
      "notizen",
    ],
    component: Todo,
    persistent: true,
    onPluginPreMount: onPluginPreMount,
  },
];

// Plugin-IDs
export type PluginId = (typeof PLUGINS)[number]["id"];

// Plugin-Suche mit Fuse.js
import Fuse from "fuse.js";

const fuseOptions = {
  keys: ["name", "description", "keywords"],
  threshold: 0.3,
  distance: 100,
};

const fuse = new Fuse(PLUGINS, fuseOptions);

export function searchPlugins(query: string): PluginConfig[] {
  if (!query.trim()) return [];
  return fuse.search(query).map((result) => result.item);
}

// Plugin-Hilfsfunktionen
export function findPluginById(id: string): PluginConfig | undefined {
  return PLUGINS.find((plugin) => plugin.id === id);
}
