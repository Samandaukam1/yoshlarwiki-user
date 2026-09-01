import Link from "next/link";
import { ArrowRight, FileText, Play } from "lucide-react";

import { CandidateCard, CategoryCard, CategoryTile } from "@/components/cards";
import { HeroMosaicDesktop, HeroMosaicMobile } from "@/components/home/hero-mosaic";
import { StatsBar, StatsList } from "@/components/stats";
import { ButtonLink, Eyebrow, SectionHeading } from "@/components/ui";
import {
  getCategories,
  getHeroPortraits,
  getStats,
  searchCandidates,
} from "@/lib/queries";

export const revalidate = 300;

export default async function HomePage() {
  const [portraits, categories, stats, featured] = await Promise.all([
    getHeroPortraits(),
    getCategories(),
    getStats(),
    searchCandidates({ limit: 8, sort: "recent" }),
  ]);

  const tileCategories = categories.slice(0, 7);

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative lg:min-h-[880px]">
        <div className="yw-hero-bg" aria-hidden />
        <HeroMosaicDesktop portraits={portraits} />

        <div className="yw-container relative">
          <div className="pt-6 lg:hidden">
            <HeroMosaicMobile portraits={portraits} />
          </div>

          <div className="mx-auto max-w-[680px] pb-14 pt-8 text-center lg:max-w-[620px] lg:pb-0 lg:pt-[430px]">
            <Eyebrow>Yoshlar ensiklopediyasi</Eyebrow>

            <h1 className="mt-5 text-[36px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[48px] lg:mt-6 lg:text-[64px]">
              Yoshlar haqida.{" "}
              <span className="text-accent-text">
                Yoshlar <span className="yw-underline">tomonidan.</span>
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-[520px] text-[15px] leading-[1.75] text-ink-2 lg:text-[16px]">
              Iqtidorli, faol va tashabbuskor yoshlar haqidagi maʼlumotlarni bir
              joyda jamlaymiz va dunyoga tanitamiz.
            </p>

            <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
              <ButtonLink href="/yoshlar" size="lg">
                Yoshlarni kashf eting
                <ArrowRight className="size-[18px]" />
              </ButtonLink>

              <Link
                href="/biz-haqimizda#qanday-ishlaydi"
                className="inline-flex items-center gap-3 text-[15px] font-semibold text-ink transition-colors hover:text-accent-text"
              >
                Qanday ishlaydi?
                <span className="grid size-8 place-items-center rounded-full border-[1.5px] border-accent-text text-accent-text">
                  <Play className="size-3 fill-current" strokeWidth={0} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATISTIKA — desktopda hero ostida ============== */}
      <section
        aria-label="Platforma statistikasi"
        className="yw-container relative hidden lg:-mt-[86px] lg:block"
      >
        <StatsBar stats={stats} />
      </section>

      {/* ======================= KATEGORIYALAR ======================== */}
      <section className="yw-container mt-10 lg:mt-24">
        <SectionHeading title="Kategoriyalar" href="/kategoriyalar" />

        {/* Mobil: dizayndagi 4×2 kompakt katak */}
        <div className="mt-4 grid grid-cols-4 gap-2.5 lg:hidden">
          {tileCategories.map((category) => (
            <CategoryTile key={category.id} category={category} />
          ))}
          <Link
            href="/ariza"
            className="flex flex-col items-center gap-2.5 rounded-card border border-line bg-surface px-2.5 py-4 text-center transition-colors hover:border-line-strong hover:bg-surface-hover"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-soft-fg">
              <FileText className="size-[19px]" strokeWidth={1.8} />
            </span>
            <span className="text-[12px] font-medium leading-[1.35] text-ink-2">
              Ariza topshirish
            </span>
          </Link>
        </div>

        <Link
          href="/kategoriyalar"
          className="mt-2.5 flex h-14 items-center justify-center gap-2 rounded-card border border-line bg-surface text-[14px] font-semibold text-accent-text transition-colors hover:bg-surface-hover lg:hidden"
        >
          Barcha kategoriyalar
          <ArrowRight className="size-4" />
        </Link>

        {/* Desktop: kengroq kartalar */}
        <div className="mt-6 hidden gap-4 lg:grid lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* ========= BIZ HAQIMIZDA — mobilda kategoriyalardan keyin ===== */}
      <section className="yw-container mt-12 lg:hidden">
        <h2 className="mb-3.5 text-[20px] font-bold tracking-[-0.01em] text-ink">
          Biz haqimizda
        </h2>
        <StatsList stats={stats} />
      </section>

      {/* ============================ YOSHLAR ========================= */}
      {featured.items.length > 0 ? (
        <section className="yw-container mt-14 lg:mt-24">
          <SectionHeading
            title="Yoshlar"
            href="/yoshlar"
            linkLabel="Barchasini koʻrish"
          />
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.items.slice(0, 4).map((candidate, index) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                priority={index === 0}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* ====================== ARIZA CHAQIRIQ ======================== */}
      <section className="yw-container mt-14 lg:mt-24">
        <div className="relative overflow-hidden rounded-panel border border-line bg-surface px-6 py-10 text-center sm:px-10 lg:py-14">
          <div className="yw-apply-bg" aria-hidden />
          <div className="relative mx-auto max-w-[560px]">
            <Eyebrow>Ariza topshirish</Eyebrow>
            <h2 className="mt-4 text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink lg:text-[34px]">
              Yoshlar ensiklopediyasiga{" "}
              <span className="text-accent-text">ariza qoldiring</span>
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-ink-2">
              Oʻzingiz haqingizdagi maʼlumotlarni biz bilan boʻlishing va boshqa
              yoshlar uchun ilhom manbaiga aylaning.
            </p>
            <ButtonLink href="/ariza" size="lg" className="mt-7">
              Ariza yuborish
              <ArrowRight className="size-[18px]" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
