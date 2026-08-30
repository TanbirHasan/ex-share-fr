"use client";

import { deleteBrand, saveBrand } from "@/app/dashboard/(admin)/taxonomy/actions";
import { CrudTable, type Column } from "@/components/dashboard/catalog/crud-table";
import { Field, TextareaField } from "@/components/dashboard/catalog/field";
import { Badge } from "@/components/ui/badge";
import type { Brand } from "@/lib/catalog-types";

const columns: Column<Brand>[] = [
  { header: "Brand", cell: (b) => <span className="font-medium">{b.name}</span> },
  {
    header: "Slug",
    cell: (b) => <code className="text-xs text-muted-foreground">{b.slug}</code>,
  },
  {
    header: "Products",
    className: "w-24",
    cell: (b) => <Badge variant="secondary">{b.productCount ?? 0}</Badge>,
  },
];

export function BrandManager({ rows }: { rows: Brand[] }) {
  return (
    <CrudTable
      title="Brand"
      description="Manufacturers. Product records link to exactly one brand."
      rows={rows}
      columns={columns}
      getId={(b) => b.id}
      getName={(b) => b.name}
      saveAction={saveBrand}
      deleteAction={deleteBrand}
      newLabel="New brand"
      renderFields={(b) => (
        <>
          <Field label="Name" name="name" defaultValue={b?.name} placeholder="Walton" required />
          <Field
            label="Slug"
            name="slug"
            defaultValue={b?.slug}
            placeholder="walton"
            required
          />
          <Field label="Logo URL (optional)" name="logoUrl" defaultValue={b?.logoUrl ?? ""} />
          <TextareaField
            label="About (English, optional)"
            name="aboutEn"
            defaultValue={b?.aboutEn ?? ""}
            rows={2}
          />
          <TextareaField
            label="About (বাংলা, optional)"
            name="aboutBn"
            defaultValue={b?.aboutBn ?? ""}
            rows={2}
          />
        </>
      )}
    />
  );
}
