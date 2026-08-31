"use client";

import { useTranslations } from "next-intl";
import { deleteCategory, saveCategory } from "@/app/dashboard/(admin)/taxonomy/actions";
import { CrudTable, type Column } from "@/components/dashboard/catalog/crud-table";
import { Field } from "@/components/dashboard/catalog/field";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/catalog-types";

export function CategoryManager({ rows }: { rows: Category[] }) {
  const t = useTranslations("catalog.category");

  const columns: Column<Category>[] = [
    { header: t("colNameEn"), cell: (c) => <span className="font-medium">{c.nameEn}</span> },
    { header: t("colNameBn"), cell: (c) => c.nameBn },
    {
      header: t("colSlug"),
      cell: (c) => <code className="text-xs text-muted-foreground">{c.slug}</code>,
    },
    {
      header: t("colProducts"),
      className: "w-24",
      cell: (c) => <Badge variant="secondary">{c.productCount ?? 0}</Badge>,
    },
  ];

  return (
    <CrudTable
      title={t("title")}
      description={t("description")}
      rows={rows}
      columns={columns}
      getId={(c) => c.id}
      getName={(c) => c.nameEn}
      saveAction={saveCategory}
      deleteAction={deleteCategory}
      newLabel={t("newLabel")}
      renderFields={(c) => (
        <>
          <Field label={t("fieldNameEn")} name="nameEn" defaultValue={c?.nameEn} required />
          <Field label={t("fieldNameBn")} name="nameBn" defaultValue={c?.nameBn} required />
          <Field
            label={t("fieldSlug")}
            name="slug"
            defaultValue={c?.slug}
            placeholder="refrigerator"
            hint={t("fieldSlugHint")}
            required
          />
          <Field label={t("fieldIcon")} name="icon" defaultValue={c?.icon ?? ""} />
        </>
      )}
    />
  );
}
