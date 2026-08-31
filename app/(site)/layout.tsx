import type { ReactNode } from "react";
import { CompareBar } from "@/components/site/compare-bar";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1 pb-16">{children}</div>
        <SiteFooter />
      </div>
      <CompareBar />
    </>
  );
}
