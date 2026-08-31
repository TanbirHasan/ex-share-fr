import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, LifeBuoy, MessageSquareText, ShieldCheck, Star, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ApiError, apiGet } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { BADGE_ICON, reputationLevel, type Profile } from "@/lib/reputation";

async function load(id: string): Promise<Profile | null> {
  try {
    return await apiGet<Profile>(`/api/v1/users/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await load(id);
  return { title: p ? p.name ?? "Contributor" : "Profile not found" };
}

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await load(id);
  if (!p) notFound();

  const name = p.name?.trim() || "ExperienceHub user";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");
  const level = reputationLevel(p.score);

  const stats = [
    { label: "Reviews", value: p.counts.reviews, icon: Star },
    { label: "Problems", value: p.counts.problems, icon: MessageSquareText },
    { label: "Solutions", value: p.counts.solutions, icon: LifeBuoy },
    { label: "Found helpful", value: p.counts.helpfulReceived, icon: ThumbsUp },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="flex items-center gap-4">
        <Avatar className="size-16 border">
          <AvatarImage src={p.avatarUrl ?? undefined} alt={name} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
            {p.staff && (
              <Badge variant="secondary" className="gap-1">
                <ShieldCheck className="size-3" /> Staff
              </Badge>
            )}
          </div>
          <p className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium text-primary">
              <BadgeCheck className="size-3.5" />
              {level.label}
            </span>
            · {p.score} points · joined {formatDate(p.createdAt)}
          </p>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-card p-4">
            <Icon className="size-4 text-primary" />
            <p className="mt-2 text-xl font-semibold tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {p.badges.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold tracking-tight">Badges</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {p.badges.map((b) => {
              const Icon = BADGE_ICON[b.key] ?? BadgeCheck;
              return (
                <div
                  key={b.key}
                  className="flex items-start gap-3 rounded-xl border bg-card p-3"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{b.label}</p>
                    <p className="text-xs text-muted-foreground">{b.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-8 space-y-8">
        {p.recent.reviews.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-semibold tracking-tight">Recent reviews</h2>
            <ul className="space-y-2">
              {p.recent.reviews.map((r) => (
                <li key={r.id} className="rounded-xl border bg-card p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {r.rating}.0
                    </span>
                    <Link
                      href={`/products/${r.product.slug}`}
                      className="truncate text-primary hover:underline"
                    >
                      {r.product.name}
                    </Link>
                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                  {r.comment && (
                    <p className="mt-1 line-clamp-2 text-muted-foreground">{r.comment}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {p.recent.problems.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-semibold tracking-tight">Reported problems</h2>
            <ul className="space-y-2">
              {p.recent.problems.map((pr) => (
                <li key={pr.id} className="rounded-xl border bg-card p-3 text-sm">
                  <Link href={`/problems/${pr.slug}`} className="font-medium hover:underline">
                    {pr.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {pr.productName} · {pr.reportCount} report{pr.reportCount === 1 ? "" : "s"} ·{" "}
                    {formatDate(pr.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {p.recent.solutions.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-semibold tracking-tight">Solutions shared</h2>
            <ul className="space-y-2">
              {p.recent.solutions.map((s) => (
                <li key={s.id} className="rounded-xl border bg-card p-3 text-sm">
                  <Link
                    href={`/problems/${s.problem.slug}`}
                    className="font-medium hover:underline"
                  >
                    {s.problem.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-muted-foreground">{s.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {s.workedCount} confirmed working · {s.helpfulCount} helpful ·{" "}
                    {formatDate(s.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {p.recent.reviews.length === 0 &&
          p.recent.problems.length === 0 &&
          p.recent.solutions.length === 0 && (
            <p className="rounded-xl border border-dashed bg-card p-6 text-center text-sm text-muted-foreground">
              No public contributions yet.
            </p>
          )}
      </section>
    </div>
  );
}
