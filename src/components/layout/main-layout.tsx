"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Header } from "./header";
import { ProgramCard } from "../program-card";
import { PLUGINS, type PluginId } from "@/lib/program-config";
import { useProgramStore } from "@/stores/program-store";
import { useShallow } from "zustand/react/shallow";
import withPluginRef, {
  createPluginFunctions,
  PluginExposedAPI,
  PluginProps,
} from "@/components/hoc/with-plugin-ref";
import { ComponentType } from "react";

export const MainLayout = () => {
  const [showPrograms, setShowPrograms] = useState(false);
  const [clientActivePlugins, setClientActivePlugins] = useState<PluginId[]>(
    []
  );
  const { activeProgram, setActiveProgram } = useProgramStore();

  // Ref für den Zugriff auf das Plugin-API der aktiven Komponente
  const programRef = useRef<PluginExposedAPI | null>(null);

  const runningPrograms = useProgramStore(
    useShallow((state) => state.runningPrograms)
  );

  // Client-seitige Berechnung der aktiven Plugins
  useEffect(() => {
    if (typeof window === "undefined") return;

    const activePlugins = PLUGINS.filter(
      (plugin) =>
        runningPrograms.includes(plugin.id) ||
        (plugin.onPluginPreMount?.() ?? false)
    ).map((p) => p.id);

    setClientActivePlugins(activePlugins);
  }, [runningPrograms]);

  const activeConfig = activeProgram
    ? PLUGINS.find((p) => p.id === activeProgram)
    : null;

  // Factory für Plugin-Funktionen
  const createProgramPluginFunctions = useCallback(
    (instanceId: string) => createPluginFunctions(instanceId),
    []
  );

  const handleProgramActivation = useCallback(
    (id: PluginId) => {
      setActiveProgram(id);
      setShowPrograms(false);
    },
    [setActiveProgram]
  );

  const handleHeaderProgramSelect = useCallback(
    (id: PluginId) => {
      setActiveProgram(id);
    },
    [setActiveProgram]
  );

  const renderContent = () => {
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

    if (!activeConfig) return null;

    const WrappedComponent = withPluginRef(
      activeConfig.component as unknown as ComponentType<
        PluginProps & PluginExposedAPI
      >,
      { persistent: activeConfig?.persistent, componentId: activeConfig?.id },
      createProgramPluginFunctions
    );

    return <WrappedComponent ref={programRef} />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Header
          onPluginsClick={() => setShowPrograms((prev) => !prev)}
          activePlugins={clientActivePlugins}
          onPluginSelect={handleHeaderProgramSelect}
        />
      </div>

      <main className="container mx-auto p-4">
        <div className="h-full flex flex-col">
          {showPrograms ? (
            <div className="flex-1 flex items-start justify-center pt-16 pb-8">
              <div className="max-w-sm mx-auto w-full px-4">
                <div
                  className="grid grid-cols-1 gap-4 mt-8"
                  role="menu"
                  aria-label="Programme"
                >
                  {PLUGINS.map((plugin) => (
                    <ProgramCard
                      key={plugin.id}
                      title={plugin.name}
                      description={plugin.description}
                      icon={plugin.icon}
                      isActive={plugin.id === activeProgram}
                      isRunning={clientActivePlugins.includes(plugin.id)}
                      onClick={() => handleProgramActivation(plugin.id)}
                      role="menuitem"
                      aria-current={plugin.id === activeProgram}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>
    </div>
  );
};
