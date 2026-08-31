"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Check, Loader2, ThumbsUp, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { deleteSolution, setConfirmation, voteSolution } from "@/app/(site)/problems-actions";
import { CommentThread } from "@/components/site/comment-thread";
import { ReportButton } from "@/components/site/report-button";
import { ReputationChip } from "@/components/site/reputation-chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { Solution } from "@/lib/problem-types";
import { cn } from "@/lib/utils";

export function SolutionCard({
  solution,
  slug,
  signedIn,
}: {
  solution: Solution;
  slug: string;
  signedIn: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("solutions");
  const [s, setS] = useState({
    worked: solution.workedCount,
    didnt: solution.didntWorkCount,
    helpful: solution.helpfulCount,
    confirmed: solution.viewerConfirmed,
    voted: solution.viewerHasVoted,
  });
  const [pending, start] = useTransition();

  const name = solution.author.name?.trim() || t("anonUser");
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");

  function guard(): boolean {
    if (!signedIn) {
      router.push("/login");
      return false;
    }
    return true;
  }

  function confirm(target: "worked" | "didnt") {
    if (!guard()) return;
    const next = s.confirmed === target ? "none" : target;
    start(async () => {
      const res = await setConfirmation(solution.id, next);
      if (res.ok) {
        setS((p) => ({
          ...p,
          worked: res.worked ?? p.worked,
          didnt: res.didnt ?? p.didnt,
          confirmed: res.confirmed ?? "none",
        }));
      } else toast.error(res.error ?? t("couldNotSave"));
    });
  }

  function vote() {
    if (!guard()) return;
    start(async () => {
      const res = await voteSolution(solution.id, s.voted);
      if (res.ok) {
        setS((p) => ({ ...p, helpful: res.helpful ?? p.helpful, voted: res.voted ?? false }));
      } else toast.error(res.error ?? t("couldNotVote"));
    });
  }

  function remove() {
    start(async () => {
      const res = await deleteSolution(solution.id, slug);
      if (res.ok) {
        toast.success(t("solutionDeleted"));
        router.refresh();
      } else toast.error(res.error ?? t("couldNotDelete"));
    });
  }

  return (
    <article className="rounded-xl border bg-card p-4">
      <header className="flex items-center gap-3">
        <Avatar className="size-8 border">
          <AvatarImage src={solution.author.avatarUrl ?? undefined} alt={name} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-sm font-medium">
            <Link href={`/u/${solution.author.id}`} className="hover:underline">
              {name}
            </Link>
            <ReputationChip score={solution.author.reputation} />
          </p>
          <p className="text-xs text-muted-foreground">{formatDate(solution.createdAt)}</p>
        </div>
        {solution.viewerCanEdit && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-auto"
            onClick={remove}
            disabled={pending}
            aria-label={t("deleteSolution")}
          >
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </header>

      <p className="mt-3 text-sm whitespace-pre-line text-foreground/90">{solution.body}</p>

      <footer className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => confirm("worked")}
          disabled={pending}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60",
            s.confirmed === "worked"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "hover:bg-muted",
          )}
        >
          <Check className="size-3.5" />
          {t("workedForMe")}{s.worked > 0 ? ` · ${s.worked}` : ""}
        </button>
        <button
          type="button"
          onClick={() => confirm("didnt")}
          disabled={pending}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60",
            s.confirmed === "didnt"
              ? "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400"
              : "hover:bg-muted",
          )}
        >
          <X className="size-3.5" />
          {t("didntWork")}{s.didnt > 0 ? ` · ${s.didnt}` : ""}
        </button>
        <button
          type="button"
          onClick={vote}
          disabled={pending}
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60",
            s.voted ? "border-primary/40 bg-primary/5 text-primary" : "hover:bg-muted",
          )}
        >
          {pending ? <Loader2 className="size-3.5 animate-spin" /> : <ThumbsUp className="size-3.5" />}
          {t("helpful")}{s.helpful > 0 ? ` · ${s.helpful}` : ""}
        </button>
      </footer>

      <div className="mt-2 flex justify-end">
        <ReportButton targetType="solution" targetId={solution.id} />
      </div>

      <CommentThread targetType="solution" targetId={solution.id} />
    </article>
  );
}
