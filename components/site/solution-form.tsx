"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addSolution } from "@/app/(site)/problems-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function SolutionForm({
  problemId,
  slug,
  signedIn,
}: {
  problemId: string;
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
        to share how you fixed this.
      </div>
    );
  }

  function submit() {
    start(async () => {
      const res = await addSolution(problemId, slug, body);
      if (res.ok) {
        setBody("");
        toast.success("Solution added");
        router.refresh();
      } else {
        toast.error(res.error ?? "Could not add your solution.");
      }
    });
  }

  return (
    <div className="space-y-2 rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">Share a fix</p>
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        maxLength={4000}
        placeholder="What worked for you? Be specific — steps, parts, rough cost, who did it."
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={submit} disabled={pending || body.trim().length < 10}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          Post solution
        </Button>
      </div>
    </div>
  );
}
