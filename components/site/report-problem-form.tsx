"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [state, formAction, pending] = useActionState(submitProblem, { ok: false });

  const [category, setCategory] = useState<ProblemCategory | "">("");
  const [whenStarted, setWhenStarted] = useState("");
  const [warranty, setWarranty] = useState("");

  useEffect(() => {
    if (state.ok && state.slug) {
      toast.success("Problem reported — thank you");
      router.push(`/problems/${state.slug}`);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-7">
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="whenStarted" value={whenStarted} />
      <input type="hidden" name="warrantyCovered" value={warranty} />

      <FormField label="What kind of problem is it?" required>
        <ChipGroup options={PROBLEM_CATEGORIES} value={category} onChange={setCategory} />
      </FormField>

      <FormField label="Title" required hint="A short, searchable summary of the fault.">
        <Input
          name="title"
          maxLength={160}
          placeholder="e.g. Compressor hums loudly after about a year"
        />
      </FormField>

      <FormField label="What actually happened?" required>
        <Textarea
          name="description"
          rows={5}
          maxLength={4000}
          placeholder="When it happens, what it looks/sounds like, whether it's constant or intermittent…"
        />
      </FormField>

      <FormField label="When did it start?" hint="Optional — helps others see the pattern.">
        <ChipGroup options={PROBLEM_STARTED} value={whenStarted} onChange={setWhenStarted} />
      </FormField>

      <FormField label="Was it covered by warranty?" hint="Optional.">
        <ChipGroup options={WARRANTY_COVERED} value={warranty} onChange={setWarranty} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Repair cost (৳)" hint="Optional. 0 if it was free.">
          <Input name="repairCost" type="number" min={0} />
        </FormField>
      </div>

      <FormField label="Anything the service centre said or did?" hint="Optional.">
        <Textarea name="note" rows={3} maxLength={2000} placeholder="How the repair went, how long it took…" />
      </FormField>

      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          Report problem
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
