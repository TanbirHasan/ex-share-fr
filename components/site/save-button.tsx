"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { toggleSave } from "@/app/(site)/saved-actions";
import { useSaved } from "@/components/site/saved-provider";
import { cn } from "@/lib/utils";

export function SaveButton({
  productId,
  className,
  showLabel = true,
}: {
  productId: string;
  className?: string;
  showLabel?: boolean;
}) {
  const router = useRouter();
  const { has, setSaved } = useSaved();
  const [pending, start] = useTransition();
  const saved = has(productId);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSaved(productId, !saved); // optimistic
    start(async () => {
      const res = await toggleSave(productId, saved);
      if (!res.ok) {
        setSaved(productId, saved); // revert
        if (res.error?.toLowerCase().includes("sign in")) router.push("/login");
        else toast.error(res.error ?? "Could not update.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save product"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-60",
        saved
          ? "border-primary bg-primary/10 text-primary"
          : "bg-background/90 hover:bg-muted",
        className,
      )}
    >
      {saved ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
      {showLabel && (saved ? "Saved" : "Save")}
    </button>
  );
}
