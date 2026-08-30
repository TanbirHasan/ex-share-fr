import { Star } from "lucide-react";
import { HelpfulButton } from "@/components/site/helpful-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/format";
import { ownershipLabel, type Review } from "@/lib/review-types";
import { cn } from "@/lib/utils";

const buyAgain: Record<string, { label: string; className: string }> = {
  yes: { label: "Would buy again", className: "text-emerald-700 dark:text-emerald-400" },
  maybe: { label: "Might buy again", className: "text-amber-700 dark:text-amber-400" },
  no: { label: "Would not buy again", className: "text-red-700 dark:text-red-400" },
};

export function ReviewCard({ review, canVote }: { review: Review; canVote: boolean }) {
  const name = review.author.name?.trim() || "ExperienceHub user";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
  const ba = buyAgain[review.wouldBuyAgain];

  return (
    <article className="rounded-xl border bg-card p-4">
      <header className="flex items-center gap-3">
        <Avatar className="size-9 border">
          <AvatarImage src={review.author.avatarUrl ?? undefined} alt={name} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">
            Owned {ownershipLabel(review.ownershipDuration).toLowerCase()} ·{" "}
            {formatDate(review.createdAt)}
          </p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          {review.rating.toFixed(1)}
        </span>
      </header>

      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {review.pros.map((p) => (
            <span
              key={`p-${p}`}
              className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
            >
              + {p}
            </span>
          ))}
          {review.cons.map((c) => (
            <span
              key={`c-${c}`}
              className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400"
            >
              − {c}
            </span>
          ))}
        </div>
      )}

      {review.comment && (
        <p className="mt-3 text-sm whitespace-pre-line text-foreground/90">{review.comment}</p>
      )}

      <footer className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
        <span className={cn("font-medium", ba?.className)}>{ba?.label}</span>
        {review.purchaseStore && (
          <span className="text-muted-foreground">Bought at {review.purchaseStore}</span>
        )}
        <span className="ml-auto">
          <HelpfulButton
            reviewId={review.id}
            count={review.helpfulCount}
            voted={review.viewerHasVoted}
            canVote={canVote}
          />
        </span>
      </footer>
    </article>
  );
}
