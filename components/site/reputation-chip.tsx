import { useTranslations } from "next-intl";
import { BadgeCheck } from "lucide-react";
import { reputationLevel } from "@/lib/reputation";
import { cn } from "@/lib/utils";

/** Small level badge shown next to author names. Hidden below "trusted". */
export function ReputationChip({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const t = useTranslations();
  const level = reputationLevel(score);
  if (level.key === "new" || level.key === "contributor") return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary",
        className,
      )}
      title={t("buttons.contributionPoints", { score })}
    >
      <BadgeCheck className="size-3" />
      {t(`enums.reputation.${level.key}`)}
    </span>
  );
}
