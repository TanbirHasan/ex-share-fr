"use client";

import { deleteCategory, saveCategory } from "@/app/dashboard/(admin)/taxonomy/actions";
import { CrudTable, type Column } from "@/components/dashboard/catalog/crud-table";
import { Field } from "@/components/dashboard/catalog/field";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/catalog-types";

const columns: Column<Category>[] = [
  { header: "Name (EN)", cell: (c) => <span className="font-medium">{c.nameEn}</span> },
  { header: "Name (BN)", cell: (c) => c.nameBn },
  {
    header: "Slug",
    cell: (c) => <code className="text-xs text-muted-foreground">{c.slug}</code>,
  },
  {
    header: "Products",
    className: "w-24",
    cell: (c) => <Badge variant="secondary">{c.productCount ?? 0}</Badge>,
  },
];

export function CategoryManager({ rows }: { rows: Category[] }) {
  return (
    <CrudTable
      title="Category"
      description="Everyday electronics groupings. Names are shown to users in both languages."
      rows={rows}
      columns={columns}
      getId={(c) => c.id}
      getName={(c) => c.nameEn}
      saveAction={saveCategory}
      deleteAction={deleteCategory}
      newLabel="New category"
      renderFields={(c) => (
        <>
          <Field label="Name (English)" name="nameEn" defaultValue={c?.nameEn} required />
          <Field label="Name (বাংলা)" name="nameBn" defaultValue={c?.nameBn} required />
          <Field
            label="Slug"
            name="slug"
            defaultValue={c?.slug}
            placeholder="refrigerator"
            hint="Lowercase letters, digits and hyphens."
            required
          />
          <Field label="Icon key (optional)" name="icon" defaultValue={c?.icon ?? ""} />
        </>
      )}
    />
  );
}
