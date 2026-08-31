import { getFormatter, getTranslations } from "next-intl/server";
import { Search } from "lucide-react";
import { UserRowActions } from "@/components/dashboard/user-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

type Role = "user" | "trusted" | "moderator" | "admin";

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: Role;
  suspendedAt: string | null;
  reviewCount: number;
  problemCount: number;
  solutionCount: number;
  createdAt: string;
};

type List = { data: AdminUser[]; total: number; limit: number; offset: number };

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [t, format, list] = await Promise.all([
    getTranslations("dashboard.userMgmt"),
    getFormatter(),
    apiGet<List>(
      `/api/v1/admin/users?limit=100${q ? `&q=${encodeURIComponent(q)}` : ""}`,
    ),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("lede")}</p>
      </div>

      <form action="/dashboard/users" className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={q}
          placeholder={t("searchPlaceholder")}
          className="pl-9"
        />
      </form>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("colUser")}</TableHead>
              <TableHead>{t("colActivity")}</TableHead>
              <TableHead>{t("colJoined")}</TableHead>
              <TableHead className="text-right">{t("colRole")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                  {t("empty")}
                </TableCell>
              </TableRow>
            )}
            {list.data.map((u) => {
              const name = u.name?.trim() || u.email;
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 border">
                        <AvatarImage src={u.avatarUrl ?? undefined} alt={name} />
                        <AvatarFallback className="text-xs">{initials(name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{name}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      {u.suspendedAt && (
                        <Badge variant="destructive" className="shrink-0">
                          {t("suspended")}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {t("activitySummary", {
                      reviews: u.reviewCount,
                      problems: u.problemCount,
                      solutions: u.solutionCount,
                    })}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format.dateTime(new Date(u.createdAt), { dateStyle: "medium" })}
                  </TableCell>
                  <TableCell>
                    {u.role === "admin" ? (
                      <div className="flex justify-end">
                        <Badge>{t("role.admin")}</Badge>
                      </div>
                    ) : (
                      <UserRowActions
                        id={u.id}
                        role={u.role}
                        suspended={Boolean(u.suspendedAt)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
