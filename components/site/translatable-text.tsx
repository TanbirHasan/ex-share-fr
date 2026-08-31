"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Languages, Loader2 } from "lucide-react";
import { translateContent } from "@/app/(site)/translate-actions";
import type { Locale } from "@/i18n/config";

/**
 * Renders a block of user-written content with a "Translate" toggle. The button
 * only appears when the content's language differs from the active UI locale.
 * Translation is fetched on demand and cached server-side.
 */
export function TranslatableText({
  text,
  targetType,
  targetId,
  sourceLang,
  className,
}: {
  text: string;
  targetType: "review" | "problem" | "solution";
  targetId: string;
  sourceLang: "bn" | "en";
  className?: string;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("translate");
  const [translated, setTranslated] = useState<string | null>(null);
  const [showing, setShowing] = useState<"original" | "translated">("original");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const offerTranslate = sourceLang !== locale;

  function toggle() {
    setError(null);
    if (showing === "translated") {
      setShowing("original");
      return;
    }
    if (translated) {
      setShowing("translated");
      return;
    }
    start(async () => {
      const res = await translateContent(targetType, targetId, locale as "bn" | "en");
      if (res.ok && res.text) {
        setTranslated(res.text);
        setShowing("translated");
      } else {
        setError(res.error ?? t("failed"));
      }
    });
  }

  const body = showing === "translated" && translated ? translated : text;

  return (
    <div>
      <p className={className}>{body}</p>
      {offerTranslate && (
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={toggle}
            disabled={pending}
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Languages className="size-3" />
            )}
            {pending
              ? t("translating")
              : showing === "translated"
                ? t("showOriginal")
                : t("translate")}
          </button>
          {showing === "translated" && !pending && (
            <span className="text-muted-foreground">· {t("machineNote")}</span>
          )}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
