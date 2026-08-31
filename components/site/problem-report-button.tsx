"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { addProblemReport } from "@/app/(site)/contribute/problem-actions";
import { ChipGroup, FormField } from "@/components/site/review-inputs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PROBLEM_STARTED, WARRANTY_COVERED } from "@/lib/problem-types";

export function ProblemReportButton({
  problemId,
  hasReported,
  signedIn,
}: {
  problemId: string;
  hasReported: boolean;
  signedIn: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("problems");
  const tEnum = useTranslations("enums");
  const [open, setOpen] = useState(false);
  const [whenStarted, setWhenStarted] = useState("");
  const [warranty, setWarranty] = useState("");
  const [cost, setCost] = useState("");
  const [pending, start] = useTransition();

  const startedOptions = PROBLEM_STARTED.map((o) => ({
    value: o.value,
    label: tEnum(`problemStarted.${o.value}`),
  }));
  const warrantyOptions = WARRANTY_COVERED.map((o) => ({
    value: o.value,
    label: tEnum(`warrantyCovered.${o.value}`),
  }));

  if (hasReported) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="size-4" />
        {t("youReportedThis")}
      </span>
    );
  }

  function submit() {
    start(async () => {
      const res = await addProblemReport(problemId, {
        whenStarted: whenStarted || undefined,
        warrantyCovered: warranty || undefined,
        repairCost: cost ? Math.round(Number(cost)) : undefined,
      });
      if (res.ok) {
        setOpen(false);
        toast.success(t("thanksAddedCount"));
        router.refresh();
      } else {
        toast.error(res.error ?? t("couldNotSaveReport"));
      }
    });
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => (signedIn ? setOpen(true) : router.push("/login"))}
      >
        <Plus className="size-4" />{t("iHaveThisToo")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("addYourReport")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <FormField label={t("whenDidItStart")} hint={t("optional")}>
              <ChipGroup options={startedOptions} value={whenStarted} onChange={setWhenStarted} />
            </FormField>
            <FormField label={t("coveredByWarranty")} hint={t("optional")}>
              <ChipGroup options={warrantyOptions} value={warranty} onChange={setWarranty} />
            </FormField>
            <FormField label={t("repairCostField")} hint={t("optional")}>
              <Input
                type="number"
                min={0}
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button onClick={submit} disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {t("addReport")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
