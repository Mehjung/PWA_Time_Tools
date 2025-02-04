"use client";

// withPluginRef.tsx
import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import usePluginStore from "../../stores/plugin-store";
import { usePluginDataFromStore } from "../../hooks/usePluginData";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

interface PluginConfig {
  persistent?: boolean;
  componentId?: string;
}

/**
 * Generische Schnittstelle für eine einzelne Plugin-Funktion.
 * K: Der Funktionsname als String.
 * Impl: Der Typ der Implementierung.
 */
export interface PluginFunction<K extends string, Impl> {
  name: K;
  implementation: Impl;
}

/**
 * Hilfstyp, der aus einem Array von PluginFunction-Objekten das API ableitet.
 * Für jedes Element im Array wird ein Property erzeugt, dessen Key dem 'name' entspricht.
 */
export type ExtractAPI<PF extends readonly PluginFunction<string, unknown>[]> =
  {
    [P in PF[number] as P["name"]]: P extends PluginFunction<
      P["name"],
      infer Impl
    >
      ? Impl
      : never;
  };

/**
 * Erzeugt ein Array von Plugin-Funktionen für einen gegebenen instanceId.
 * Diese Funktionen greifen auf den globalen Zustand zu.
 */
export const createPluginFunctions = (instanceId: string) =>
  [
    {
      name: "running",
      implementation: (() => {
        const state = usePluginStore.getState().getPluginState(instanceId);
        const value = state?.running ?? false;
        const setRunning = (newState: boolean): void => {
          usePluginStore
            .getState()
            .setPluginState(instanceId, { running: newState });
        };
        return [value, setRunning] as [boolean, (newState: boolean) => void];
      })(),
    },
    {
      name: "pluginData",
      // Wir definieren hier eine Funktion, deren Name mit "use" beginnt.
      // Dadurch wird sie als Custom Hook erkannt.
      implementation: function usePluginData<T>(
        initialValue: T
      ): [T, (newData: T) => void] {
        return usePluginDataFromStore<T>(
          usePluginStore.getState(),
          instanceId,
          initialValue
        );
      },
    },
  ] as const;

// Typ des Array-Ergebnisses der Factory-Funktion
type PluginFunctions = ReturnType<typeof createPluginFunctions>;

// Leite daraus das API-Objekt ab, das wir sowohl über den Ref als auch als Props an die Wrapped-Komponente übergeben:
export type PluginExposedAPI = ExtractAPI<PluginFunctions>;
export type PluginProps = PluginExposedAPI;

/**
 * Higher-Order Component, die:
 * - Eine Wrapped-Komponente erwartet, der zusätzlich das abgeleitete API (als Objekt) übergeben wird.
 * - Das Plugin-API als Array (mittels createPluginFunctionsFactory) erstellt.
 * - Optional konfiguriert werden kann, ob der Store-Bereich persistent sein soll.
 *
 * Das API wird sowohl über den Ref als auch als Props an die Wrapped-Komponente übergeben.
 */
function withPluginRef<
  P extends object,
  PF extends readonly PluginFunction<string, unknown>[]
>(
  WrappedComponent: React.ComponentType<P & ExtractAPI<PF>>,
  config: PluginConfig = {},
  createPluginFunctionsFactory: (instanceId: string) => PF
) {
  // 1. Determine the base component identifier (used for both name and ID)
  let baseComponentIdentifier: string | undefined;

  if (config.componentId) {
    baseComponentIdentifier = config.componentId;
  } else if (WrappedComponent.displayName) {
    baseComponentIdentifier = WrappedComponent.displayName;
  } else if (WrappedComponent.name) {
    baseComponentIdentifier = WrappedComponent.name;
  }

  // 2. Determine wrappedComponentName (for display purposes)
  const wrappedComponentName = baseComponentIdentifier;

  if (!baseComponentIdentifier) {
    console.warn(
      "WARN: withPluginRef - Could not determine component name from config, displayName, or name. Using 'Component' as display name fallback."
    );
  }

  // 3. Determine defaultComponentId (for Store ID and persistence)
  // Use the base identifier if available, otherwise, let it be undefined initially.
  const defaultComponentId = baseComponentIdentifier;

  if (!defaultComponentId) {
    console.warn(
      "WARN: withPluginRef - Could not determine stable componentId from config, displayName, or name.  Persistence might be compromised if component re-renders."
    );
    throw new Error(
      "withPluginRef - Could not determine a stable componentId.  Please ensure the WrappedComponent has a displayName or name, or provide a componentId in the config."
    );
  }

  const WithPluginRef = forwardRef<
    ExtractAPI<PF>,
    Omit<P, keyof ExtractAPI<PF>>
  >((props, ref) => {
    const componentId = defaultComponentId;

    const pluginFunctions = createPluginFunctionsFactory(componentId);

    // best practice for rerendering of the component
    useStore(
      usePluginStore,
      useShallow((state) => state.data[componentId]) // Tiefenvergleich für das Plugin-Objekt
    );

    // never add pluginFunctions to cleanup cause of exhausting rerendering
    useEffect(() => {
      if (!config.persistent) {
        return () => {
          usePluginStore.getState().cleanupPluginInstance(componentId);
        };
      }
    }, [componentId]);

    const exposedAPI = pluginFunctions.reduce((acc, func) => {
      return { ...acc, [func.name]: func.implementation };
    }, {} as ExtractAPI<PF>);

    useImperativeHandle(ref, () => exposedAPI, [exposedAPI]);

    const combinedProps = {
      ...(props as Omit<P, keyof ExtractAPI<PF>>),
      ...exposedAPI,
    };

    return <WrappedComponent {...(combinedProps as P & ExtractAPI<PF>)} />;
  });

  WithPluginRef.displayName = `withPluginRef(${wrappedComponentName})`;
  return WithPluginRef;
}

export default withPluginRef;
