// src/stores/program-store.ts
import { create } from "zustand";
import { type PluginId } from "@/lib/program-config";
import usePluginStore from "./plugin-store";

interface ProgramStore {
  activeProgram: PluginId | null;
  initialRunningIds: string[];
  runningPrograms: string[];
  setInitialRunningIds: (ids: string[]) => void;
  setActiveProgram: (id: PluginId | null) => void;
  updateRunningPrograms: () => void;
}

// Hilfsfunktion für den Array-Vergleich
const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

export const useProgramStore = create<ProgramStore>((set, get) => ({
  activeProgram: null,
  runningPrograms: [],
  initialRunningIds: [],
  setInitialRunningIds: (ids: string[]) => {
    // Beim initialen Setzen beider Felder: initialRunningIds und runningPrograms
    set({ initialRunningIds: ids, runningPrograms: ids });
  },
  setActiveProgram: (id: PluginId | null) => set({ activeProgram: id }),

  updateRunningPrograms: () => {
    console.log("updateRunningPrograms called");
    const pluginData = usePluginStore.getState().data;

    // Ermittle alle aktuell laufenden IDs anhand von pluginData.
    const running = Object.keys(pluginData).filter(
      (id) => pluginData[id]?.running
    );

    // Entferne aus initialRunningIds alle IDs, die aktuell laufen.
    // Dadurch "bereinigen" wir initialRunningIds:
    // Einmal aktiv gewesen und jetzt ausgeschaltet, sollen nicht mehr erscheinen.
    const currentInitial = get().initialRunningIds;
    const newInitial = currentInitial.filter((id) => !running.includes(id));

    // Falls sich initialRunningIds ändern, aktualisieren wir den Store.
    if (newInitial.length !== currentInitial.length) {
      console.log("Cleaning initialRunningIds, removing running IDs");
      set({ initialRunningIds: newInitial });
    }

    // Erzeuge die finale Liste als Vereinigung der (bereinigten) initialRunningIds und aktuell laufender IDs.
    const newRunningPrograms = [...newInitial, ...running];

    if (!arraysEqual(newRunningPrograms, get().runningPrograms)) {
      console.log("runningPrograms changed, updating state");
      set({ runningPrograms: newRunningPrograms });
    } else {
      console.log("runningPrograms did not change, skipping state update");
    }
    console.log("After set runningPrograms:", newRunningPrograms);
  },
}));

// Subscription: Immer wenn der plugin-store sich ändert, rufe updateRunningPrograms auf.
usePluginStore.subscribe(() => {
  useProgramStore.getState().updateRunningPrograms();
});
