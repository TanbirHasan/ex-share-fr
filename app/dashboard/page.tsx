import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import {
  ArrowRight,
  LifeBuoy,
  MessageSquareText,
  PenLine,
  ShieldCheck,
  Star,
} from "lucide-react";
import { auth } from "@/auth";
import { apiFetch } from "@/lib/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Me = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  reviewCount: number;
  problemCount: number;
  solutionCount: number;
  createdAt: string;
};

export default async function DashboardOverview() {
  const [session, t, format, res] = await Promise.all([
    auth(),
    getTranslations("dashboard.home"),
    getFormatter(),
    apiFetch("/api/v1/me"),
  ]);
  const me: Me | null = res.ok ? await res.json() : null;

  const firstName = (session?.user?.name ?? t("there")).split(" ")[0];

  const stats = [
    { label: t("reviews"), value: me?.reviewCount ?? 0, icon: Star, href: "/dashboard/reviews" },
    { label: t("problems"), value: me?.problemCount ?? 0, icon: MessageSquareText, href: "/dashboard/problems" },
    { label: t("solutions"), value: me?.solutionCount ?? 0, icon: LifeBuoy, href: "/dashboard/solutions" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("welcomeBack", { name: firstName })}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("lede")}
            {session?.user?.id && (
              <>
                {" "}
                <Link href={`/u/${session.user.id}`} className="text-primary hover:underline">
                  {t("viewPublicProfile")}
                </Link>
              </>
            )}
          </p>
        </div>
        <Button asChild>
          <Link href="/contribute">
            <PenLine className="size-4" /> {t("shareExperience")}
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{value}</p>
                <Link
                  href={href}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {label} →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {me?.role === "admin" && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-wrap items-center gap-3 p-5">
            <ShieldCheck className="size-5 text-primary" />
            <p className="text-sm font-medium">{t("adminAccess")}</p>
            <Button asChild size="sm" variant="outline" className="ml-auto">
              <Link href="/dashboard/catalog">
                {t("openCatalog")} <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Account detail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("account")}</CardTitle>
          <CardDescription>{t("accountDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label={t("name")} value={session?.user?.name ?? "—"} />
          <Row label={t("email")} value={session?.user?.email ?? "—"} />
          <Row
            label={t("role")}
            value={
              <Badge variant={me?.role === "admin" ? "default" : "secondary"}>
                {me?.role ?? session?.user?.role ?? "user"}
              </Badge>
            }
          />
          <Row
            label={t("userId")}
            value={<code className="font-mono text-xs">{session?.user?.id ?? "—"}</code>}
          />
          <Row
            label={t("memberSince")}
            value={
              me?.createdAt
                ? format.dateTime(new Date(me.createdAt), {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"
            }
          />
          {!me && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-destructive">
              {t("backendRejected", { status: res.status })}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
