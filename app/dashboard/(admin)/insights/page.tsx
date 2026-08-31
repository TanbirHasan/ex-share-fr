import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiGet } from "@/lib/api";

export const dynamic = "force-dynamic";

type QueryRow = { query: string; count: number; lastAt: string };

type Insights = {
  days: number;
  totals: { searches: number; distinctQueries: number; zeroResultRate: number };
  zeroResults: QueryRow[];
  topQueries: (QueryRow & { avgResults: number })[];
};

export default async function InsightsPage() {
  const [t, format, data] = await Promise.all([
    getTranslations("dashboard.insights"),
    getFormatter(),
    apiGet<Insights>("/api/v1/admin/search-insights?days=30"),
  ]);

  const stat = (label: string, value: string) => (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("lede")}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("windowDays", { days: data.days })}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stat(t("totalSearches"), data.totals.searches.toLocaleString())}
        {stat(t("distinctQueries"), data.totals.distinctQueries.toLocaleString())}
        {stat(t("zeroRate"), `${data.totals.zeroResultRate}%`)}
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold tracking-tight">{t("zeroHeading")}</h2>
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("colQuery")}</TableHead>
                <TableHead className="w-20 text-right">{t("colCount")}</TableHead>
                <TableHead className="w-32">{t("colLast")}</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.zeroResults.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                    {t("emptyZero")}
                  </TableCell>
                </TableRow>
              )}
              {data.zeroResults.map((row) => (
                <TableRow key={row.query}>
                  <TableCell className="font-medium">{row.query}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.count}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format.dateTime(new Date(row.lastAt), { dateStyle: "medium" })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/contribute/request?q=${encodeURIComponent(row.query)}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      {t("requestCta")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold tracking-tight">{t("topHeading")}</h2>
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("colQuery")}</TableHead>
                <TableHead className="w-20 text-right">{t("colCount")}</TableHead>
                <TableHead className="w-28 text-right">{t("colAvgResults")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topQueries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">
                    {t("emptyTop")}
                  </TableCell>
                </TableRow>
              )}
              {data.topQueries.map((row) => (
                <TableRow key={row.query}>
                  <TableCell className="font-medium">{row.query}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.count}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.avgResults}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
