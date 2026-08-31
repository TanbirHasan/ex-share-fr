"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { toggleHelpful } from "@/app/(site)/reviews-actions";
import { cn } from "@/lib/utils";

export function HelpfulButton({
  reviewId,
  count,
  voted,
  canVote,
}: {
  reviewId: string;
  count: number;
  voted: boolean;
  canVote: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("buttons");
  const [state, setState] = useState({ count, voted });
  const [pending, start] = useTransition();

  function click() {
    if (!canVote) {
      router.push("/login");
      return;
    }
    start(async () => {
      const res = await toggleHelpful(reviewId, state.voted);
      if (res.ok) setState({ count: res.helpfulCount ?? 0, voted: res.voted ?? false });
      else toast.error(res.error ?? t("couldNotVote"));
    });
  }

  return (
    <button
      type="button"
      onClick={click}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60",
        state.voted
          ? "border-primary/40 bg-primary/5 text-primary"
          : "hover:bg-muted",
      )}
    >
      <ThumbsUp className="size-3.5" />
      {t("helpful")}{state.count > 0 ? ` · ${state.count}` : ""}
    </button>
  );
}
