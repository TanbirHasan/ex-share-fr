"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("qa");
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();

  if (!signedIn) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-4 text-sm text-muted-foreground">
        {t.rich("signInToAsk", {
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
      const res = await askQuestion(productId, slug, body);
      if (res.ok) {
        setBody("");
        toast.success(t("questionPosted"));
        router.refresh();
      } else {
        toast.error(res.error ?? t("couldNotPost"));
      }
    });
  }

  return (
    <div className="space-y-2 rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">{t("askOwners")}</p>
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        maxLength={1000}
        placeholder={t("askPlaceholder")}
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={submit} disabled={pending || body.trim().length < 5}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {t("postQuestion")}
        </Button>
      </div>
    </div>
  );
}
