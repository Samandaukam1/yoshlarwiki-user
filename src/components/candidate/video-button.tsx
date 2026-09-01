"use client";

import { Play, X } from "lucide-react";
import { useEffect, useState } from "react";

/** YouTube / Vimeo havolasini o'rnatiladigan (embed) ko'rinishga aylantiradi. */
function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (host.endsWith("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (parsed.pathname.startsWith("/embed/")) return url;
    }
    if (host.endsWith("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}

export function VideoButton({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const embed = toEmbedUrl(url);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Embed qilib bo'lmasa — oddiy tashqi havola.
  if (!embed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 text-[14px] font-semibold text-ink transition-colors hover:text-accent-text"
      >
        Video
        <span className="grid size-7 place-items-center rounded-full border-[1.5px] border-current">
          <Play className="size-2.5 fill-current" strokeWidth={0} />
        </span>
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2.5 text-[14px] font-semibold text-ink transition-colors hover:text-accent-text"
      >
        Video
        <span className="grid size-7 place-items-center rounded-full border-[1.5px] border-current">
          <Play className="size-2.5 fill-current" strokeWidth={0} />
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Videoni yopish"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-black/70"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — video`}
            className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-card bg-black shadow-yw-lg"
          >
            <iframe
              src={embed}
              title={`${title} — video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              className="size-full"
            />
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Yopish"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
        </div>
      ) : null}
    </>
  );
}
