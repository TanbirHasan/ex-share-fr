"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitServiceExperience } from "@/app/(site)/contribute/service-actions";
import {
  ChipGroup,
  FormField,
  MiniStars,
  StarRatingInput,
} from "@/components/site/review-inputs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CHANNEL,
  REPAIR_OUTCOME,
  RESPONSE_TIME,
  SERVICE_WARRANTY,
  type ServiceExperience,
} from "@/lib/service-types";

export function ServiceForm({
  product,
  existing,
}: {
  product: { id: string; slug: string; name: string };
  existing: ServiceExperience | null;
}) {
  const router = useRouter();
  const t = useTranslations("serviceForm");
  const tEnum = useTranslations("enums");
  const [state, formAction, pending] = useActionState(submitServiceExperience, { ok: false });

  const channelOptions = CHANNEL.map((o) => ({
    value: o.value,
    label: tEnum(`channel.${o.value}`),
  }));
  const responseOptions = RESPONSE_TIME.map((o) => ({
    value: o.value,
    label: tEnum(`responseTime.${o.value}`),
  }));
  const outcomeOptions = REPAIR_OUTCOME.map((o) => ({
    value: o.value,
    label: tEnum(`repairOutcome.${o.value}`),
  }));
  const warrantyOptions = SERVICE_WARRANTY.map((o) => ({
    value: o.value,
    label: tEnum(`serviceWarranty.${o.value}`),
  }));

  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [responseTime, setResponseTime] = useState(existing?.responseTime ?? "");
  const [channel, setChannel] = useState(existing?.channel ?? "");
  const [outcome, setOutcome] = useState(existing?.repairOutcome ?? "");
  const [warranty, setWarranty] = useState(existing?.warranty ?? "");
  const [tech, setTech] = useState(existing?.technicianRating ?? 0);

  useEffect(() => {
    if (state.ok) {
      toast.success(existing ? t("updated") : t("thanksSharing"));
      router.push(`/products/${product.slug}`);
      router.refresh();
    }
  }, [state, existing, product.slug, router, t]);

  const canSubmit = rating > 0 && responseTime && channel && outcome && warranty;

  return (
    <form action={formAction} className="space-y-7">
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="slug" value={product.slug} />
      {existing && <input type="hidden" name="serviceId" value={existing.id} />}
      <input type="hidden" name="rating" value={rating || ""} />
      <input type="hidden" name="responseTime" value={responseTime} />
      <input type="hidden" name="channel" value={channel} />
      <input type="hidden" name="repairOutcome" value={outcome} />
      <input type="hidden" name="warranty" value={warranty} />
      <input type="hidden" name="technicianRating" value={tech || ""} />

      <FormField label={t("overallHow")} required>
        <StarRatingInput value={rating} onChange={setRating} />
      </FormField>

      <FormField label={t("howContact")} required>
        <ChipGroup options={channelOptions} value={channel} onChange={setChannel} />
      </FormField>

      <FormField label={t("howQuickly")} required>
        <ChipGroup options={responseOptions} value={responseTime} onChange={setResponseTime} />
      </FormField>

      <FormField label={t("howEnd")} required>
        <ChipGroup options={outcomeOptions} value={outcome} onChange={setOutcome} />
      </FormField>

      <FormField label={t("underWarranty")} required>
        <ChipGroup options={warrantyOptions} value={warranty} onChange={setWarranty} />
      </FormField>

      <FormField label={t("technician")} hint={t("technicianHint")}>
        <MiniStars value={tech} onChange={setTech} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label={t("whatServicing")}>
          <Input
            name="issue"
            maxLength={200}
            defaultValue={existing?.issue ?? ""}
            placeholder={t("issuePlaceholder")}
          />
        </FormField>
        <FormField label={t("costPaid")} hint={t("costHint")}>
          <Input name="cost" type="number" min={0} defaultValue={existing?.cost ?? ""} />
        </FormField>
        <FormField label={t("daysResolve")}>
          <Input
            name="durationDays"
            type="number"
            min={0}
            defaultValue={existing?.durationDays ?? ""}
          />
        </FormField>
      </div>

      <FormField label={t("anythingElse")} hint={t("optional")}>
        <Textarea
          name="comment"
          rows={4}
          maxLength={4000}
          defaultValue={existing?.comment ?? ""}
          placeholder={t("commentPlaceholder")}
        />
      </FormField>

      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending || !canSubmit}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {existing ? t("saveChanges") : t("publish")}
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
