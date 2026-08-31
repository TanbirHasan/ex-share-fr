"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useCompareTray } from "@/components/site/compare-tray";

export function CompareRemove({ slug, allSlugs }: { slug: string; allSlugs: string[] }) {
  const router = useRouter();
  const t = useTranslations("compare");
  const { remove } = useCompareTray();
  const rest = allSlugs.filter((s) => s !== slug);

  return (
    <button
      type="button"
      onClick={() => {
        remove(slug);
        router.push(rest.length >= 2 ? `/compare?slugs=${rest.join(",")}` : "/compare");
      }}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
    >
      <X className="size-3" /> {t("remove")}
    </button>
  );
}
