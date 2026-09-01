"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Sahifada xatolik:", error);
  }, [error]);

  return (
    <div className="yw-container flex min-h-[52vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-danger-soft text-danger">
        <TriangleAlert className="size-7" strokeWidth={1.8} />
      </span>
      <h1 className="mt-5 text-[26px] font-bold tracking-[-0.02em] text-ink lg:text-[32px]">
        Nimadir notoʻgʻri ketdi
      </h1>
      <p className="mt-3 max-w-[440px] text-[15px] leading-relaxed text-ink-2">
        Sahifani yuklashda xatolik yuz berdi. Qayta urinib koʻring — muammo
        takrorlansa, birozdan soʻng qayting.
      </p>
      {error.digest ? (
        <p className="mt-2 text-[12px] text-ink-3">Xato kodi: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-accent px-6 text-[14px] font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
      >
        <RotateCcw className="size-4" strokeWidth={2} />
        Qayta urinish
      </button>
    </div>
  );
}
