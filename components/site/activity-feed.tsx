import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { Lightbulb, Star, TriangleAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ActivityItem, ActivityType } from "@/lib/activity-types";

const ICON: Record<ActivityType, typeof Star> = {
  review: Star,
  problem: TriangleAlert,
  solution: Lightbulb,
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export async function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) return null;

  const [t, format] = await Promise.all([
    getTranslations("home"),
    getFormatter(),
  ]);

  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {t("recentActivity")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("recentActivitySub")}</p>
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = ICON[item.type];
            const name = item.actor?.name?.trim() || t("anonUser");
            return (
              <li key={`${item.type}-${item.id}`}>
                <Link
                  href={item.href}
                  className="flex h-full flex-col rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="size-6 border">
                      <AvatarImage src={item.actor?.avatarUrl ?? undefined} alt={name} />
                      <AvatarFallback className="text-[10px]">
                        {initials(name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate font-medium text-foreground">{name}</span>
                    <span aria-hidden>·</span>
                    <span className="shrink-0">
                      {format.relativeTime(new Date(item.createdAt))}
                    </span>
                  </div>

                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <Icon className="size-3.5" />
                    {t(`activityVerb.${item.type}`)}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm font-medium text-foreground">
                    {item.headline}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {item.snippet}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
