"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitProblem } from "@/app/(site)/contribute/problem-actions";
import { ChipGroup, FormField } from "@/components/site/review-inputs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  PROBLEM_CATEGORIES,
  PROBLEM_STARTED,
  WARRANTY_COVERED,
  type ProblemCategory,
} from "@/lib/problem-types";

export function ReportProblemForm({
  product,
}: {
  product: { id: string; slug: string; name: string };
}) {
  const router = useRouter();
  const t = useTranslations("problemForm");
  const tEnum = useTranslations("enums");
  const [state, formAction, pending] = useActionState(submitProblem, { ok: false });

  const [category, setCategory] = useState<ProblemCategory | "">("");
  const [whenStarted, setWhenStarted] = useState("");
  const [warranty, setWarranty] = useState("");

  const categoryOptions = PROBLEM_CATEGORIES.map((o) => ({
    value: o.value,
    label: tEnum(`problemCategory.${o.value}`),
  }));
  const startedOptions = PROBLEM_STARTED.map((o) => ({
    value: o.value,
    label: tEnum(`problemStarted.${o.value}`),
  }));
  const warrantyOptions = WARRANTY_COVERED.map((o) => ({
    value: o.value,
    label: tEnum(`warrantyCovered.${o.value}`),
  }));

  useEffect(() => {
    if (state.ok && state.slug) {
      toast.success(t("problemReported"));
      router.push(`/problems/${state.slug}`);
      router.refresh();
    }
  }, [state, router, t]);

  return (
    <form action={formAction} className="space-y-7">
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="whenStarted" value={whenStarted} />
      <input type="hidden" name="warrantyCovered" value={warranty} />

      <FormField label={t("kindOfProblem")} required>
        <ChipGroup options={categoryOptions} value={category} onChange={setCategory} />
      </FormField>

      <FormField label={t("title")} required hint={t("titleHint")}>
        <Input name="title" maxLength={160} placeholder={t("titlePlaceholder")} />
      </FormField>

      <FormField label={t("whatHappened")} required>
        <Textarea
          name="description"
          rows={5}
          maxLength={4000}
          placeholder={t("whatHappenedPlaceholder")}
        />
      </FormField>

      <FormField label={t("whenStart")} hint={t("whenStartHint")}>
        <ChipGroup options={startedOptions} value={whenStarted} onChange={setWhenStarted} />
      </FormField>

      <FormField label={t("coveredWarranty")} hint={t("optional")}>
        <ChipGroup options={warrantyOptions} value={warranty} onChange={setWarranty} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={t("repairCost")} hint={t("repairCostHint")}>
          <Input name="repairCost" type="number" min={0} />
        </FormField>
      </div>

      <FormField label={t("serviceCentreSaid")} hint={t("optional")}>
        <Textarea name="note" rows={3} maxLength={2000} placeholder={t("notePlaceholder")} />
      </FormField>

      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {t("reportProblem")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(`/products/${product.slug}`)}
        >
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
