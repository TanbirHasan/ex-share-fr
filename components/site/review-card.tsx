import Link from "next/link";
import { useTranslations } from "next-intl";
import { Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { CommentThread } from "@/components/site/comment-thread";
import { HelpfulButton } from "@/components/site/helpful-button";
import { ReviewPhotoStrip } from "@/components/site/review-photo-strip";
import { TranslatableText } from "@/components/site/translatable-text";
import { ReportButton } from "@/components/site/report-button";
import { ReputationChip } from "@/components/site/reputation-chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/format";
import { type Review } from "@/lib/review-types";
import { cn } from "@/lib/utils";

const buyAgainClass: Record<string, string> = {
  yes: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  maybe: "bg-muted text-muted-foreground",
  no: "bg-red-500/10 text-red-700 dark:text-red-400",
};
const buyAgainKey: Record<string, string> = {
  yes: "wouldBuyAgain",
  maybe: "mightBuyAgain",
  no: "wouldNotBuyAgain",
};
const buyAgainIcon: Record<string, typeof ThumbsUp> = {
  yes: ThumbsUp,
  maybe: ThumbsUp,
  no: ThumbsDown,
};

export function ReviewCard({ review, canVote }: { review: Review; canVote: boolean }) {
  const t = useTranslations("reviews");
  const tEnum = useTranslations("enums");
  const name = review.author.name?.trim() || t("anonUser");
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
  const baClass = buyAgainClass[review.wouldBuyAgain];
  const baLabel = buyAgainKey[review.wouldBuyAgain]
    ? t(buyAgainKey[review.wouldBuyAgain])
    : "";
  const BaIcon = buyAgainIcon[review.wouldBuyAgain];
  const storeLabel = review.store
    ? { text: t("boughtAt", { store: review.store.name }), href: `/stores/${review.store.slug}` }
    : review.purchaseStore
      ? { text: t("boughtAt", { store: review.purchaseStore }), href: null }
      : null;

  return (
    <article className="rounded-xl border bg-card p-4 sm:p-5">
      <header className="flex items-start gap-3">
        <Avatar className="size-10 border">
          <AvatarImage src={review.author.avatarUrl ?? undefined} alt={name} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="flex items-center gap-1.5 truncate text-sm font-medium">
              <Link href={`/u/${review.author.id}`} className="hover:underline">
                {name}
              </Link>
              <ReputationChip score={review.author.reputation} />
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-sm font-semibold">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {review.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("ownedFor", { duration: tEnum(`ownership.${review.ownershipDuration}`) })} ·{" "}
            {formatDate(review.createdAt)}
          </p>
        </div>
      </header>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            baClass,
          )}
        >
          <BaIcon className="size-3" />
          {baLabel}
        </span>
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

      {review.comment && (
        <div className="mt-3">
          <TranslatableText
            text={review.comment}
            targetType="review"
            targetId={review.id}
            sourceLang={review.contentLang}
            className="text-sm leading-relaxed whitespace-pre-line text-foreground/90"
          />
        </div>
      )}

      {review.images.length > 0 && <ReviewPhotoStrip images={review.images} />}

      {storeLabel &&
        (storeLabel.href ? (
          <Link
            href={storeLabel.href}
            className="mt-3 inline-block text-xs text-muted-foreground hover:underline"
          >
            {storeLabel.text}
          </Link>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">{storeLabel.text}</p>
        ))}

      <footer className="mt-3 flex items-center gap-3 border-t pt-3 text-xs">
        <ReportButton targetType="review" targetId={review.id} />
        <HelpfulButton
          reviewId={review.id}
          count={review.helpfulCount}
          voted={review.viewerHasVoted}
          canVote={canVote}
        />
      </footer>

      <CommentThread targetType="review" targetId={review.id} />
    </article>
  );
}
