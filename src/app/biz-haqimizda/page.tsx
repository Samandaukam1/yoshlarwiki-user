import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";

import { StatsBar } from "@/components/stats";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Eyebrow, IconChip } from "@/components/ui";
import { getCategories, getPublicSetting, getStats } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Biz haqimizda",
  description:
    "YoshlarWiki — Oʻzbekiston yoshlari haqidagi ochiq ensiklopediya. Platforma qanday ishlashi, ariza jarayoni va yoʻnalishlar haqida.",
  alternates: { canonical: "/biz-haqimizda" },
};

const STEPS = [
  {
    icon: FileText,
    title: "Ariza qoldirasiz",
    text: "Oʻzingiz yoki tanishingiz haqida qisqa ariza toʻldirasiz. Bu 2 daqiqa vaqt oladi.",
  },
  {
    icon: ClipboardCheck,
    title: "Tahririyat koʻrib chiqadi",
    text: "Jamoamiz maʼlumotlarni tekshiradi va siz bilan bogʻlanib qoʻshimcha savollar beradi.",
  },
  {
    icon: UserRoundCheck,
    title: "Profil tayyorlanadi",
    text: "Taʼlim, faoliyat yoʻli, yutuq va loyihalar tuzilgan holda profilga joylanadi.",
  },
  {
    icon: Sparkles,
    title: "Profil eʼlon qilinadi",
    text: "Profilingiz saytda chop etiladi va qidiruv tizimlarida topiladigan boʻladi.",
  },
];

export default async function AboutPage() {
  const [stats, categories, contacts] = await Promise.all([
    getStats(),
    getCategories(),
    getPublicSetting<{ email?: string; telegram?: string }>("contacts"),
  ]);

  return (
    <div className="yw-container py-10 lg:py-16">
      {/* --------------------------- Kirish --------------------------- */}
      <header className="yw-enter max-w-[680px]">
        <Eyebrow>Biz haqimizda</Eyebrow>
        <h1 className="mt-5 text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink lg:text-[46px]">
          Yoshlar haqida.{" "}
          <span className="text-accent-text">Yoshlar tomonidan.</span>
        </h1>
        <p className="mt-5 text-[15.5px] leading-[1.8] text-ink-2">
          {siteConfig.name} — Oʻzbekiston yoshlari haqidagi ochiq ensiklopediya.
          Biz turli sohalarda faoliyat yuritayotgan iqtidorli, faol va
          tashabbuskor yoshlar haqidagi maʼlumotlarni bir joyda jamlaymiz,
          tartibga solamiz va ularni keng jamoatchilikka tanitamiz.
        </p>
      </header>

      <div className="mt-10">
        <StatsBar stats={stats} />
      </div>

      {/* ---------------------- Qanday ishlaydi ----------------------- */}
      <section id="qanday-ishlaydi" className="mt-16 scroll-mt-24 lg:mt-24">
        <Reveal>
        <h2 className="text-[24px] font-bold tracking-[-0.02em] text-ink lg:text-[30px]">
          Qanday ishlaydi?
        </h2>
        <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-2">
          Profil yaratish jarayoni to&apos;rt bosqichdan iborat. Har bir profil
          tahririyat tekshiruvidan oʻtadi.
        </p>
        </Reveal>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 80}
              className="group rounded-card border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-yw"
            >
              <div className="flex items-center justify-between">
                <IconChip icon={step.icon} />
                <span className="text-[26px] font-extrabold leading-none tracking-[-0.03em] text-line-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-[15px] font-bold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
                {step.text}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ------------------------ Yo'nalishlar ------------------------ */}
      <Reveal as="section" className="mt-16 lg:mt-24">
        <h2 className="text-[24px] font-bold tracking-[-0.02em] text-ink lg:text-[30px]">
          Yoʻnalishlar
        </h2>
        <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-2">
          Ensiklopediya {categories.length} ta yoʻnalish boʻyicha tuzilgan.
          Har bir profil kamida bitta kategoriyaga biriktiriladi.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/kategoriyalar/${category.slug}`}
                className="inline-flex rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-medium text-ink-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent-text"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* ---------------------- Tamoyillar ---------------------------- */}
      <section className="mt-16 lg:mt-24">
        <h2 className="text-[24px] font-bold tracking-[-0.02em] text-ink lg:text-[30px]">
          Tamoyillarimiz
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Tekshirilgan maʼlumot",
              text: "Har bir profil eʼlon qilinishidan oldin tahririyat tomonidan tekshiriladi.",
            },
            {
              icon: Search,
              title: "Ochiq va topiladigan",
              text: "Profillar ochiq havolalarga ega va qidiruv tizimlarida indekslanadi.",
            },
            {
              icon: Sparkles,
              title: "Tuzilgan tarkib",
              text: "Taʼlim, faoliyat, yutuq va loyihalar alohida bo‘limlarda saqlanadi.",
            },
          ].map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 80}
              className="rounded-card border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-yw"
            >
              <IconChip icon={item.icon} />
              <h3 className="mt-4 text-[15px] font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
                {item.text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------- Aloqa ---------------------------- */}
      <section id="aloqa" className="mt-16 scroll-mt-24 lg:mt-24">
        <Reveal className="relative overflow-hidden rounded-panel border border-line bg-surface px-6 py-10 sm:px-10 lg:py-12">
          <div className="yw-apply-bg" aria-hidden />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-[24px] font-bold tracking-[-0.02em] text-ink lg:text-[28px]">
                Aloqa
              </h2>
              <p className="mt-3 max-w-[420px] text-[14.5px] leading-relaxed text-ink-2">
                Savol, taklif yoki hamkorlik boʻyicha biz bilan bogʻlaning.
              </p>
              <dl className="mt-5 space-y-2 text-[14px]">
                {contacts?.email ? (
                  <div className="flex gap-2">
                    <dt className="text-ink-3">Email:</dt>
                    <dd>
                      <a
                        href={`mailto:${contacts.email}`}
                        className="font-medium text-accent-text hover:underline"
                      >
                        {contacts.email}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {contacts?.telegram ? (
                  <div className="flex gap-2">
                    <dt className="text-ink-3">Telegram:</dt>
                    <dd>
                      <a
                        href={contacts.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-accent-text hover:underline"
                      >
                        {contacts.telegram.replace(/^https?:\/\//, "")}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className="lg:justify-self-end">
              <ButtonLink href="/ariza" size="lg" className="yw-press">
                Ariza qoldirish
                <ArrowRight className="size-[18px]" />
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
