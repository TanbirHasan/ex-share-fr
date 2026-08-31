import { useTranslations } from "next-intl";
import { Clock, Star, Wrench } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/format";
import { type ServiceExperience } from "@/lib/service-types";

export function ServiceCard({ item }: { item: ServiceExperience }) {
  const t = useTranslations("service");
  const tEnum = useTranslations("enums");
  const name = item.author.name?.trim() || t("anonUser");
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");

  return (
    <article className="rounded-xl border bg-card p-4">
      <header className="flex items-center gap-3">
        <Avatar className="size-8 border">
          <AvatarImage src={item.author.avatarUrl ?? undefined} alt={name} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          {item.rating.toFixed(1)}
        </span>
      </header>

      <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
        <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
          {tEnum(`channel.${item.channel}`)}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
          {tEnum(`responseTime.${item.responseTime}`)}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
          {tEnum(`repairOutcome.${item.repairOutcome}`)}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
          {t("warrantyChip", { value: tEnum(`serviceWarranty.${item.warranty}`) })}
        </span>
      </div>

      {item.issue && (
        <p className="mt-2 text-xs text-muted-foreground">
          {t("serviced", { issue: item.issue })}
        </p>
      )}
      {item.comment && (
        <p className="mt-2 text-sm whitespace-pre-line text-foreground/90">{item.comment}</p>
      )}

      <footer className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {item.technicianRating != null && (
          <span className="inline-flex items-center gap-1">
            <Wrench className="size-3.5" />
            {t("technician", { rating: item.technicianRating })}
          </span>
        )}
        {item.durationDays != null && (
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {t("days", { count: item.durationDays })}
          </span>
        )}
        {item.cost != null && (
          <span>{item.cost === 0 ? t("free") : `৳${item.cost.toLocaleString()}`}</span>
        )}
      </footer>
    </article>
  );
}
