import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Crown, Eye, Info, Trophy, UserRound } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { EmptyState, Eyebrow } from "@/components/ui";
import { competitionRanks, formatNumber } from "@/lib/format";
import { getCategories, searchCandidates, type CandidateCard } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reyting",
  description:
    "Eng koʻp koʻrilgan yoshlar reytingi — profil sahifalariga tashriflar soni asosida avtomatik tuziladi.",
  alternates: { canonical: "/reyting" },
  openGraph: {
    title: "Yoshlar reytingi | YoshlarWiki",
    description: "Eng koʻp koʻrilgan yoshlar profillari reytingi.",
    url: `${siteConfig.url}/reyting`,
  },
};

const LIMIT = 48;

type Ranked = CandidateCard & { rank: number };

/* Medal ranglari — oltin, kumush, bronza. */
const MEDALS: Record<number, { ring: string; badge: string; label: string }> = {
  1: {
    ring: "ring-[#f2b705]/70",
    badge: "bg-linear-to-br from-[#ffd75e] to-[#e2a000] text-[#3d2a00]",
    label: "Oltin",
  },
  2: {
    ring: "ring-[#a9b4c4]/70",
    badge: "bg-linear-to-br from-[#eef2f7] to-[#a3afc0] text-[#26303f]",
    label: "Kumush",
  },
  3: {
    ring: "ring-[#c98a52]/70",
    badge: "bg-linear-to-br from-[#f1bd8c] to-[#b8682c] text-[#3a1d06]",
    label: "Bronza",
  },
};

function Views({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 tabular-nums ${className}`}>
      <Eye className="size-[15px] shrink-0" strokeWidth={2} aria-hidden />
      {formatNumber(value)}
      <span className="sr-only"> marta koʻrilgan</span>
    </span>
  );
}

function Portrait({
  candidate,
  sizes,
  className = "",
  priority = false,
}: {
  candidate: CandidateCard;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={`relative block overflow-hidden bg-surface-2 ${className}`}>
      {candidate.portrait_url ? (
        <Image
          src={candidate.portrait_url}
          alt=""
          fill
          sizes={sizes}
          preload={priority}
          className="object-cover object-top"
        />
      ) : (
        <span className="grid size-full place-items-center text-ink-3">
          <UserRound className="size-1/3" strokeWidth={1.5} />
        </span>
      )}
    </span>
  );
}

/** Eng yaxshi uchtalik kartasi. */
function PodiumCard({ item, featured }: { item: Ranked; featured: boolean }) {
  const medal = MEDALS[item.rank] ?? MEDALS[3];

  return (
    <Link
      href={`/yoshlar/${item.slug}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-panel border border-line bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-line-strong hover:shadow-yw-lg ${
        featured ? "shadow-yw" : ""
      }`}
    >
      <Portrait
        candidate={item}
        priority={featured}
        sizes={featured ? "(min-width: 1024px) 380px, 92vw" : "(min-width: 1024px) 320px, 46vw"}
        // Birinchi o'rin desktopda balandroq — pastdan tekislangan uchlikda
        // "shohsupa" kabi ko'tarilib turadi.
        className={`w-full ${featured ? "aspect-[4/3.5] lg:aspect-[4/5]" : "aspect-[4/4.4]"}`}
      />

      {/* O'rin belgisi */}
      <span
        className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-extrabold shadow-yw ring-2 ${medal.ring} ${medal.badge}`}
      >
        {item.rank === 1 ? <Crown className="size-3.5" strokeWidth={2.4} aria-hidden /> : null}
        {item.rank}-oʻrin
        <span className="sr-only"> ({medal.label})</span>
      </span>

      <span className="flex flex-1 flex-col p-4 sm:p-5">
        <span
          className={`font-bold leading-snug tracking-[-0.01em] text-ink group-hover:text-accent-text ${
            featured ? "text-[18px] sm:text-[20px]" : "text-[14.5px] sm:text-[16px]"
          }`}
        >
          {item.full_name}
        </span>
        {item.title ? (
          <span className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-ink-2 sm:text-[13px]">
            {item.title}
          </span>
        ) : null}
        <span className="mt-auto flex items-center justify-between gap-2 pt-3.5">
          <Views
            value={item.view_count}
            className="rounded-full bg-accent-soft px-2.5 py-1 text-[12.5px] font-semibold text-accent-soft-fg"
          />
          <ChevronRight
            className="size-4 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-text"
            aria-hidden
          />
        </span>
      </span>
    </Link>
  );
}

