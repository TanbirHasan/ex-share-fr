"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function ReviewPhotoStrip({ images }: { images: { id: string; url: string }[] }) {
  const [active, setActive] = useState<string | null>(null);
  if (images.length === 0) return null;

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
        {images.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(img.url)}
            className="size-16 overflow-hidden rounded-lg border transition-opacity hover:opacity-90"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl border-0 bg-transparent p-0 shadow-none">
          {active && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={active}
              alt=""
              className="max-h-[80vh] w-full rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
