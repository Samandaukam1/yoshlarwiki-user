"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useState } from "react";

/**
 * Sertifikat havolasini ulashish: telefonda tizimning "Ulashish" oynasi,
 * kompyuterda — havolani nusxalash.
 */
export function ShareButton({
  url,
  title,
  className = "",
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const absolute = new URL(url, window.location.origin).toString();
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url: absolute });
        return;
      } catch {
        // Foydalanuvchi bekor qildi — nusxalashga o'tamiz.
      }
    }
    try {
      await navigator.clipboard.writeText(absolute);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Havolani nusxalang:", absolute);
    }
  };

  return (
    <button type="button" onClick={onClick} className={className} aria-live="polite">
      {copied ? (
        <>
          <Check className="size-[18px]" strokeWidth={2.2} />
          Nusxalandi
        </>
      ) : (
        <>
          <Share2 className="size-[18px] sm:hidden" strokeWidth={1.9} />
          <Link2 className="hidden size-[18px] sm:block" strokeWidth={1.9} />
          <span className="sm:hidden">Ulashish</span>
          <span className="hidden sm:inline">Havolani nusxalash</span>
        </>
      )}
    </button>
  );
}
