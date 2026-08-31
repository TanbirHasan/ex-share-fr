"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { GitCompareArrows, X } from "lucide-react";
import { useCompareTray } from "@/components/site/compare-tray";
import { Button } from "@/components/ui/button";

export function CompareBar() {
  const router = useRouter();
  const t = useTranslations("compare");
  const { items, remove, clear } = useCompareTray();

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.15)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <GitCompareArrows className="hidden size-4 shrink-0 text-primary sm:block" />
        <div className="flex flex-1 flex-wrap gap-1.5">
          {items.map((i) => (
            <span
              key={i.slug}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card py-1 pr-1 pl-2.5 text-xs"
            >
              <span className="max-w-40 truncate">{i.name}</span>
              <button
                type="button"
                onClick={() => remove(i.slug)}
                aria-label={t("removeName", { name: i.name })}
                className="rounded-full p-0.5 hover:bg-muted"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={clear}>
          {t("clear")}
        </Button>
        <Button
          size="sm"
          disabled={items.length < 2}
          onClick={() =>
            router.push(`/compare?slugs=${items.map((i) => i.slug).join(",")}`)
          }
        >
          {t("compareCount", { count: items.length })}
        </Button>
      </div>
    </div>
  );
}
