"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProduct } from "@/app/dashboard/(admin)/catalog/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n-content";
import { PRODUCT_STATUSES, type Brand, type Category, type Product } from "@/lib/catalog-types";

const ALL = "__all__";

function price(min: number | null, max: number | null) {
  if (min == null && max == null) return "—";
  if (min != null && max != null) return `৳${min.toLocaleString()} – ${max.toLocaleString()}`;
  return `৳${(min ?? max)!.toLocaleString()}`;
}

export function ProductTable({
  data,
  total,
  limit,
  offset,
  categories,
  query,
}: {
  data: Product[];
  total: number;
  limit: number;
  offset: number;
  categories: Category[];
  brands: Brand[];
  query: { q: string; status: string; categoryId: string };
}) {
  const router = useRouter();
  const params = useSearchParams();
  const t = useTranslations("catalog.table");
  const tEnum = useTranslations("enums");
  const locale = useLocale() as Locale;
  const [pendingDelete, startDelete] = useTransition();
  const [q, setQ] = useState(query.q);

  function setParam(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    if (!("page" in patch)) next.delete("page");
    router.push(`/dashboard/catalog?${next.toString()}`);
  }

  function remove(p: Product) {
    startDelete(async () => {
      const res = await deleteProduct(p.id);
      if (res.ok) {
        toast.success(t("productDeleted"));
        router.refresh();
      } else {
        toast.error(res.error ?? t("couldNotDelete"));
      }
    });
  }

  const page = Math.floor(offset / limit) + 1;
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <form
          className="relative min-w-56 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            setParam({ q });
          }}
        >
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchProducts")}
            className="pl-9"
          />
        </form>

        <Select
          value={query.status || ALL}
          onValueChange={(v) => setParam({ status: v === ALL ? null : v })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("allStatuses")}</SelectItem>
            {PRODUCT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {tEnum(`productStatus.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={query.categoryId || ALL}
          onValueChange={(v) => setParam({ categoryId: v === ALL ? null : v })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t("category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("allCategories")}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {localizedName(locale, c)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("colProduct")}</TableHead>
              <TableHead>{t("colCategory")}</TableHead>
              <TableHead>{t("colBrand")}</TableHead>
              <TableHead>{t("colPrice")}</TableHead>
              <TableHead>{t("colStatus")}</TableHead>
              <TableHead className="text-right">{t("colActions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                  {t("noProductsMatch")}
                </TableCell>
              </TableRow>
            )}
            {data.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Link
                    href={`/dashboard/catalog/${p.id}`}
                    className="font-medium hover:underline"
                  >
                    {p.name}
                  </Link>
                  {p.modelNo && (
                    <p className="text-xs text-muted-foreground">{p.modelNo}</p>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {localizedName(locale, p.category)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.brand.name}</TableCell>
                <TableCell className="text-sm tabular-nums">
                  {price(p.priceMin, p.priceMax)}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{tEnum(`productStatus.${p.status}`)}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon-sm" aria-label={t("edit")}>
                      <Link href={`/dashboard/catalog/${p.id}`}>
                        <Pencil className="size-3.5" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t("delete")}
                          disabled={pendingDelete}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("deleteTitle", { name: p.name })}</AlertDialogTitle>
                          <AlertDialogDescription>{t("deleteDesc")}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(p)}>
                            {t("delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{t("productCount", { count: total })}</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setParam({ page: String(page - 1) })}
          >
            <ChevronLeft className="size-4" /> {t("prev")}
          </Button>
          <span>
            {page} / {pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pages}
            onClick={() => setParam({ page: String(page + 1) })}
          >
            {t("next")} <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
