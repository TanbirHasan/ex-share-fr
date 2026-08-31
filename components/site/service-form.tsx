"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [state, formAction, pending] = useActionState(submitServiceExperience, { ok: false });

  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [responseTime, setResponseTime] = useState(existing?.responseTime ?? "");
  const [channel, setChannel] = useState(existing?.channel ?? "");
  const [outcome, setOutcome] = useState(existing?.repairOutcome ?? "");
  const [warranty, setWarranty] = useState(existing?.warranty ?? "");
  const [tech, setTech] = useState(existing?.technicianRating ?? 0);

  useEffect(() => {
    if (state.ok) {
      toast.success(existing ? "Service experience updated" : "Thanks for sharing this");
      router.push(`/products/${product.slug}`);
      router.refresh();
    }
  }, [state, existing, product.slug, router]);

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

      <FormField label="Overall, how was the service?" required>
        <StarRatingInput value={rating} onChange={setRating} />
      </FormField>

      <FormField label="How did you contact them?" required>
        <ChipGroup options={CHANNEL} value={channel} onChange={setChannel} />
      </FormField>

      <FormField label="How quickly did they respond?" required>
        <ChipGroup options={RESPONSE_TIME} value={responseTime} onChange={setResponseTime} />
      </FormField>

      <FormField label="How did it end?" required>
        <ChipGroup options={REPAIR_OUTCOME} value={outcome} onChange={setOutcome} />
      </FormField>

      <FormField label="Was it under warranty?" required>
        <ChipGroup options={SERVICE_WARRANTY} value={warranty} onChange={setWarranty} />
      </FormField>

      <FormField label="Technician" hint="Optional — rate the technician if one was involved.">
        <MiniStars value={tech} onChange={setTech} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="What needed servicing?">
          <Input name="issue" maxLength={200} defaultValue={existing?.issue ?? ""} placeholder="e.g. Compressor" />
        </FormField>
        <FormField label="Cost paid (৳)" hint="0 if free.">
          <Input name="cost" type="number" min={0} defaultValue={existing?.cost ?? ""} />
        </FormField>
        <FormField label="Days to resolve">
          <Input
            name="durationDays"
            type="number"
            min={0}
            defaultValue={existing?.durationDays ?? ""}
          />
        </FormField>
      </div>

      <FormField label="Anything else?" hint="Optional.">
        <Textarea
          name="comment"
          rows={4}
          maxLength={4000}
          defaultValue={existing?.comment ?? ""}
          placeholder="How the whole process went — booking, updates, pickup, attitude…"
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
          {existing ? "Save changes" : "Publish"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(`/products/${product.slug}`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
