"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Toaster } from "@/components/ui/toaster";

export function ClientLayout() {
  return (
    <>
      <MainLayout />
      <Toaster />
    </>
  );
}
