"use client";

import { useTranslations } from "next-intl";
import { deleteBrand, saveBrand } from "@/app/dashboard/(admin)/taxonomy/actions";
import { CrudTable, type Column } from "@/components/dashboard/catalog/crud-table";
import { Field, TextareaField } from "@/components/dashboard/catalog/field";
import { Badge } from "@/components/ui/badge";
import type { Brand } from "@/lib/catalog-types";

export function BrandManager({ rows }: { rows: Brand[] }) {
  const t = useTranslations("catalog.brand");

  const columns: Column<Brand>[] = [
    { header: t("colBrand"), cell: (b) => <span className="font-medium">{b.name}</span> },
    {
      header: t("colSlug"),
      cell: (b) => <code className="text-xs text-muted-foreground">{b.slug}</code>,
    },
    {
      header: t("colProducts"),
      className: "w-24",
      cell: (b) => <Badge variant="secondary">{b.productCount ?? 0}</Badge>,
    },
  ];

  return (
    <CrudTable
      title={t("title")}
      description={t("description")}
      rows={rows}
      columns={columns}
      getId={(b) => b.id}
      getName={(b) => b.name}
      saveAction={saveBrand}
      deleteAction={deleteBrand}
      newLabel={t("newLabel")}
      renderFields={(b) => (
        <>
          <Field label={t("fieldName")} name="name" defaultValue={b?.name} placeholder="Walton" required />
          <Field
            label={t("fieldSlug")}
            name="slug"
            defaultValue={b?.slug}
            placeholder="walton"
            required
          />
          <Field label={t("fieldLogo")} name="logoUrl" defaultValue={b?.logoUrl ?? ""} />
          <TextareaField
            label={t("fieldAboutEn")}
            name="aboutEn"
            defaultValue={b?.aboutEn ?? ""}
            rows={2}
          />
          <TextareaField
            label={t("fieldAboutBn")}
            name="aboutBn"
            defaultValue={b?.aboutBn ?? ""}
            rows={2}
          />
        </>
      )}
    />
  );
}
