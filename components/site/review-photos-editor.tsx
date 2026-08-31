"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { deleteReviewPhoto, uploadReviewPhoto } from "@/app/(site)/review-photo-actions";
import { Button } from "@/components/ui/button";

const MAX = 4;

export function ReviewPhotosEditor({
  reviewId,
  images,
}: {
  reviewId: string;
  images: { id: string; url: string }[];
}) {
  const t = useTranslations("reviewForm");
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();

  const [list, setList] = useState(images);

  function upload(file: File) {
    const fd = new FormData();
    fd.set("file", file);
    start(async () => {
      const res = await uploadReviewPhoto(reviewId, fd);
      if (res.ok) {
        toast.success(t("photoAdded"));
        router.refresh();
      } else {
        toast.error(res.error ?? t("photoFailed"));
      }
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  function remove(id: string) {
    start(async () => {
      const res = await deleteReviewPhoto(reviewId, id);
      if (res.ok) {
        setList((prev) => prev.filter((x) => x.id !== id));
        router.refresh();
      } else {
        toast.error(res.error ?? t("photoFailed"));
      }
    });
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t("photos")}</p>
      <p className="text-xs text-muted-foreground">{t("photosHint")}</p>

      {list.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {list.map((img) => (
            <li key={img.id} className="group relative size-20 overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => remove(img.id)}
                disabled={pending}
                className="absolute top-1 right-1 rounded bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={t("removePhoto")}
              >
                <Trash2 className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />
      {list.length < MAX && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => fileRef.current?.click()}
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {t("uploadPhoto")}
        </Button>
      )}
    </div>
  );
}
