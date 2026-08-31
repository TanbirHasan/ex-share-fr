import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  value,
  count,
  className,
}: {
  value: number;
  count: number;
  className?: string;
}) {
  const t = useTranslations("common");
  if (!count) {
    return (
      <span className={cn("text-sm text-muted-foreground", className)}>
        {t("noRatingsYet")}
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", className)}>
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
      <span className="font-normal text-muted-foreground">
        ({count.toLocaleString()})
      </span>
    </span>
  );
}
