"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CommunityTab = {
  key: string;
  label: string;
  count: number;
  panel: ReactNode;
};

/**
 * Tabbed shell for the product page's community sections (reviews, problems,
 * Q&A, service). All panels stay mounted — they're server-rendered and cheap to
 * keep in the DOM — so switching tabs is instant and nothing refetches.
 */
export function ProductCommunity({ tabs }: { tabs: CommunityTab[] }) {
  const [active, setActive] = useState(tabs[0]?.key ?? "");

  // Support #reviews / #problems / #qa / #service deep links.
  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    if (fromHash && tabs.some((t) => t.key === fromHash)) setActive(fromHash);
  }, [tabs]);

  function select(key: string) {
    setActive(key);
    history.replaceState(null, "", `#${key}`);
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Community"
        className="-mx-1 flex gap-1 overflow-x-auto border-b px-1"
      >
        {tabs.map((t) => {
          const on = t.key === active;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => select(t.key)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                on
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs tabular-nums",
                  on ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.key}
          role="tabpanel"
          className={cn("pt-6", t.key !== active && "hidden")}
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
