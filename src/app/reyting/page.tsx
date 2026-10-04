import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ChevronRight,
  Crown,
  Equal,
  Eye,
  MousePointerClick,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";

import { Ambient } from "@/components/ambient";
import { CountUp, Reveal } from "@/components/reveal";
import { ButtonLink, CategoryIcon, EmptyState } from "@/components/ui";
import { competitionRanks, formatNumber } from "@/lib/format";
import { getCategories, searchCandidates, type CandidateCard } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reyting",
  description:
    "Yoshlar reytingi — eng koʻp koʻrilgan profillar. Reyting profil sahifalariga tashriflar soni asosida avtomatik tuziladi.",
  alternates: { canonical: "/reyting" },
  openGraph: {
    title: "Yoshlar reytingi | YoshlarWiki",
    description: "Eng koʻp koʻrilgan yoshlar profillari reytingi.",
    url: `${siteConfig.url}/reyting`,
  },
};

const LIMIT = 48;

type Ranked = CandidateCard & { rank: number };
type Place = 1 | 2 | 3;

/* Oltin, kumush, bronza. */
const PLACES: Record<
  Place,
  { ring: string; number: string; glow: string; avatar: string; block: string; label: string }
> = {
  1: {
    ring: "from-[#fff3c4] via-[#f6c63f] to-[#b97c00]",
    number: "from-[#fff3c4] to-[#e0a100]",
    glow: "shadow-[0_0_44px_-6px_rgb(246_198_63/0.75)]",
    avatar: "size-[86px] sm:size-[118px] lg:size-[132px]",
    block: "h-[88px] sm:h-[118px] lg:h-[148px]",
    label: "Oltin",
  },
  2: {
    ring: "from-[#ffffff] via-[#c9d3e1] to-[#8592a6]",
    number: "from-[#ffffff] to-[#a9b6c9]",
    glow: "shadow-[0_0_36px_-8px_rgb(201_211_225/0.6)]",
    avatar: "size-[66px] sm:size-[92px] lg:size-[104px]",
    block: "h-[62px] sm:h-[84px] lg:h-[106px]",
    label: "Kumush",
  },
  3: {
    ring: "from-[#ffd9b3] via-[#d9894a] to-[#9a4f17]",
    number: "from-[#ffd9b3] to-[#cf7a3a]",
    glow: "shadow-[0_0_36px_-8px_rgb(217_137_74/0.6)]",
    avatar: "size-[66px] sm:size-[92px] lg:size-[104px]",
    block: "h-[46px] sm:h-[64px] lg:h-[80px]",
    label: "Bronza",
  },
};

