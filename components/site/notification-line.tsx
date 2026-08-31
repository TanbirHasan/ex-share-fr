"use client";

import { useNotificationText } from "@/components/site/notification-text";
import type { NotificationItem } from "@/lib/notification-types";

export function NotificationLine({ notification }: { notification: NotificationItem }) {
  const text = useNotificationText();
  return <p className="text-sm leading-snug text-foreground">{text(notification)}</p>;
}
