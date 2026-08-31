"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { askQuestion } from "@/app/(site)/qa-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function AskQuestionBox({
  productId,
  slug,
  signedIn,
}: {
  productId: string;
  slug: string;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();

  if (!signedIn) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-4 text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>{" "}
        to ask a question about this product.
      </div>
    );
  }

  function submit() {
    start(async () => {
      const res = await askQuestion(productId, slug, body);
      if (res.ok) {
        setBody("");
        toast.success("Question posted");
        router.refresh();
      } else {
        toast.error(res.error ?? "Could not post your question.");
      }
    });
  }

  return (
    <div className="space-y-2 rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">Ask the owners</p>
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        maxLength={1000}
        placeholder="e.g. How loud is it at night? Does it work with a stabiliser?"
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={submit} disabled={pending || body.trim().length < 5}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          Post question
        </Button>
      </div>
    </div>
  );
}
