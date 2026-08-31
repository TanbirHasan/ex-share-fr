"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitProductRequest } from "@/app/(site)/contribute/request-actions";
import { FormField } from "@/components/site/review-inputs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n-content";
import type { Category } from "@/lib/catalog-types";

const NONE = "__none__";

export function RequestForm({
  categories,
  defaultText = "",
}: {
  categories: Category[];
  defaultText?: string;
}) {
  const t = useTranslations("requestForm");
  const locale = useLocale() as Locale;
  const [state, formAction, pending] = useActionState(submitProductRequest, { ok: false });

  if (state.ok) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-5" />
        </span>
        <p className="mt-4 text-sm font-medium text-foreground">
          {state.duplicate ? t("alreadyRequested") : t("thanks")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{t("thanksBody")}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/products">{t("browseProducts")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <FormField label={t("whatProduct")} required hint={t("whatProductHint")}>
        <Textarea
          name="rawText"
          defaultValue={defaultText}
          rows={3}
          maxLength={500}
          placeholder={t("placeholder")}
        />
      </FormField>

      <FormField label={t("category")} hint={t("categoryHint")}>
        <Select name="categoryGuess" defaultValue={NONE}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>{t("notSure")}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={localizedName(locale, c)}>
                {localizedName(locale, c)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        {t("submit")}
      </Button>
    </form>
  );
}
