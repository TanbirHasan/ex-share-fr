"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Loader2, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { postComment, removeComment } from "@/app/(site)/comments-actions";
import { ReputationChip } from "@/components/site/reputation-chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Comment } from "@/lib/comment-types";
import { formatDate } from "@/lib/format";

export function CommentThread({
  targetType,
  targetId,
}: {
  targetType: "review" | "solution";
  targetId: string;
}) {
  const { status } = useSession();
  const signedIn = status === "authenticated";
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [body, setBody] = useState("");
  const [busy, start] = useTransition();

  async function load() {
    try {
      const res = await fetch(
        `/api/comments?targetType=${targetType}&targetId=${encodeURIComponent(targetId)}`,
      );
      const d = res.ok ? await res.json() : { data: [] };
      setComments(d.data ?? []);
    } catch {
      setComments([]);
    }
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && comments === null) void load();
  }

  function submit() {
    start(async () => {
      const res = await postComment(targetType, targetId, body);
      if (res.ok) {
        setBody("");
        await load();
      } else {
        toast.error(res.error ?? "Could not post your comment.");
      }
    });
  }

  function del(id: string) {
    start(async () => {
      const res = await removeComment(id);
      if (res.ok) await load();
      else toast.error(res.error ?? "Could not delete.");
    });
  }

  const count = comments?.length ?? 0;
  const label =
    comments === null
      ? "Comments"
      : count === 0
        ? "Add a comment"
        : `${count} comment${count === 1 ? "" : "s"}`;

  return (
    <div className="mt-2 border-t pt-2">
      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <MessageCircle className="size-3.5" />
        {open ? "Hide comments" : label}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {comments === null ? (
            <p className="text-xs text-muted-foreground">Loading…</p>
          ) : count === 0 ? (
            <p className="text-xs text-muted-foreground">No comments yet.</p>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => {
                const name = c.author.name?.trim() || "ExperienceHub user";
                return (
                  <li key={c.id} className="flex gap-2.5">
                    <Avatar className="size-7 border">
                      <AvatarImage src={c.author.avatarUrl ?? undefined} alt={name} />
                      <AvatarFallback className="text-[10px]">
                        {name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-xs">
                        <Link href={`/u/${c.author.id}`} className="font-medium hover:underline">
                          {name}
                        </Link>
                        <ReputationChip score={c.author.reputation} />
                        <span className="text-muted-foreground">· {formatDate(c.createdAt)}</span>
                        {c.viewerCanEdit && (
                          <button
                            type="button"
                            onClick={() => del(c.id)}
                            disabled={busy}
                            aria-label="Delete comment"
                            className="ml-auto text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        )}
                      </p>
                      <p className="mt-0.5 text-sm whitespace-pre-line text-foreground/90">
                        {c.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {signedIn ? (
            <div className="flex gap-2">
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={2}
                maxLength={2000}
                placeholder="Add a comment…"
                className="text-sm"
              />
              <Button size="sm" onClick={submit} disabled={busy || body.trim().length < 1}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : "Post"}
              </Button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>{" "}
              to comment.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
