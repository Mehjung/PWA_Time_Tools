import { create } from "zustand";
import { type ProgramId } from "@/lib/program-config";

interface ProgramStore {
  activeProgram: ProgramId | null;
  runningPrograms: ProgramId[];
  setActiveProgram: (id: ProgramId | null) => void;
  getRunningCallback: (id: ProgramId) => (isRunning: boolean) => void;
}

export const useProgramStore = create<ProgramStore>((set) => ({
  activeProgram: null,
  runningPrograms: [],
  setActiveProgram: (id) => set({ activeProgram: id }),
  getRunningCallback: (id) => (isRunning) =>
    set((state) => {
      console.log("DEBUG: Store getRunningCallback", {
        id,
        isRunning,
        currentRunning: state.runningPrograms,
      });

      // Wenn der Status sich nicht ändert, keine Aktualisierung
      const isCurrentlyRunning = state.runningPrograms.includes(id);
      if (isRunning === isCurrentlyRunning) {
        console.log("DEBUG: Store - no change needed");
        return state;
      }

      const newRunningPrograms = isRunning
        ? [...state.runningPrograms, id]
        : state.runningPrograms.filter((p) => p !== id);

      console.log("DEBUG: Store - updating to:", newRunningPrograms);

      return {
        runningPrograms: newRunningPrograms,
      };
    }),
}));
