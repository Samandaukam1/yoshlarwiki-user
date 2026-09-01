import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

import { CandidateCard, CandidateCardSkeleton } from "@/components/cards";
import { FilterBar } from "@/components/directory/filter-bar";
import { EmptyState, Eyebrow } from "@/components/ui";
import { getCategories, getRegions, searchCandidates } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Yoshlar",
  description:
    "Iqtidorli va faol yoshlar katalogi. Ism, kasb, kategoriya va hudud boʻyicha qidiring.",
  alternates: { canonical: "/yoshlar" },
};

const PER_PAGE = 12;

function Pagination({
  page,
  total,
  params,
}: {
  page: number;
  total: number;
  params: URLSearchParams;
}) {
  const pages = Math.ceil(total / PER_PAGE);
  if (pages <= 1) return null;

  const href = (target: number) => {
    const next = new URLSearchParams(params.toString());
    if (target <= 1) next.delete("sahifa");
    else next.set("sahifa", String(target));
    const query = next.toString();
    return `/yoshlar${query ? `?${query}` : ""}`;
  };

  const numbers = Array.from({ length: pages }, (_, index) => index + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1,
  );

  return (
    <nav aria-label="Sahifalar" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          aria-label="Oldingi sahifa"
          className="grid size-10 place-items-center rounded-[10px] border border-line bg-surface text-ink transition-colors hover:bg-surface-hover"
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : null}

      {numbers.map((n, index) => (
        <span key={n} className="flex items-center gap-1.5">
          {index > 0 && n - numbers[index - 1] > 1 ? (
            <span className="px-1 text-ink-3">…</span>
          ) : null}
          <Link
            href={href(n)}
            aria-current={n === page ? "page" : undefined}
            className={`grid size-10 place-items-center rounded-[10px] border text-[14px] font-medium transition-colors ${
              n === page
                ? "border-accent bg-accent text-accent-fg"
                : "border-line bg-surface text-ink hover:bg-surface-hover"
            }`}
          >
            {n}
          </Link>
        </span>
      ))}

      {page < pages ? (
        <Link
          href={href(page + 1)}
          aria-label="Keyingi sahifa"
          className="grid size-10 place-items-center rounded-[10px] border border-line bg-surface text-ink transition-colors hover:bg-surface-hover"
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : null}
    </nav>
  );
}

async function Results({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const get = (key: string) => {
    const value = searchParams[key];
    return typeof value === "string" ? value : undefined;
  };

  const query = get("q");
  const category = get("kategoriya");
  const region = get("hudud");
  const sort = get("tartib");
  const page = Math.max(1, Number.parseInt(get("sahifa") ?? "1", 10) || 1);

  const results = await searchCandidates({
    query,
    category,
    region,
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
    sort: sort === "name" || sort === "popular" ? sort : "recent",
  });

  const urlParams = new URLSearchParams();
  if (query) urlParams.set("q", query);
  if (category) urlParams.set("kategoriya", category);
  if (region) urlParams.set("hudud", region);
  if (sort) urlParams.set("tartib", sort);

  if (results.items.length === 0) {
    return (
      <div className="mt-6">
        <EmptyState
          icon={Users}
          title={
            query
              ? `«${query}» boʻyicha hech narsa topilmadi`
              : "Hozircha profillar yoʻq"
          }
          description={
            query || category || region
              ? "Boshqa kalit soʻz yoki filtrlarni sinab koʻring."
              : "Birinchilardan boʻlib oʻzingiz haqingizda maʼlumot qoldiring."
          }
          action={{ href: "/ariza", label: "Ariza qoldirish" }}
        />
      </div>
    );
  }

  return (
    <>
      <p className="mt-6 text-[13px] text-ink-3">
        {results.total} ta profil topildi
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {results.items.map((candidate, index) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            priority={index < 4}
          />
        ))}
      </div>
      <Pagination page={page} total={results.total} params={urlParams} />
    </>
  );
}

function ResultsSkeleton() {
  return (
    <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <CandidateCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default async function YoshlarPage(props: PageProps<"/yoshlar">) {
  const [searchParams, categories, regions] = await Promise.all([
    props.searchParams,
    getCategories(),
    getRegions(),
  ]);

  // Suspense kalitini o'zgartirib, filtr almashganda skeleton ko'rsatamiz.
  const key = JSON.stringify(searchParams);

  return (
    <div className="yw-container py-10 lg:py-14">
      <header className="max-w-[640px]">
        <Eyebrow>Yoshlar</Eyebrow>
        <h1 className="mt-4 text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink lg:text-[44px]">
          Iqtidorli yoshlarni <span className="text-accent-text">kashf eting</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
          Ism, kasb, mutaxassislik, yoʻnalish yoki hudud boʻyicha qidiring.
        </p>
      </header>

      <div className="mt-8">
        <FilterBar categories={categories} regions={regions} />
      </div>

      <Suspense key={key} fallback={<ResultsSkeleton />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
