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
    // Mobil: butun ekranni egallaydigan, tepaga yopishgan to'liq (shaffof
    // bo'lmagan) varaq — orqadagi sahifa ko'rinmaydi, klaviatura ochilganda
    // ham qidiruv maydoni joyidan siljimaydi.
    // Desktop (sm+): avvalgidek markazdagi suzuvchi oyna.
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-bg [animation:yw-fade-in_0.18s_ease-out] sm:items-center sm:bg-transparent sm:px-4 sm:pt-[12vh]"
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        aria-label="Qidiruvni yopish"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 hidden cursor-default bg-ink/25 backdrop-blur-[2px] sm:block"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Saytdan qidirish"
        className="relative flex min-h-0 w-full flex-1 flex-col bg-bg sm:max-w-xl sm:flex-none sm:overflow-hidden sm:rounded-panel sm:border sm:border-line sm:bg-surface sm:shadow-yw-lg"
      >
        <form
          onSubmit={submit}
          className="flex items-center gap-2 border-b border-line px-4 pb-3 pt-[calc(env(safe-area-inset-top)+12px)] sm:gap-3 sm:border-b-0 sm:px-5 sm:py-4"
        >
          <label className="flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-[14px] border border-line bg-surface px-3.5 transition-colors focus-within:border-accent-text sm:h-auto sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0">
            <Search className="size-5 shrink-0 text-ink-3" strokeWidth={1.9} />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Ism, kasb yoki kategoriya…"
              aria-label="Qidiruv soʻzi"
              aria-controls={listId}
              // 16px — iOS Safari maydonga fokus berilganda sahifani
              // kattalashtirib (zoom) yubormasligi uchun.
              className="yw-bare-input min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-3 sm:text-[15px] [&::-webkit-search-cancel-button]:appearance-none"
            />
            {loading ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-ink-3" />
            ) : query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Qidiruvni tozalash"
                className="grid size-6 shrink-0 place-items-center rounded-full bg-ink-3/25 text-ink-2 transition-colors hover:bg-ink-3/40 sm:hidden"
              >
                <X className="size-3.5" strokeWidth={2.4} />
              </button>
            ) : null}
          </label>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 px-1.5 py-2 text-[15px] font-medium text-accent-text sm:hidden"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="hidden size-8 place-items-center rounded-lg text-ink-3 hover:bg-surface-hover hover:text-ink sm:grid"
          >
            <X className="size-4" />
          </button>
        </form>

        <div
          id={listId}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)] sm:max-h-[52vh] sm:flex-none sm:border-t sm:border-line sm:pb-0"
        >
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
