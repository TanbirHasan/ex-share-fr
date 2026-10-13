"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { aiLookupProduct, type AiProductDraft } from "@/app/dashboard/(admin)/catalog/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AiAssist({
  initialQuery,
  onApply,
}: {
  initialQuery?: string;
  onApply: (draft: AiProductDraft) => void;
}) {
  const t = useTranslations("catalog.ai");
  const [query, setQuery] = useState(initialQuery ?? "");
  const [pending, start] = useTransition();
  const [draft, setDraft] = useState<AiProductDraft | null>(null);

  function run() {
    const q = query.trim();
    if (q.length < 3) return;
    start(async () => {
      const res = await aiLookupProduct(q);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setDraft(res.draft);
      if (res.draft.name) {
        onApply(res.draft);
        toast.success(t("filled"));
      } else {
        toast.message(t("noConfidentMatch"));
      }
    });
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Sparkles className="size-4 text-primary" />
        {t("title")}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{t("subtitle")}</p>
      <div className="mt-3 flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              run();
            }
          }}
          placeholder={t("placeholder")}
          disabled={pending}
          className="bg-background"
        />
        <Button type="button" onClick={run} disabled={pending || query.trim().length < 3}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {t("fetch")}
        </Button>
      </div>

      {draft && !draft.name && (
        <p className="mt-2 text-xs text-amber-600 dark:text-amber-500">{t("noConfidentMatch")}</p>
      )}

      {draft && draft.sources.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
          <span>{t("sources")}:</span>
          {draft.sources.map((s, i) => (
            <span key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {s.title}
              </a>
              {i < draft.sources.length - 1 && ","}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
