"use client";

import { ProgramStateProvider } from "@/contexts/program-state";
import { MainLayout } from "@/components/layout/main-layout";
import { Toaster } from "@/components/ui/toaster";

export function ClientLayout() {
  return (
    <ProgramStateProvider>
      <MainLayout />
      <Toaster />
    </ProgramStateProvider>
  );
}
