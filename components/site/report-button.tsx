"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

const REASONS = [
  { value: "spam", label: "Spam or advertising" },
  { value: "fake", label: "Fake or planted" },
  { value: "offensive", label: "Offensive or abusive" },
  { value: "wrong_product", label: "Wrong product" },
  { value: "duplicate", label: "Duplicate" },
  { value: "other", label: "Something else" },
];

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
        toast.success(
          res.already ? "You've already reported this." : "Thanks — a moderator will review it.",
        );
        setOpen(false);
        setReason("");
        setDetail("");
      } else {
        toast.error(res.error ?? "Could not send the report.");
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
        Report
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report this {targetType}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="reason">Reason</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason" className="w-full">
                  <SelectValue placeholder="Pick a reason" />
                </SelectTrigger>
                <SelectContent>
                  {REASONS.map((rz) => (
                    <SelectItem key={rz.value} value={rz.value}>
                      {rz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="detail">Details (optional)</Label>
              <Textarea
                id="detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Anything that helps the moderator…"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={submit} disabled={pending || !reason}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              Submit report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
