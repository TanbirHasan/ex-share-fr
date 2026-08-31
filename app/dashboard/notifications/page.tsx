import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { BellOff } from "lucide-react";
import { MarkAllRead } from "@/components/dashboard/mark-all-read";
import { NotificationLine } from "@/components/site/notification-line";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiGet } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { NotificationItem, NotificationList } from "@/lib/notification-types";

export const dynamic = "force-dynamic";

function href(n: NotificationItem): string {
  return typeof n.meta.href === "string" && n.meta.href ? n.meta.href : "#";
}

export default async function NotificationsPage() {
  const [t, format, list] = await Promise.all([
    getTranslations("notifications"),
    getFormatter(),
    apiGet<NotificationList>("/api/v1/me/notifications?limit=50"),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("page.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("page.lede")}</p>
        </div>
        {list.unreadCount > 0 && <MarkAllRead />}
      </div>

      {list.data.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed bg-card p-14 text-center">
          <BellOff className="size-7 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">{t("page.empty")}</p>
        </div>
      ) : (
        <ul className="divide-y rounded-xl border bg-card">
          {list.data.map((n) => {
            const name = n.actor?.name?.trim() || t("someone");
            return (
              <li key={n.id}>
                <Link
                  href={href(n)}
                  className={cn(
                    "flex gap-3 p-3.5 transition-colors hover:bg-accent",
                    !n.readAt && "bg-primary/[0.04]",
                  )}
                >
                  <Avatar className="size-8 shrink-0 border">
                    <AvatarImage src={n.actor?.avatarUrl ?? undefined} alt={name} />
                    <AvatarFallback className="text-xs">
                      {name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <NotificationLine notification={n} />
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {format.dateTime(new Date(n.createdAt), {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  {!n.readAt && (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
