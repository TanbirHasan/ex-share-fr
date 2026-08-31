"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitReport } from "@/app/(site)/report-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const REASON_VALUES = [
  "spam",
  "fake",
  "offensive",
  "wrong_product",
  "duplicate",
  "other",
] as const;

export function ReportButton({
  targetType,
  targetId,
  className,
}: {
  targetType: "review" | "problem" | "solution";
  targetId: string;
  className?: string;
}) {
  const router = useRouter();
  const t = useTranslations("report");
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [pending, start] = useTransition();

  function onOpen() {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    setOpen(true);
  }

  function submit() {
    if (!reason) return;
    start(async () => {
      const res = await submitReport(targetType, targetId, reason, detail);
      if (res.ok) {
        toast.success(res.already ? t("alreadyReported") : t("thanksModerator"));
        setOpen(false);
        setReason("");
        setDetail("");
      } else {
        toast.error(res.error ?? t("couldNotSend"));
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground",
          className,
        )}
      >
        <Flag className="size-3" />
        {t("report")}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {targetType === "review"
                ? t("titleReview")
                : targetType === "problem"
                  ? t("titleProblem")
                  : t("titleSolution")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="reason">{t("reason")}</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason" className="w-full">
                  <SelectValue placeholder={t("pickReason")} />
                </SelectTrigger>
                <SelectContent>
                  {REASON_VALUES.map((rz) => (
                    <SelectItem key={rz} value={rz}>
                      {t(`reasons.${rz}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="detail">{t("detailsOptional")}</Label>
              <Textarea
                id="detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder={t("detailsPlaceholder")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={submit} disabled={pending || !reason}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {t("submitReport")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
