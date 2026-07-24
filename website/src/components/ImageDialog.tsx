"use client";

import { useCallback, useEffect, useRef } from "react";

interface ImageDialogProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageDialog({ src, alt, onClose }: ImageDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (el) {
      el.showModal();
      el.focus();
    }
  }, []);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/70 p-4 backdrop:bg-black/50"
      onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}
      onKeyDown={handleKey}
      aria-label="圖片放大檢視"
    >
      <div className="relative max-h-[90vh] max-w-[90vw]">
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-lg focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
          aria-label="關閉"
        >
          ✕
        </button>
        <img src={src} alt={alt} className="max-h-[85vh] max-w-[85vw] rounded-[var(--radius-lg)] object-contain" />
      </div>
    </dialog>
  );
}
