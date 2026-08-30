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
  if (!count) {
    return (
      <span className={cn("text-sm text-muted-foreground", className)}>
        No ratings yet
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
