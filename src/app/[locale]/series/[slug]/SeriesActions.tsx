"use client";

import { useState } from "react";
import ImageDialog from "@/components/ImageDialog";

export default function SeriesActions({ image, name }: { image: string; name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex aspect-[4/3] w-full max-w-lg items-center justify-center overflow-hidden rounded-[var(--product-card-radius)] bg-[var(--color-surface)] shadow-[var(--product-card-shadow)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
        aria-label={`放大檢視 ${name} 圖片`}
      >
        <img src={image} alt={`${name} 產品圖`} className="h-full w-full object-contain p-4" />
      </button>
      {open && <ImageDialog src={image} alt={`${name} 產品圖`} onClose={() => setOpen(false)} />}
    </>
  );
}
