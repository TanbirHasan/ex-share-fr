"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, CircleCheck, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  acceptAnswer,
  deleteAnswer,
  deleteQuestion,
  postAnswer,
} from "@/app/(site)/qa-actions";
import { ReputationChip } from "@/components/site/reputation-chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import type { Answer, Question } from "@/lib/qa-types";
import { cn } from "@/lib/utils";

function personName(name: string | null) {
  return name?.trim() || "ExperienceHub user";
}

export function QuestionCard({
  question,
  slug,
  signedIn,
}: {
  question: Question;
  slug: string;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [pending, start] = useTransition();

  const askerName = personName(question.author.name);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>, ok?: string) {
    start(async () => {
      const res = await fn();
      if (res.ok) {
        if (ok) toast.success(ok);
        router.refresh();
      } else {
        toast.error(res.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <article className="rounded-xl border bg-card p-4">
      <header className="flex items-start gap-3">
        <Avatar className="size-7 border">
          <AvatarImage src={question.author.avatarUrl ?? undefined} alt={askerName} />
          <AvatarFallback className="text-[10px]">
            {askerName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{question.body}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href={`/u/${question.author.id}`} className="hover:underline">
              {askerName}
            </Link>
            <ReputationChip score={question.author.reputation} />
            · asked {formatDate(question.createdAt)}
          </p>
        </div>
        {question.viewerCanEdit && (
          <button
            type="button"
            onClick={() => run(() => deleteQuestion(question.id, slug))}
            disabled={pending}
            aria-label="Delete question"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </header>

      {question.answers.length > 0 && (
        <ul className="mt-3 space-y-2 border-l-2 pl-3">
          {question.answers.map((a) => (
            <AnswerRow
              key={a.id}
              answer={a}
              slug={slug}
              viewerIsAsker={question.viewerIsAsker}
              questionId={question.id}
              pending={pending}
              run={run}
            />
          ))}
        </ul>
      )}

      {signedIn ? (
        <div className="mt-3 flex gap-2">
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={2}
            maxLength={3000}
            placeholder="Answer from your experience…"
            className="text-sm"
          />
          <Button
            size="sm"
            onClick={() =>
              run(async () => {
                const res = await postAnswer(question.id, slug, answer);
                if (res.ok) setAnswer("");
                return res;
              })
            }
            disabled={pending || answer.trim().length < 5}
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Answer"}
          </Button>
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>{" "}
          to answer.
        </p>
      )}
    </article>
  );
}

function AnswerRow({
  answer,
  slug,
  viewerIsAsker,
  questionId,
  pending,
  run,
}: {
  answer: Answer;
  slug: string;
  viewerIsAsker: boolean;
  questionId: string;
  pending: boolean;
  run: (fn: () => Promise<{ ok: boolean; error?: string }>, ok?: string) => void;
}) {
  const name = personName(answer.author.name);
  return (
    <li
      className={cn(
        "rounded-lg p-2",
        answer.isAccepted && "bg-emerald-500/5 ring-1 ring-emerald-500/30",
      )}
    >
      <div className="flex items-center gap-1.5 text-xs">
        {answer.isAccepted && (
          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
            <CircleCheck className="size-3.5" /> Accepted
          </span>
        )}
        <Link href={`/u/${answer.author.id}`} className="font-medium hover:underline">
          {name}
        </Link>
        <ReputationChip score={answer.author.reputation} />
        <span className="text-muted-foreground">· {formatDate(answer.createdAt)}</span>
        <span className="ml-auto flex items-center gap-2">
          {viewerIsAsker && (
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                run(
                  () =>
                    acceptAnswer(questionId, slug, answer.isAccepted ? null : answer.id),
                  answer.isAccepted ? "Unmarked" : "Marked as accepted",
                )
              }
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                answer.isAccepted
                  ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-400"
                  : "hover:bg-muted",
              )}
            >
              <Check className="size-3" />
              {answer.isAccepted ? "Unaccept" : "Accept"}
            </button>
          )}
          {answer.viewerCanEdit && (
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => deleteAnswer(answer.id, slug))}
              aria-label="Delete answer"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3" />
            </button>
          )}
        </span>
      </div>
      <p className="mt-1 text-sm whitespace-pre-line text-foreground/90">{answer.body}</p>
    </li>
  );
}
