"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import type { Category, Region } from "@/lib/queries";

const SORTS = [
  { value: "recent", label: "Yangilari avval" },
  { value: "name", label: "Alifbo boʻyicha" },
  { value: "popular", label: "Ommabop" },
];

export function FilterBar({
  categories,
  regions,
}: {
  categories: Category[];
  regions: Region[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const urlQuery = params.get("q") ?? "";
  const [term, setTerm] = useState(urlQuery);
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);
  const [showFilters, setShowFilters] = useState(false);
  const firstRender = useRef(true);

  // URL tashqaridan o'zgarsa (orqaga/oldinga, havola) — maydonni moslaymiz.
  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery);
    setTerm(urlQuery);
  }

  const category = params.get("kategoriya") ?? "";
  const region = params.get("hudud") ?? "";
  const sort = params.get("tartib") ?? "recent";
  const activeFilters = [category, region].filter(Boolean).length;

  const push = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("sahifa");
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    });
  };

  // Qidiruv maydonini kechiktirib URL bilan sinxronlaymiz.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if ((params.get("q") ?? "") !== term) push({ q: term || null });
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const selectClass =
    "h-11 w-full rounded-[10px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none transition-colors hover:border-line-strong focus:border-accent-text";

  return (
    <div className="rounded-card border border-line bg-surface p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-ink-3"
            strokeWidth={1.9}
          />
          <input
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Ism, kasb, mutaxassislik yoki kalit soʻz…"
            aria-label="Yoshlar orasidan qidirish"
            className="h-11 w-full rounded-[10px] border border-line bg-surface pl-11 pr-10 text-[14px] text-ink outline-none transition-colors focus:border-accent-text placeholder:text-ink-3"
          />
          {pending ? (
            <Loader2 className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-ink-3" />
          ) : term ? (
            <button
              type="button"
              onClick={() => setTerm("")}
              aria-label="Qidiruvni tozalash"
              className="absolute right-2.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-ink-3 hover:bg-surface-hover hover:text-ink"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((open) => !open)}
          aria-expanded={showFilters}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[14px] font-medium text-ink transition-colors hover:bg-surface-hover lg:hidden"
        >
          <SlidersHorizontal className="size-4" strokeWidth={1.9} />
          Filtrlar
          {activeFilters > 0 ? (
            <span className="grid size-5 place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-fg">
              {activeFilters}
            </span>
          ) : null}
        </button>

        <div
          className={`grid gap-3 sm:grid-cols-3 lg:flex lg:w-auto ${
            showFilters ? "grid" : "hidden lg:flex"
          }`}
        >
          <select
            value={category}
            onChange={(event) => push({ kategoriya: event.target.value || null })}
            aria-label="Kategoriya boʻyicha filtr"
            className={`${selectClass} lg:w-[190px]`}
          >
            <option value="">Barcha kategoriyalar</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={region}
            onChange={(event) => push({ hudud: event.target.value || null })}
            aria-label="Hudud boʻyicha filtr"
            className={`${selectClass} lg:w-[180px]`}
          >
            <option value="">Barcha hududlar</option>
            {regions.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) =>
              push({ tartib: event.target.value === "recent" ? null : event.target.value })
            }
            aria-label="Tartiblash"
            className={`${selectClass} lg:w-[170px]`}
          >
            {SORTS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeFilters > 0 ? (
        <button
          type="button"
          onClick={() => push({ kategoriya: null, hudud: null })}
          className="mt-3 text-[13px] font-medium text-accent-text hover:underline"
        >
          Filtrlarni tozalash
        </button>
      ) : null}
    </div>
  );
}
