"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
