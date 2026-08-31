"use client";

import { useTranslations } from "next-intl";
import { Check, GitCompareArrows } from "lucide-react";
import { useCompareTray } from "@/components/site/compare-tray";
import { cn } from "@/lib/utils";

export function CompareButton({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const t = useTranslations("buttons");
  const { has, toggle, full } = useCompareTray();
  const active = has(slug);
  const disabled = !active && full;

  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      title={disabled ? t("compareUpTo") : undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ slug, name });
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "bg-background/90 hover:bg-muted",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {active ? <Check className="size-3.5" /> : <GitCompareArrows className="size-3.5" />}
      {active ? t("comparing") : t("compare")}
    </button>
  );
}
