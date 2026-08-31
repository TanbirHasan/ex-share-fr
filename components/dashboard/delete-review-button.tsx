"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteMyReview } from "@/app/dashboard/reviews/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteReviewButton({ id, productName }: { id: string; productName: string }) {
  const router = useRouter();
  const t = useTranslations("dashboard.delete");
  const [pending, start] = useTransition();

  function confirm() {
    start(async () => {
      const res = await deleteMyReview(id);
      if (res.ok) {
        toast.success(t("reviewDeleted"));
        router.refresh();
      } else {
        toast.error(res.error ?? t("couldNotDelete"));
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={t("deleteReview")} disabled={pending}>
          {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteReviewTitle", { name: productName })}</AlertDialogTitle>
          <AlertDialogDescription>{t("deleteReviewDesc")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={confirm}>{t("delete")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
