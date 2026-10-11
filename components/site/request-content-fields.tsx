"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ChipGroup,
  FormField,
  MiniStars,
  StarRatingInput,
  TagPicker,
} from "@/components/site/review-inputs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BUY_AGAIN_OPTIONS,
  CATEGORY_RATING_FIELDS,
  COMMON_CONS,
  COMMON_PROS,
  OWNERSHIP_DURATIONS,
  type OwnershipDuration,
  type WouldBuyAgain,
} from "@/lib/review-types";
import {
  PROBLEM_CATEGORIES,
  PROBLEM_STARTED,
  WARRANTY_COVERED,
  type ProblemCategory,
} from "@/lib/problem-types";
import { CHANNEL, REPAIR_OUTCOME, RESPONSE_TIME, SERVICE_WARRANTY } from "@/lib/service-types";

type Kind = "none" | "review" | "problem" | "service";

/**
 * The "share your experience" block on the product-request form — lets a
 * requester attach a review/problem/service draft for the product they're
 * asking about, even though it doesn't exist in the catalogue yet. Field
 * names match exactly what submitReview/submitProblem/submitServiceExperience
 * read from FormData, so the request-form's own server action can reuse the
 * same parsing helpers for whichever kind is active.
 */
export function RequestContentFields() {
  const t = useTranslations("requestForm");
  const tReview = useTranslations("reviewForm");
  const tProblem = useTranslations("problemForm");
  const tService = useTranslations("serviceForm");
  const tEnum = useTranslations("enums");

  const [kind, setKind] = useState<Kind>("none");

  // review state
  const [rating, setRating] = useState(0);
  const [duration, setDuration] = useState<OwnershipDuration | "">("");
  const [buyAgain, setBuyAgain] = useState<WouldBuyAgain | "">("");
  const [cat, setCat] = useState<Record<string, number>>({});
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);

  // problem state
  const [category, setCategory] = useState<ProblemCategory | "">("");
  const [whenStarted, setWhenStarted] = useState("");
  const [warrantyCovered, setWarrantyCovered] = useState("");

  // service state
  const [svcRating, setSvcRating] = useState(0);
  const [responseTime, setResponseTime] = useState("");
  const [channel, setChannel] = useState("");
  const [outcome, setOutcome] = useState("");
  const [svcWarranty, setSvcWarranty] = useState("");
  const [tech, setTech] = useState(0);

  const kindOptions: { value: Kind; label: string }[] = [
    { value: "none", label: t("shareExperience.none") },
    { value: "review", label: t("shareExperience.review") },
    { value: "problem", label: t("shareExperience.problem") },
    { value: "service", label: t("shareExperience.service") },
  ];

  const durationOptions = OWNERSHIP_DURATIONS.map((o) => ({
    value: o.value,
    label: tEnum(`ownership.${o.value}`),
  }));
  const buyAgainOptions = BUY_AGAIN_OPTIONS.map((o) => ({
    value: o.value,
    label: tEnum(`buyAgain.${o.value}`),
  }));
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
  const channelOptions = CHANNEL.map((o) => ({ value: o.value, label: tEnum(`channel.${o.value}`) }));
  const responseOptions = RESPONSE_TIME.map((o) => ({
    value: o.value,
    label: tEnum(`responseTime.${o.value}`),
  }));
  const outcomeOptions = REPAIR_OUTCOME.map((o) => ({
    value: o.value,
    label: tEnum(`repairOutcome.${o.value}`),
  }));
  const svcWarrantyOptions = SERVICE_WARRANTY.map((o) => ({
    value: o.value,
    label: tEnum(`serviceWarranty.${o.value}`),
  }));

  return (
    <div className="space-y-5 rounded-xl border bg-card p-5">
      <input type="hidden" name="contentType" value={kind === "none" ? "" : kind} />
      <FormField label={t("shareExperience.title")} hint={t("shareExperience.lede")}>
        <ChipGroup options={kindOptions} value={kind} onChange={setKind} />
      </FormField>

      {kind === "review" && (
        <div className="space-y-5 border-t pt-5">
          <input type="hidden" name="rating" value={rating || ""} />
          <input type="hidden" name="ownershipDuration" value={duration} />
          <input type="hidden" name="wouldBuyAgain" value={buyAgain} />
          <input type="hidden" name="categoryRatings" value={JSON.stringify(cat)} />
          <input type="hidden" name="pros" value={JSON.stringify(pros)} />
          <input type="hidden" name="cons" value={JSON.stringify(cons)} />

          <FormField label={tReview("overallRating")} required>
            <StarRatingInput value={rating} onChange={setRating} />
          </FormField>
          <FormField label={tReview("ownedHowLong")} required>
            <ChipGroup options={durationOptions} value={duration} onChange={setDuration} />
          </FormField>
          <FormField label={tReview("rateDetails")} hint={tReview("rateDetailsHint")}>
            <div className="divide-y rounded-xl border">
              {CATEGORY_RATING_FIELDS.map((f) => (
                <div key={f.key} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm">{tEnum(`categoryRating.${f.key}`)}</span>
                  <MiniStars
                    value={cat[f.key] ?? 0}
                    onChange={(n) => setCat((c) => ({ ...c, [f.key]: n }))}
                  />
                </div>
              ))}
            </div>
          </FormField>
          <FormField label={tReview("whatsGood")}>
            <TagPicker options={COMMON_PROS} value={pros} onChange={setPros} tone="pro" />
          </FormField>
          <FormField label={tReview("whatsBad")}>
            <TagPicker options={COMMON_CONS} value={cons} onChange={setCons} tone="con" />
          </FormField>
          <FormField label={tReview("buyAgainQ")} required>
            <ChipGroup options={buyAgainOptions} value={buyAgain} onChange={setBuyAgain} />
          </FormField>
          <FormField label={tReview("anythingElse")} hint={tReview("anythingElseHint")}>
            <Textarea name="comment" rows={4} maxLength={4000} placeholder={tReview("commentPlaceholder")} />
          </FormField>
        </div>
      )}

      {kind === "problem" && (
        <div className="space-y-5 border-t pt-5">
          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="whenStarted" value={whenStarted} />
          <input type="hidden" name="warrantyCovered" value={warrantyCovered} />

          <FormField label={tProblem("kindOfProblem")} required>
            <ChipGroup options={categoryOptions} value={category} onChange={setCategory} />
          </FormField>
          <FormField label={tProblem("title")} required hint={tProblem("titleHint")}>
            <Input name="title" maxLength={160} placeholder={tProblem("titlePlaceholder")} />
          </FormField>
          <FormField label={tProblem("whatHappened")} required>
            <Textarea
              name="description"
              rows={5}
              maxLength={4000}
              placeholder={tProblem("whatHappenedPlaceholder")}
            />
          </FormField>
          <FormField label={tProblem("whenStart")} hint={tProblem("whenStartHint")}>
            <ChipGroup options={startedOptions} value={whenStarted} onChange={setWhenStarted} />
          </FormField>
          <FormField label={tProblem("coveredWarranty")} hint={tProblem("optional")}>
            <ChipGroup options={warrantyOptions} value={warrantyCovered} onChange={setWarrantyCovered} />
          </FormField>
          <FormField label={tProblem("repairCost")} hint={tProblem("repairCostHint")}>
            <Input name="repairCost" type="number" min={0} />
          </FormField>
          <FormField label={tProblem("serviceCentreSaid")} hint={tProblem("optional")}>
            <Textarea name="note" rows={3} maxLength={2000} placeholder={tProblem("notePlaceholder")} />
          </FormField>
        </div>
      )}

      {kind === "service" && (
        <div className="space-y-5 border-t pt-5">
          <input type="hidden" name="rating" value={svcRating || ""} />
          <input type="hidden" name="responseTime" value={responseTime} />
          <input type="hidden" name="channel" value={channel} />
          <input type="hidden" name="repairOutcome" value={outcome} />
          <input type="hidden" name="warranty" value={svcWarranty} />
          <input type="hidden" name="technicianRating" value={tech || ""} />

          <FormField label={tService("overallHow")} required>
            <StarRatingInput value={svcRating} onChange={setSvcRating} />
          </FormField>
          <FormField label={tService("howContact")} required>
            <ChipGroup options={channelOptions} value={channel} onChange={setChannel} />
          </FormField>
          <FormField label={tService("howQuickly")} required>
            <ChipGroup options={responseOptions} value={responseTime} onChange={setResponseTime} />
          </FormField>
          <FormField label={tService("howEnd")} required>
            <ChipGroup options={outcomeOptions} value={outcome} onChange={setOutcome} />
          </FormField>
          <FormField label={tService("underWarranty")} required>
            <ChipGroup options={svcWarrantyOptions} value={svcWarranty} onChange={setSvcWarranty} />
          </FormField>
          <FormField label={tService("technician")} hint={tService("technicianHint")}>
            <MiniStars value={tech} onChange={setTech} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label={tService("whatServicing")}>
              <Input name="issue" maxLength={200} placeholder={tService("issuePlaceholder")} />
            </FormField>
            <FormField label={tService("costPaid")} hint={tService("costHint")}>
              <Input name="cost" type="number" min={0} />
            </FormField>
            <FormField label={tService("daysResolve")}>
              <Input name="durationDays" type="number" min={0} />
            </FormField>
          </div>
          <FormField label={tService("anythingElse")} hint={tService("optional")}>
            <Textarea name="comment" rows={4} maxLength={4000} placeholder={tService("commentPlaceholder")} />
          </FormField>
        </div>
      )}
    </div>
  );
}
