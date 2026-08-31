"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUser } from "@/app/dashboard/(admin)/users/actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Role = "user" | "trusted" | "moderator" | "admin";
const ROLES: Role[] = ["user", "trusted", "moderator", "admin"];

export function UserRowActions({
  id,
  role,
  suspended,
}: {
  id: string;
  role: Role;
  suspended: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("dashboard.userMgmt");
  const [pending, start] = useTransition();

  function apply(patch: { role?: Role; suspended?: boolean }, label: string) {
    start(async () => {
      const res = await updateUser(id, patch);
      if (res.ok) {
        toast.success(label);
        router.refresh();
      } else {
        toast.error(res.error ?? t("failed"));
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Select
        value={role}
        disabled={pending}
        onValueChange={(v) => apply({ role: v as Role }, t("roleChanged"))}
      >
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((rr) => (
            <SelectItem key={rr} value={rr} className="text-xs">
              {t(`role.${rr}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant={suspended ? "outline" : "ghost"}
        disabled={pending}
        onClick={() => apply({ suspended: !suspended }, t("statusChanged"))}
      >
        {pending && <Loader2 className="size-3.5 animate-spin" />}
        {suspended ? t("unsuspend") : t("suspend")}
      </Button>
    </div>
  );
}
