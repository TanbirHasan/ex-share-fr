"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import { toggleFollow } from "@/app/(site)/follow-actions";
import { useFollow } from "@/components/site/follow-provider";
import { cn } from "@/lib/utils";

export function FollowButton({
  kind,
  id,
  className,
}: {
  kind: "product" | "problem";
  id: string;
  className?: string;
}) {
  const router = useRouter();
  const t = useTranslations("buttons");
  const { has, set } = useFollow();
  const [pending, start] = useTransition();
  const following = has(kind, id);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    set(kind, id, !following); // optimistic
    start(async () => {
      const res = await toggleFollow(kind, id, following);
      if (!res.ok) {
        set(kind, id, following); // revert
        if (res.error?.toLowerCase().includes("sign in")) router.push("/login");
        else toast.error(res.error ?? t("couldNotUpdate"));
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={following}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60",
        following
          ? "border-primary bg-primary/10 text-primary"
          : "bg-background/90 hover:bg-muted",
        className,
      )}
    >
      {following ? <BellOff className="size-3.5" /> : <Bell className="size-3.5" />}
      {following ? t("following") : t("follow")}
    </button>
  );
}
