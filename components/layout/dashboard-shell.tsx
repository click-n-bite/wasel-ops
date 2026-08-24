"use client";

import { useDummyRealtime } from "@/hooks/use-dummy-realtime";
import { ToastStack } from "@/components/notifications/toast-stack";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  useDummyRealtime();

  return (
    <>
      {children}
      <ToastStack />
    </>
  );
}
