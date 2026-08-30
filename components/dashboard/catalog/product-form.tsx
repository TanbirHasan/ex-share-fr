"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveProduct } from "@/app/dashboard/(admin)/catalog/actions";
import { Field, TextareaField } from "@/components/dashboard/catalog/field";
import { SpecEditor } from "@/components/dashboard/catalog/spec-editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_STATUSES, type Brand, type Category, type Product } from "@/lib/catalog-types";

export function ProductForm({
  product,
  categories,
  brands,
}: {
  product?: Product;
  categories: Category[];
  brands: Brand[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveProduct, { ok: false });

  useEffect(() => {
    if (!state.ok) return;
    if (!product && state.id) {
      toast.success("Product created");
      router.push(`/dashboard/catalog/${state.id}`);
    } else {
      toast.success("Product saved");
      router.refresh();
    }
  }, [state, product, router]);

  return (
    <form action={formAction} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          defaultValue={product?.name}
          placeholder="Walton Smart Fridge WNM-2A3"
          required
        />
        <Field
          label="Slug"
          name="slug"
          defaultValue={product?.slug}
          placeholder="walton-wnm-2a3"
          required
        />
        <Field
          label="Model number"
          name="modelNo"
          defaultValue={product?.modelNo ?? ""}
          placeholder="WNM-2A3"
        />
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={product?.status ?? "active"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <Select name="categoryId" defaultValue={product?.categoryId} required>
            <SelectTrigger id="categoryId" className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="brandId">Brand</Label>
          <Select name="brandId" defaultValue={product?.brandId} required>
            <SelectTrigger id="brandId" className="w-full">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Field
          label="Price min (৳)"
          name="priceMin"
          type="number"
          min={0}
          defaultValue={product?.priceMin ?? ""}
        />
        <Field
          label="Price max (৳)"
          name="priceMax"
          type="number"
          min={0}
          defaultValue={product?.priceMax ?? ""}
        />
      </div>

      <TextareaField
        label="Warranty (free text)"
        name="warrantyText"
        defaultValue={product?.warrantyText ?? ""}
        rows={2}
        placeholder="2 years on compressor, 1 year comprehensive"
      />

      <SpecEditor initial={product?.spec} />

      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {product ? "Save changes" : "Create product"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/catalog")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
