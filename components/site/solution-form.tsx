"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("solutions");
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();

  if (!signedIn) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-4 text-sm text-muted-foreground">
        {t.rich("signInToShare", {
          link: (c) => (
            <Link href="/login" className="text-primary hover:underline">
              {c}
            </Link>
          ),
        })}
      </div>
    );
  }

  function submit() {
    start(async () => {
      const res = await addSolution(problemId, slug, body);
      if (res.ok) {
        setBody("");
        toast.success(t("solutionAdded"));
        router.refresh();
      } else {
        toast.error(res.error ?? t("couldNotAdd"));
      }
    });
  }

  return (
    <div className="space-y-2 rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">{t("shareAFix")}</p>
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        maxLength={4000}
        placeholder={t("fixPlaceholder")}
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={submit} disabled={pending || body.trim().length < 10}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {t("postSolution")}
        </Button>
      </div>
    </div>
  );
}
