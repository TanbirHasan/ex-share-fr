"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { resolveReport } from "@/app/dashboard/(admin)/moderation/actions";
import { Button } from "@/components/ui/button";

export function ReportActions({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function run(resolution: "dismiss" | "remove_content" | "keep_content", label: string) {
    start(async () => {
      const res = await resolveReport(reportId, resolution);
      if (res.ok) {
        toast.success(label);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed");
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => run("keep_content", "Content kept")}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        Keep content
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => run("remove_content", "Content removed")}
      >
        <Trash2 className="size-4" />
        Remove content
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() => run("dismiss", "Report dismissed")}
      >
        <X className="size-4" />
        Dismiss report
      </Button>
    </div>
  );
}
