"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useFormatter, useTranslations } from "next-intl";
import { Bell, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notificationHref, useNotificationText } from "@/components/site/notification-text";
import type { NotificationItem, NotificationList } from "@/lib/notification-types";
import { cn } from "@/lib/utils";

const POLL_MS = 60_000;

export function NotificationBell({ className }: { className?: string }) {
  const { status } = useSession();
  const t = useTranslations("notifications");
  const format = useFormatter();
  const text = useNotificationText();

  const [count, setCount] = useState(0);
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshCount = useCallback(() => {
    fetch("/api/notifications/count")
      .then((r) => (r.ok ? r.json() : { count: 0 }))
      .then((d: { count?: number }) => setCount(d.count ?? 0))
      .catch(() => {});
  }, []);

  const loadList = useCallback(() => {
    fetch("/api/notifications?limit=12")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: NotificationList | null) => {
        if (d) {
          setItems(d.data);
          setCount(d.unreadCount);
        }
      })
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    refreshCount();
    timer.current = setInterval(refreshCount, POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && refreshCount();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      if (timer.current) clearInterval(timer.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [status, refreshCount]);

  if (status !== "authenticated") return null;

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (next) loadList();
  }

  function markAllRead() {
    setCount(0);
    setItems((prev) => prev?.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })) ?? null);
    fetch("/api/notifications", { method: "POST", body: "{}" }).catch(() => {});
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
          aria-label={t("aria")}
        >
          <Bell className="size-4" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-medium">{t("bell.title")}</span>
          {count > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Check className="size-3" />
              {t("bell.markAllRead")}
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {items === null ? (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">…</p>
          ) : items.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              {t("bell.empty")}
            </p>
          ) : (
            <ul>
              {items.map((n) => {
                const name = n.actor?.name?.trim() || t("someone");
                return (
                  <li key={n.id}>
                    <Link
                      href={notificationHref(n)}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex gap-2.5 px-3 py-2.5 hover:bg-accent",
                        !n.readAt && "bg-primary/[0.04]",
                      )}
                    >
                      <Avatar className="size-7 shrink-0 border">
                        <AvatarImage src={n.actor?.avatarUrl ?? undefined} alt={name} />
                        <AvatarFallback className="text-[10px]">
                          {name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-snug text-foreground">{text(n)}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {format.relativeTime(new Date(n.createdAt))}
                        </p>
                      </div>
                      {!n.readAt && (
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <Link
          href="/dashboard/notifications"
          onClick={() => setOpen(false)}
          className="block border-t px-3 py-2 text-center text-xs font-medium text-primary hover:underline"
        >
          {t("bell.viewAll")}
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
