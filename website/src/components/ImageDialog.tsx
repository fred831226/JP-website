"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ImageDialogProps {
  src: string;
  alt: string;
  initiallyFailed?: boolean;
  onClose: () => void;
}

export default function ImageDialog({ src, alt, initiallyFailed = false, onClose }: ImageDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [failed, setFailed] = useState(initiallyFailed);

  useEffect(() => {
    const el = dialogRef.current;
    if (el) {
      el.showModal();
      closeRef.current?.focus();
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
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      aria-label="圖片放大檢視"
    >
      <div className="relative max-h-[90vh] max-w-[90vw]">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute -right-3 -top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg shadow-lg focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
          aria-label="關閉"
        >
          ✕
        </button>
        {failed ? (
          <div role="status" aria-label="圖片無法載入" className="flex min-h-48 min-w-64 items-center justify-center rounded-[var(--radius-lg)] bg-white p-8 text-[var(--color-text)]">圖片無法載入，請關閉後稍後再試。</div>
        ) : (
          <img src={src} alt={alt} onError={() => setFailed(true)} className="max-h-[85vh] max-w-[85vw] rounded-[var(--radius-lg)] object-contain" />
        )}
      </div>
    </dialog>
  );
}