function Avatar({
  candidate,
  sizes,
  className = "",
  preload = false,
}: {
  candidate: CandidateCard;
  sizes: string;
  className?: string;
  preload?: boolean;
}) {
  return (
    <span className={`relative block overflow-hidden rounded-full ${className}`}>
      {candidate.portrait_url ? (
        <Image
          src={candidate.portrait_url}
          alt=""
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover object-top"
        />
      ) : (
        <span className="grid size-full place-items-center text-current opacity-60">
          <UserRound className="size-1/2" strokeWidth={1.5} />
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Shohsupa                                                            */
/* ------------------------------------------------------------------ */

function PodiumSpot({ item, place, delay }: { item: Ranked; place: Place; delay: number }) {
  const style = PLACES[place];

  return (
    <li
      className="yw-enter flex min-w-0 flex-1 flex-col items-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link
        href={`/yoshlar/${item.slug}`}
        className="group flex w-full flex-col items-center px-1 text-center"
      >
        {place === 1 ? (
          <Crown
            className="yw-crown mb-1.5 size-6 text-[#ffd34d] drop-shadow-[0_2px_10px_rgb(255_200_60/0.7)] sm:size-8"
            strokeWidth={2}
            aria-hidden
          />
        ) : null}

        <span
          className={`relative rounded-full bg-linear-to-br p-[3px] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.03] ${style.ring} ${style.glow}`}
        >
          <Avatar
            candidate={item}
            preload={place === 1}
            sizes="(min-width: 1024px) 132px, (min-width: 640px) 118px, 86px"
            className={`bg-linear-to-b from-[#20438a] to-[#0b1d44] text-white ${style.avatar}`}
          />
          <span
            className={`absolute -bottom-2.5 left-1/2 grid size-7 -translate-x-1/2 place-items-center rounded-full bg-linear-to-br text-[12px] font-extrabold text-[#1d1300] ring-[3px] ring-[#081a3a] sm:size-8 sm:text-[13px] ${style.ring}`}
          >
            {item.rank}
          </span>
        </span>

        <span className="mt-4 line-clamp-2 min-h-[2.6em] text-[12.5px] font-bold leading-tight text-white sm:text-[15px] lg:text-[16px]">
          {item.full_name}
        </span>
        {item.title ? (
          <span className="mt-1 hidden max-w-full truncate text-[12px] text-white/60 sm:block">
            {item.title}
          </span>
        ) : null}
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11.5px] font-semibold tabular-nums text-white ring-1 ring-white/15 sm:text-[12.5px]">
          <Eye className="size-3.5" strokeWidth={2.2} aria-hidden />
          {formatNumber(item.view_count)}
          <span className="sr-only"> marta koʻrilgan, {style.label}</span>
        </span>
      </Link>

      <div className={`yw-podium-block relative mt-3 w-full rounded-t-[16px] sm:rounded-t-[20px] ${style.block}`}>
        <span
          aria-hidden
          className={`absolute inset-x-0 top-1.5 bg-linear-to-b bg-clip-text text-center text-[30px] font-extrabold leading-none text-transparent sm:top-3 sm:text-[44px] lg:text-[54px] ${style.number}`}
        >
          {place}
        </span>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Sahifa                                                              */
/* ------------------------------------------------------------------ */

export default async function RatingPage(props: PageProps<"/reyting">) {
  const searchParams = await props.searchParams;
  const rawCategory = searchParams.kategoriya;
  const categorySlug = typeof rawCategory === "string" && rawCategory ? rawCategory : null;

  const [categories, all, filtered] = await Promise.all([
    getCategories(),
    searchCandidates({ sort: "popular", limit: LIMIT }),
    categorySlug
      ? searchCandidates({ sort: "popular", limit: LIMIT, category: categorySlug })
      : Promise.resolve(null),
  ]);

  const activeCategory = categories.find((item) => item.slug === categorySlug) ?? null;
  const result = filtered ?? all;
  const ranks = competitionRanks(result.items.map((item) => item.view_count));
  const ranked: Ranked[] = result.items.map((item, index) => ({ ...item, rank: ranks[index] }));

  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  const maxViews = Math.max(1, ranked[0]?.view_count ?? 1);
  const totalViews = ranked.reduce((sum, item) => sum + item.view_count, 0);
  const average = ranked.length ? Math.round(totalViews / ranked.length) : 0;

  // Klassik shohsupa tartibi: 2 — 1 — 3.
  const podiumOrder: { item: Ranked; place: Place }[] = [];
  if (podium[1]) podiumOrder.push({ item: podium[1], place: 2 });
  if (podium[0]) podiumOrder.push({ item: podium[0], place: 1 });
  if (podium[2]) podiumOrder.push({ item: podium[2], place: 3 });

  // Yo'nalishlar reytingi — barcha profillar bo'yicha (filtrdan qat'i nazar).
  const categoryBoard = [
    ...all.items
      .reduce((map, item) => {
        if (!item.category) return map;
        const entry = map.get(item.category.slug) ?? { ...item.category, views: 0, count: 0 };
        entry.views += item.view_count;
        entry.count += 1;
        return map.set(item.category.slug, entry);
      }, new Map<string, { name: string; slug: string; icon: string; views: number; count: number }>())
      .values(),
  ]
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);
  const maxCategoryViews = Math.max(1, categoryBoard[0]?.views ?? 1);

  const chip = (active: boolean) =>
    `inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-[13px] font-medium transition-all ${
      active
        ? "bg-accent text-accent-fg shadow-[0_6px_16px_-6px_rgb(0_80_250/0.6)]"
        : "yw-glass text-ink-2 hover:text-ink"
    }`;

  return (
    <>
      <Ambient />

      <div className="yw-container py-6 lg:py-10">
        {/* ============================ ARENA ============================ */}
        <section
          aria-labelledby="reyting-sarlavha"
          className="yw-arena relative overflow-hidden rounded-[28px] px-3 pb-5 pt-7 sm:px-8 sm:pb-8 sm:pt-10 lg:rounded-[36px] lg:px-12 lg:pb-10 lg:pt-12"
        >
          <span aria-hidden className="yw-arena-beam" />
          <span aria-hidden className="yw-arena-sparkles" />

          <div className="relative flex flex-col items-center text-center">
            <span className="yw-enter inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/90 ring-1 ring-white/15">
              <Trophy className="size-3.5 text-[#ffd34d]" strokeWidth={2.2} aria-hidden />
              {activeCategory ? activeCategory.name : `TOP-${Math.min(LIMIT, result.total || ranked.length)}`}
            </span>
            <h1
              id="reyting-sarlavha"
              style={{ animationDelay: "80ms" }}
              className="yw-enter mt-4 text-[30px] font-extrabold leading-[1.05] tracking-[-0.035em] text-white sm:text-[42px] lg:text-[52px]"
            >
              Yoshlar <span className="bg-linear-to-r from-[#7fb0ff] to-[#4d8dff] bg-clip-text text-transparent">reytingi</span>
            </h1>
            <p
              style={{ animationDelay: "160ms" }}
              className="yw-enter mt-3 max-w-[520px] text-[13.5px] leading-relaxed text-white/65 sm:text-[15px]"
            >
              Eng koʻp koʻrilgan profillar. Har bir tashrif hisoblanadi —
              profilingizni koʻrgan sari oʻrningiz yuqorilaydi.
            </p>
          </div>

          {podiumOrder.length > 0 ? (
            <ol
              aria-label="Eng yaxshi uchtalik"
              className="relative mx-auto mt-8 flex max-w-[760px] items-end justify-center gap-2 sm:mt-12 sm:gap-5"
            >
              {podiumOrder.map(({ item, place }, index) => (
                <PodiumSpot key={item.id} item={item} place={place} delay={220 + index * 120} />
              ))}
            </ol>
          ) : null}

          {ranked.length > 0 ? (
            <dl className="relative mx-auto mt-0 grid max-w-[760px] grid-cols-2 overflow-hidden rounded-b-[18px] border-t border-white/10 bg-white/[0.06] backdrop-blur-md sm:grid-cols-4 sm:rounded-b-[22px]">
              {[
                { label: "Reytingda", value: result.total, suffix: " ta" },
                { label: "Jami koʻrishlar", value: totalViews, suffix: "" },
                { label: "Oʻrtacha", value: average, suffix: "" },
                { label: "Eng yuqori", value: ranked[0]?.view_count ?? 0, suffix: "" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`px-4 py-3.5 text-center sm:py-4 ${index % 2 === 1 ? "border-l border-white/10" : ""} ${
                    index >= 2 ? "border-t border-white/10 sm:border-t-0 sm:border-l" : ""
                  }`}
                >
                  <dt className="text-[11.5px] text-white/55">{stat.label}</dt>
                  <dd className="mt-0.5 text-[19px] font-extrabold tabular-nums text-white sm:text-[22px]">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>

        {/* ------------------------ Kategoriya filtri ---------------------- */}
        <nav aria-label="Kategoriya boʻyicha" className="-mx-5 mt-6 md:-mx-8">
          <ul className="yw-scroll-x flex gap-2 px-5 py-1 md:px-8 lg:flex-wrap lg:overflow-visible">
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
          <div className="mt-6">
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
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
            {/* ------------------------- To'liq reyting ------------------------- */}
            <section aria-labelledby="toliq-reyting" className="min-w-0">
              <div className="mb-3 flex items-end justify-between gap-3">
                <h2 id="toliq-reyting" className="text-[19px] font-bold tracking-[-0.01em] text-ink sm:text-[21px]">
                  Toʻliq reyting
                </h2>
                <span className="text-[12.5px] text-ink-3">
                  {formatNumber(result.total)} ta profil
                </span>
              </div>

              {rest.length > 0 ? (
                <Reveal as="ol" className="yw-glass overflow-hidden rounded-[24px]">
                  {rest.map((item, index) => {
                    const share = totalViews ? Math.round((item.view_count / totalViews) * 1000) / 10 : 0;
                    const top10 = item.rank <= 10;
                    return (
                      <li
                        key={item.id}
                        className={index > 0 ? "border-t border-white/60 dark:border-white/[0.07]" : ""}
                      >
                        <Link
                          href={`/yoshlar/${item.slug}`}
                          className="group flex items-center gap-3 px-3.5 py-3 transition-colors hover:bg-white/40 sm:gap-4 sm:px-5 sm:py-3.5 dark:hover:bg-white/[0.04]"
                        >
                          <span
                            className={`grid size-9 shrink-0 place-items-center rounded-[12px] text-[14px] font-extrabold tabular-nums sm:size-10 sm:text-[15px] ${
                              top10
                                ? "bg-accent-soft text-accent-soft-fg"
                                : "bg-surface-2/70 text-ink-3 dark:bg-white/5"
                            }`}
                          >
                            {item.rank}
                          </span>
                          <Avatar
                            candidate={item}
                            sizes="48px"
                            className="size-11 shrink-0 bg-surface-2 text-ink-3 ring-2 ring-white/80 sm:size-12 dark:ring-white/10"
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
                            <span className="hidden max-w-[180px] shrink-0 items-center gap-1.5 truncate rounded-full bg-surface-2/70 px-2.5 py-1 text-[11.5px] text-ink-2 xl:inline-flex dark:bg-white/5">
                              <CategoryIcon name={item.category.icon} className="size-3.5 shrink-0" />
                              <span className="truncate">{item.category.name}</span>
                            </span>
                          ) : null}

                          <span className="flex w-[78px] shrink-0 flex-col items-end gap-1.5 sm:w-[132px]">
                            <span className="inline-flex items-center gap-1 text-[13.5px] font-bold tabular-nums text-ink">
                              <Eye className="size-3.5 text-ink-3" strokeWidth={2.2} aria-hidden />
                              {formatNumber(item.view_count)}
                              <span className="sr-only"> marta koʻrilgan</span>
                            </span>
                            <span aria-hidden className="flex w-full items-center gap-2">
                              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.07] dark:bg-white/10">
                                <span
                                  className="block h-full rounded-full bg-linear-to-r from-[#4d8dff] to-accent"
                                  style={{ width: `${Math.max(4, (item.view_count / maxViews) * 100)}%` }}
                                />
                              </span>
                              <span className="hidden w-9 text-right text-[11px] tabular-nums text-ink-3 sm:inline">
                                {share}%
                              </span>
                            </span>
                          </span>
                          <ChevronRight
                            className="hidden size-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-text sm:block"
                            aria-hidden
                          />
                        </Link>
                      </li>
                    );
                  })}
                </Reveal>
              ) : (
                <p className="yw-glass rounded-[20px] px-5 py-6 text-center text-[13.5px] text-ink-2">
                  Bu yoʻnalishda hozircha faqat uchlik bor — yuqoridagi shohsupaga qarang.
                </p>
              )}

              {result.total > LIMIT ? (
                <p className="mt-3 text-[12.5px] text-ink-3">
                  Eng yaxshi {LIMIT} ta profil koʻrsatilgan.
                </p>
              ) : null}
            </section>

            {/* --------------------------- Yon panel --------------------------- */}
            <aside className="flex min-w-0 flex-col gap-4">
              {categoryBoard.length > 0 ? (
                <Reveal className="yw-glass rounded-[24px] p-5">
                  <h2 className="flex items-center gap-2 text-[15px] font-bold text-ink">
                    <Sparkles className="size-4 text-accent-text" strokeWidth={2} aria-hidden />
                    Yoʻnalishlar reytingi
                  </h2>
                  <ol className="mt-4 space-y-3">
                    {categoryBoard.map((item, index) => (
                      <li key={item.slug}>
                        <Link
                          href={`/reyting?kategoriya=${item.slug}`}
                          scroll={false}
                          className={`group flex items-center gap-3 rounded-[14px] p-1.5 transition-colors hover:bg-white/40 dark:hover:bg-white/[0.04] ${
                            item.slug === activeCategory?.slug ? "bg-accent-soft/60" : ""
                          }`}
                        >
                          <span className="w-4 shrink-0 text-center text-[12px] font-bold tabular-nums text-ink-3">
                            {index + 1}
                          </span>
                          <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-accent-soft text-accent-soft-fg">
                            <CategoryIcon name={item.icon} className="size-[17px]" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-baseline justify-between gap-2">
                              <span className="truncate text-[13px] font-semibold text-ink group-hover:text-accent-text">
                                {item.name}
                              </span>
                              <span className="shrink-0 text-[12px] font-bold tabular-nums text-ink-2">
                                {formatNumber(item.views)}
                              </span>
                            </span>
                            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-ink/[0.07] dark:bg-white/10">
                              <span
                                className="block h-full rounded-full bg-linear-to-r from-[#7c5cff] to-accent"
                                style={{ width: `${Math.max(6, (item.views / maxCategoryViews) * 100)}%` }}
                              />
                            </span>
                            <span className="mt-1 block text-[11px] text-ink-3">{item.count} ta profil</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </Reveal>
              ) : null}

              <Reveal delay={80} className="yw-glass rounded-[24px] p-5">
                <h2 className="text-[15px] font-bold text-ink">Reyting qanday tuziladi?</h2>
                <ul className="mt-4 space-y-3.5">
                  {[
                    { icon: MousePointerClick, text: "Profil sahifasining har bir ochilishi — bitta koʻrish." },
                    { icon: ShieldCheck, text: "Bir qurilmadan bir tashrif davomida faqat bir marta sanaladi." },
                    { icon: Equal, text: "Koʻrishlari teng profillar bir xil oʻrinni egallaydi." },
                    { icon: RefreshCw, text: "Reyting har bir necha daqiqada avtomatik yangilanadi." },
                  ].map((rule) => (
                    <li key={rule.text} className="flex items-start gap-3 text-[13px] leading-relaxed text-ink-2">
                      <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent-soft-fg">
                        <rule.icon className="size-4" strokeWidth={2} aria-hidden />
                      </span>
                      <span className="pt-1">{rule.text}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={140} className="yw-arena relative overflow-hidden rounded-[24px] p-5 text-white">
                <span aria-hidden className="yw-arena-beam" />
                <div className="relative">
                  <Trophy className="size-7 text-[#ffd34d]" strokeWidth={1.8} aria-hidden />
                  <h2 className="mt-3 text-[17px] font-bold leading-snug">
                    Siz ham reytingda boʻling
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">
                    Ariza qoldiring — profilingiz eʼlon qilingach, reytingda oʻz oʻrningizni egallaysiz.
                  </p>
                  <ButtonLink href="/ariza" className="yw-press mt-4 w-full">
                    Ariza qoldirish
                    <ArrowRight className="size-4" />
                  </ButtonLink>
                </div>
              </Reveal>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