export default async function RatingPage(props: PageProps<"/reyting">) {
  const searchParams = await props.searchParams;
  const rawCategory = searchParams.kategoriya;
  const categorySlug = typeof rawCategory === "string" && rawCategory ? rawCategory : null;

  const [categories, result] = await Promise.all([
    getCategories(),
    searchCandidates({ sort: "popular", limit: LIMIT, category: categorySlug }),
  ]);

  const activeCategory = categories.find((item) => item.slug === categorySlug) ?? null;
  const ranks = competitionRanks(result.items.map((item) => item.view_count));
  const ranked: Ranked[] = result.items.map((item, index) => ({ ...item, rank: ranks[index] }));

  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  const maxViews = Math.max(1, ranked[0]?.view_count ?? 1);
  const totalViews = ranked.reduce((sum, item) => sum + item.view_count, 0);

  // Desktopda 2-1-3 tartibi (birinchi o'rin markazda), mobilda 1-2-3.
  const podiumOrder = podium.length === 3 ? [podium[1], podium[0], podium[2]] : podium;

  const chip = (active: boolean) =>
    `inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-[13px] font-medium transition-colors ${
      active
        ? "border-accent bg-accent text-accent-fg"
        : "border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink"
    }`;

  return (
    <div className="yw-container py-10 lg:py-16">
      {/* --------------------------- Sarlavha --------------------------- */}
      <header className="yw-enter flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[640px]">
          <Eyebrow>Reyting</Eyebrow>
          <h1 className="mt-5 text-[32px] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink lg:text-[46px]">
            Eng koʻp koʻrilgan{" "}
            <span className="text-accent-text">yoshlar</span>
          </h1>
          <p className="mt-4 text-[15px] leading-[1.75] text-ink-2">
            Reyting profil sahifalariga tashriflar soni asosida avtomatik
            tuziladi. Har bir tashrif hisoblanadi — profilni koʻrgan sari
            oʻrni yuqorilaydi.
          </p>
        </div>

        {ranked.length > 0 ? (
          <dl className="flex gap-3">
            <div className="rounded-card border border-line bg-surface px-5 py-3.5">
              <dt className="text-[12px] text-ink-3">Reytingda</dt>
              <dd className="text-[20px] font-bold tabular-nums text-ink">
                {formatNumber(result.total)} ta
              </dd>
            </div>
            <div className="rounded-card border border-line bg-surface px-5 py-3.5">
              <dt className="text-[12px] text-ink-3">Jami koʻrishlar</dt>
              <dd className="text-[20px] font-bold tabular-nums text-ink">
                {formatNumber(totalViews)}
              </dd>
            </div>
          </dl>
        ) : null}
      </header>

      {/* ------------------------ Kategoriya filtri ---------------------- */}
      <nav aria-label="Kategoriya boʻyicha" className="-mx-5 mt-8 md:-mx-8">
        <ul className="yw-scroll-x flex gap-2 px-5 pb-1 md:px-8 lg:flex-wrap lg:overflow-visible">
          <li className="shrink-0">
            <Link href="/reyting" scroll={false} className={chip(!activeCategory)}>
              Barchasi
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id} className="shrink-0">
              <Link
                href={`/reyting?kategoriya=${category.slug}`}
                scroll={false}
                aria-current={category.slug === activeCategory?.slug ? "true" : undefined}
                className={chip(category.slug === activeCategory?.slug)}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {ranked.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Trophy}
            title="Hozircha reyting boʻsh"
            description={
              activeCategory
                ? `«${activeCategory.name}» yoʻnalishida hali profil yoʻq.`
                : "Profillar eʼlon qilingach, reyting shu yerda paydo boʻladi."
            }
            action={{ href: "/yoshlar", label: "Barcha yoshlar" }}
          />
        </div>
      ) : (
        <>
          {/* ---------------------------- Uchlik --------------------------- */}
          <section aria-label="Eng yaxshi uchtalik" className="mt-8">
            <ol className="grid grid-cols-2 gap-3 sm:gap-4 lg:mx-auto lg:max-w-[940px] lg:grid-cols-3 lg:items-end lg:gap-5">
              {podiumOrder.map((item, index) => {
                const featured = item.rank === 1 && item === podium[0];
                return (
                  <Reveal
                    as="li"
                    key={item.id}
                    delay={index * 90}
                    className={
                      featured ? "order-first col-span-2 lg:order-none lg:col-span-1" : ""
                    }
                  >
                    <PodiumCard item={item} featured={featured} />
                  </Reveal>
                );
              })}
            </ol>
          </section>

          {/* ------------------------ Qolgan o'rinlar ---------------------- */}
          {rest.length > 0 ? (
            <section aria-label="Reyting davomi" className="mt-8 lg:mt-10">
              <ol className="overflow-hidden rounded-panel border border-line bg-surface">
                {rest.map((item, index) => (
                  <li key={item.id} className={index > 0 ? "border-t border-line" : ""}>
                    <Link
                      href={`/yoshlar/${item.slug}`}
                      className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover sm:gap-4 sm:px-5 sm:py-3.5"
                    >
                      <span className="w-8 shrink-0 text-center text-[15px] font-extrabold tabular-nums text-ink-3 group-hover:text-accent-text sm:w-10 sm:text-[17px]">
                        {item.rank}
                      </span>
                      <Portrait
                        candidate={item}
                        sizes="48px"
                        className="size-11 shrink-0 rounded-full ring-1 ring-line sm:size-12"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px] font-semibold text-ink group-hover:text-accent-text">
                          {item.full_name}
                        </span>
                        <span className="block truncate text-[12.5px] text-ink-3">
                          {item.title ?? item.category?.name ?? "—"}
                        </span>
                      </span>

                      {item.category ? (
                        <span className="hidden max-w-[200px] shrink-0 truncate rounded-full bg-surface-2 px-3 py-1 text-[12px] text-ink-2 lg:inline-block">
                          {item.category.name}
                        </span>
                      ) : null}

                      <span className="flex shrink-0 flex-col items-end gap-1.5 sm:w-[140px]">
                        <Views value={item.view_count} className="text-[13px] font-semibold text-ink" />
                        <span
                          aria-hidden
                          className="hidden h-1.5 w-full overflow-hidden rounded-full bg-surface-2 sm:block"
                        >
                          <span
                            className="block h-full rounded-full bg-accent"
                            style={{ width: `${Math.max(4, (item.view_count / maxViews) * 100)}%` }}
                          />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <p className="mt-6 flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-3">
            <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.9} aria-hidden />
            Koʻrishlar soni har bir qurilmadan bir tashrif davomida bir marta
            hisoblanadi va reyting bir necha daqiqada yangilanadi.
            {result.total > LIMIT ? ` Eng yaxshi ${LIMIT} ta profil koʻrsatilgan.` : ""}
          </p>
        </>
      )}
    </div>
  );
}
