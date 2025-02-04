// hooks/usePluginDataFromStore.ts
import { useEffect, useCallback } from "react";

// Hier deklarieren wir den Parameter als unknown
export function usePluginDataFromStore<T>(
  store: unknown,
  instanceId: string,
  initialValue: T
): [T, (newData: T) => void] {
  // Wir casten store zu einem Typ, der zumindest die benötigten Funktionen enthält.
  const typedStore = store as {
    getPluginState: (pluginKey: string) => { pluginData?: unknown } | undefined;
    setPluginState: (
      pluginKey: string,
      newState: { pluginData: unknown }
    ) => void;
  };

  const state = typedStore.getPluginState(instanceId);
  const value =
    state?.pluginData !== undefined ? state.pluginData : initialValue;

  const setData = useCallback(
    (newData: T) => {
      typedStore.setPluginState(instanceId, { pluginData: newData });
    },
    [instanceId, typedStore]
  );

  useEffect(() => {
    if (state === undefined) {
      typedStore.setPluginState(instanceId, { pluginData: initialValue });
    }
  }, [state, initialValue, instanceId, typedStore]);

  return [value as T, setData];
}
