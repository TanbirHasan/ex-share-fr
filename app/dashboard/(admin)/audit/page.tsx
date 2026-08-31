import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const LIMIT = 50;

type Entry = {
  id: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  meta: Record<string, unknown>;
  ip: string | null;
  createdAt: string;
  actor: { id: string; name: string | null } | null;
};

type List = { data: Entry[]; total: number; limit: number; offset: number };

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const [t, format, list] = await Promise.all([
    getTranslations("dashboard.audit"),
    getFormatter(),
    apiGet<List>(`/api/v1/admin/audit-log?limit=${LIMIT}&offset=${(page - 1) * LIMIT}`),
  ]);

  const pages = Math.max(1, Math.ceil(list.total / LIMIT));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("lede")}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">{t("colWhen")}</TableHead>
              <TableHead className="w-32">{t("colWho")}</TableHead>
              <TableHead>{t("colAction")}</TableHead>
              <TableHead>{t("colTarget")}</TableHead>
              <TableHead>{t("colDetails")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                  {t("empty")}
                </TableCell>
              </TableRow>
            )}
            {list.data.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="text-xs text-muted-foreground">
                  {format.dateTime(new Date(e.createdAt), {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell className="text-xs">
                  {e.actor?.name?.trim() || t("system")}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono text-[11px]">
                    {e.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {e.targetType ? `${e.targetType} ${e.targetId?.slice(0, 8) ?? ""}` : "—"}
                </TableCell>
                <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                  {Object.keys(e.meta).length ? JSON.stringify(e.meta) : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {page} / {pages}
          </span>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" disabled={page <= 1}>
              <Link href={`/dashboard/audit?page=${page - 1}`}>
                <ChevronLeft className="size-4" /> {t("prev")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" disabled={page >= pages}>
              <Link href={`/dashboard/audit?page=${page + 1}`}>
                {t("next")} <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
