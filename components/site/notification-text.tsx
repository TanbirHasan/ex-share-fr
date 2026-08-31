"use client";

import { useTranslations } from "next-intl";
import type { NotificationItem } from "@/lib/notification-types";

/** Builds the localized one-line text for a notification from its type + meta. */
export function useNotificationText() {
  const t = useTranslations("notifications");

  return (n: NotificationItem): string => {
    const actor = n.actor?.name?.trim() || t("someone");
    const kindRaw = typeof n.meta.kind === "string" ? n.meta.kind : "";
    const kind = kindRaw ? t(`kind.${kindRaw}`) : "";
    const title = typeof n.meta.title === "string" ? n.meta.title : "";
    const price =
      typeof n.meta.price === "number" ? `৳${n.meta.price.toLocaleString("en-US")}` : "";
    return t(`text.${n.type}`, { actor, kind, title, price });
  };
}

export function notificationHref(n: NotificationItem): string {
  return typeof n.meta.href === "string" && n.meta.href ? n.meta.href : "/dashboard/notifications";
}
