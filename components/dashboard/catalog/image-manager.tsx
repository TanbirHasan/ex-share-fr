"use client";

import { useState, useTransition } from "react";
import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addImage, deleteImage } from "@/app/dashboard/(admin)/catalog/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductImage } from "@/lib/catalog-types";

export function ImageManager({
  productId,
  images,
  primaryImage,
}: {
  productId: string;
  images: ProductImage[];
  primaryImage: string | null;
}) {
  const [url, setUrl] = useState("");
  const [pending, start] = useTransition();

  function add() {
    const value = url.trim();
    if (!value) return;
    start(async () => {
      const res = await addImage(productId, value);
      if (res.ok) {
        setUrl("");
        toast.success("Image added");
      } else {
        toast.error(res.error ?? "Could not add image");
      }
    });
  }

  function remove(imageId: string) {
    start(async () => {
      const res = await deleteImage(productId, imageId);
      if (res.ok) toast.success("Image removed");
      else toast.error(res.error ?? "Could not remove image");
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="https://…/photo.jpg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <Button type="button" onClick={add} disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          Add
        </Button>
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground">No images yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img) => (
            <li
              key={img.id}
              className="group relative overflow-hidden rounded-lg border bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="aspect-square w-full object-cover" />
              {primaryImage === img.url && (
                <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                  <Star className="size-3" /> Primary
                </span>
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => remove(img.id)}
                aria-label="Remove image"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
