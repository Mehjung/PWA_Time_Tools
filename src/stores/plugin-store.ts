// stores/plugin-store.ts
import { create } from "zustand";

export interface PluginState {
  running?: boolean;
  pluginData?: unknown;
  // Weitere Felder können hier ergänzt werden.
}

export interface PluginStore {
  data: Record<string, PluginState>;
  setPluginState: (pluginKey: string, newState: Partial<PluginState>) => void;
  getPluginState: (pluginKey: string) => PluginState | undefined;
  cleanupPluginInstance: (pluginKey: string) => void;
}

const usePluginStore = create<PluginStore>((set, get) => ({
  data: {},
  setPluginState: (pluginKey: string, newState: Partial<PluginState>) => {
    set((state) => ({
      data: {
        ...state.data,
        [pluginKey]: {
          ...(state.data[pluginKey] || {}), // Bestehende Daten übernehmen
          ...newState,
        },
      },
    }));
    console.log("DEBUG: Store setPluginState", get().data);
  },
  getPluginState: (pluginKey: string) => get().data[pluginKey],
  cleanupPluginInstance: (pluginKey: string) => {
    set((state) => {
      const newData = { ...state.data };
      if (newData.hasOwnProperty(pluginKey)) {
        delete newData[pluginKey];
      } else {
        console.warn(
          `DEBUG: Store cleanupPluginInstance - pluginKey '${pluginKey}' nicht gefunden im Store.data.`
        );
      }
      return { data: newData };
    });
    console.log("DEBUG: Store cleanupPluginInstance", { pluginKey });
  },
}));

export default usePluginStore;
