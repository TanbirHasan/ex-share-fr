"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitReview } from "@/app/(site)/contribute/actions";
import {
  ChipGroup,
  FormField,
  MiniStars,
  StarRatingInput,
  TagPicker,
} from "@/components/site/review-inputs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BUY_AGAIN_OPTIONS,
  CATEGORY_RATING_FIELDS,
  COMMON_CONS,
  COMMON_PROS,
  OWNERSHIP_DURATIONS,
  type OwnershipDuration,
  type Review,
  type WouldBuyAgain,
} from "@/lib/review-types";

export function ReviewForm({
  product,
  existing,
}: {
  product: { id: string; slug: string; name: string };
  existing: Review | null;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(submitReview, { ok: false });

  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [duration, setDuration] = useState<OwnershipDuration | "">(
    existing?.ownershipDuration ?? "",
  );
  const [buyAgain, setBuyAgain] = useState<WouldBuyAgain | "">(existing?.wouldBuyAgain ?? "");
  const [cat, setCat] = useState<Record<string, number>>(
    (existing?.categoryRatings as Record<string, number>) ?? {},
  );
  const [pros, setPros] = useState<string[]>(existing?.pros ?? []);
  const [cons, setCons] = useState<string[]>(existing?.cons ?? []);
  const [showPurchase, setShowPurchase] = useState(
    Boolean(existing?.purchasePrice || existing?.purchaseStore),
  );

  useEffect(() => {
    if (state.ok) {
      toast.success(existing ? "Review updated" : "Review published — thank you!");
      router.push(`/products/${product.slug}`);
      router.refresh();
    }
  }, [state, existing, product.slug, router]);

  const canSubmit = rating > 0 && duration !== "" && buyAgain !== "";

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="slug" value={product.slug} />
      {existing && <input type="hidden" name="reviewId" value={existing.id} />}
      <input type="hidden" name="rating" value={rating || ""} />
      <input type="hidden" name="ownershipDuration" value={duration} />
      <input type="hidden" name="wouldBuyAgain" value={buyAgain} />
      <input type="hidden" name="categoryRatings" value={JSON.stringify(cat)} />
      <input type="hidden" name="pros" value={JSON.stringify(pros)} />
      <input type="hidden" name="cons" value={JSON.stringify(cons)} />

      <FormField label="Overall rating" required>
        <StarRatingInput value={rating} onChange={setRating} />
      </FormField>

      <FormField label="How long have you owned it?" required>
        <ChipGroup options={OWNERSHIP_DURATIONS} value={duration} onChange={setDuration} />
      </FormField>

      <FormField label="Rate the details" hint="Optional — tap a star, tap again to clear.">
        <div className="divide-y rounded-xl border">
          {CATEGORY_RATING_FIELDS.map((f) => (
            <div key={f.key} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm">{f.label}</span>
              <MiniStars
                value={cat[f.key] ?? 0}
                onChange={(n) => setCat((c) => ({ ...c, [f.key]: n }))}
              />
            </div>
          ))}
        </div>
      </FormField>

      <FormField label="What's good about it?">
        <TagPicker options={COMMON_PROS} value={pros} onChange={setPros} tone="pro" />
      </FormField>

      <FormField label="What's not so good?">
        <TagPicker options={COMMON_CONS} value={cons} onChange={setCons} tone="con" />
      </FormField>

      <FormField label="Would you buy it again?" required>
        <ChipGroup options={BUY_AGAIN_OPTIONS} value={buyAgain} onChange={setBuyAgain} />
      </FormField>

      <FormField label="Anything else?" hint="Optional — a few sentences on your experience.">
        <Textarea
          name="comment"
          defaultValue={existing?.comment ?? ""}
          rows={4}
          maxLength={4000}
          placeholder="How has it held up? Any surprises, good or bad?"
        />
      </FormField>

      {showPurchase ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Price paid (৳)">
            <Input
              name="purchasePrice"
              type="number"
              min={0}
              defaultValue={existing?.purchasePrice ?? ""}
            />
          </FormField>
          <FormField label="Where did you buy it?">
            <Input
              name="purchaseStore"
              defaultValue={existing?.purchaseStore ?? ""}
              placeholder="Store or seller name"
            />
          </FormField>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowPurchase(true)}
          className="text-sm font-medium text-primary hover:underline"
        >
          + Add purchase details (optional)
        </button>
      )}

      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending || !canSubmit}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {existing ? "Save changes" : "Publish review"}
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
