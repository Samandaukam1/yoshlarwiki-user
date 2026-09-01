"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { CategoryIcon } from "@/components/ui";

type QuickResults = {
  candidates: {
    slug: string;
    full_name: string;
    title: string | null;
    portrait_url: string | null;
  }[];
  categories: { slug: string; name: string; icon: string }[];
};

const EMPTY: QuickResults = { candidates: [], categories: [] };

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QuickResults>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  const listId = useId();

  // Dialog yopilganda holat tozalanadi (render paytida moslash).
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) {
      setQuery("");
      setResults(EMPTY);
      setFailed(false);
      setLoading(false);
    }
  }

  const term = query.trim();
  const canSearch = term.length >= 2;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open]);


  // Kechiktirilgan qidiruv (debounce) + eski so'rovni bekor qilish.
  // Holat faqat timer ichida (asinxron) o'zgaradi.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("search failed");
        setResults((await res.json()) as QuickResults);
        setFailed(false);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setFailed(true);
          setResults(EMPTY);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    },
    [onClose],
  );

  if (!open) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!term) return;
    onClose();
    router.push(`/yoshlar?q=${encodeURIComponent(term)}`);
  };

  const hasResults =
    canSearch &&
    (results.candidates.length > 0 || results.categories.length > 0);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        aria-label="Qidiruvni yopish"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Saytdan qidirish"
        className="relative w-full max-w-xl overflow-hidden rounded-panel border border-line bg-surface shadow-yw-lg"
      >
        <form onSubmit={submit} className="flex items-center gap-3 px-5 py-4">
          <Search className="size-5 shrink-0 text-ink-3" strokeWidth={1.9} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Nomzod, kasb yoki kategoriya qidiring…"
            aria-label="Qidiruv soʻzi"
            aria-controls={listId}
            className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
          />
          {loading ? (
            <Loader2 className="size-4 animate-spin text-ink-3" />
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="grid size-8 place-items-center rounded-lg text-ink-3 hover:bg-surface-hover hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </form>

        <div id={listId} className="max-h-[52vh] overflow-y-auto border-t border-line">
          {!canSearch ? (
            <p className="px-5 py-8 text-center text-[13px] text-ink-3">
              Qidirish uchun kamida 2 ta harf kiriting.
            </p>
          ) : failed ? (
            <p className="px-5 py-8 text-center text-[13px] text-danger">
              Qidiruvda xatolik yuz berdi. Qayta urinib koʻring.
            </p>
          ) : !hasResults && !loading ? (
            <p className="px-5 py-8 text-center text-[13px] text-ink-3">
              «{term}» boʻyicha hech narsa topilmadi.
            </p>
          ) : (
            <>
              {results.candidates.length > 0 ? (
                <section className="p-2">
                  <h2 className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-3">
                    Yoshlar
                  </h2>
                  <ul>
                    {results.candidates.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/yoshlar/${item.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-surface-hover"
                        >
                          <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-surface-2">
                            {item.portrait_url ? (
                              <Image
                                src={item.portrait_url}
                                alt=""
                                fill
                                sizes="36px"
                                className="object-cover object-top"
                              />
                            ) : null}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[14px] font-semibold text-ink">
                              {item.full_name}
                            </span>
                            {item.title ? (
                              <span className="block truncate text-[12px] text-ink-3">
                                {item.title}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {results.categories.length > 0 ? (
                <section className="border-t border-line p-2">
                  <h2 className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-3">
                    Kategoriyalar
                  </h2>
                  <ul>
                    {results.categories.map((item) => (
                        <li key={item.slug}>
                          <Link
                            href={`/kategoriyalar/${item.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-surface-hover"
                          >
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-soft-fg">
                              <CategoryIcon
                                name={item.icon}
                                className="size-[18px]"
                              />
                            </span>
                            <span className="truncate text-[14px] font-medium text-ink">
                              {item.name}
                            </span>
                          </Link>
                        </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="border-t border-line p-2">
                <button
                  type="button"
                  onClick={submit}
                  className="w-full rounded-xl px-3 py-3 text-left text-[13px] font-medium text-accent-text hover:bg-surface-hover"
                >
                  «{term}» boʻyicha barcha natijalar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
