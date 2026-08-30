"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  const [open, setOpen] = useState(false);
  const [whenStarted, setWhenStarted] = useState("");
  const [warranty, setWarranty] = useState("");
  const [cost, setCost] = useState("");
  const [pending, start] = useTransition();

  if (hasReported) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="size-4" />
        You reported this
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
        toast.success("Thanks — added to the count");
        router.refresh();
      } else {
        toast.error(res.error ?? "Could not save your report.");
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
        <Plus className="size-4" />I have this too
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add your report</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <FormField label="When did it start?" hint="Optional.">
              <ChipGroup options={PROBLEM_STARTED} value={whenStarted} onChange={setWhenStarted} />
            </FormField>
            <FormField label="Covered by warranty?" hint="Optional.">
              <ChipGroup options={WARRANTY_COVERED} value={warranty} onChange={setWarranty} />
            </FormField>
            <FormField label="Repair cost (৳)" hint="Optional.">
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
              Add report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
