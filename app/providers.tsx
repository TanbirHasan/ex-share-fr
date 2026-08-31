"use client";

import type { ReactNode } from "react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { CompareTrayProvider } from "@/components/site/compare-tray";
import { SavedProvider } from "@/components/site/saved-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <ThemeProvider>
      <SessionProvider session={session}>
        <TooltipProvider delayDuration={200}>
          <SavedProvider>
            <CompareTrayProvider>{children}</CompareTrayProvider>
          </SavedProvider>
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
