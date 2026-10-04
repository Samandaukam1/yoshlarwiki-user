import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardCheck,
  FileText,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Wallet,
} from "lucide-react";

import { InstagramIcon, TelegramIcon } from "@/components/social-icons";
import { StatsBar } from "@/components/stats";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Eyebrow, IconChip } from "@/components/ui";
import {
  DEFAULT_SOCIALS,
  formatAmount,
  getAboutContent,
  socialHandle,
  socialUrl,
  type Contacts,
} from "@/lib/about";
import { getCategories, getPublicSetting, getStats } from "@/lib/queries";

// Matn va narx admin paneldan o'zgartiriladi — yangilanish bir daqiqada ko'rinadi.
export const revalidate = 60;

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
  const [stats, categories, contacts, about] = await Promise.all([
    getStats(),
    getCategories(),
    getPublicSetting<Contacts>("contacts"),
    getAboutContent(),
  ]);

  const telegram = socialUrl(contacts?.telegram || DEFAULT_SOCIALS.telegram, "https://t.me/");
  const instagram = socialUrl(contacts?.instagram || DEFAULT_SOCIALS.instagram, "https://instagram.com/");
  const amount = formatAmount(about.fee_amount);
  const paragraphs = about.intro
    .split(/\n\s*\n/)
    .map((text) => text.trim())
    .filter(Boolean);

  return (
    <div className="yw-container py-10 lg:py-16">
      {/* --------------------------- Kirish --------------------------- */}
      <header className="yw-enter max-w-[680px]">
        <Eyebrow>Biz haqimizda</Eyebrow>
        <h1 className="mt-5 text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink lg:text-[46px]">
          Yoshlar haqida.{" "}
          <span className="text-accent-text">Yoshlar tomonidan.</span>
        </h1>
        {paragraphs.map((text, index) => (
          <p
            key={index}
            className="mt-5 whitespace-pre-line text-[15.5px] leading-[1.8] text-ink-2"
          >
            {text}
          </p>
        ))}
      </header>

      <div className="mt-10">
        <StatsBar stats={stats} />
      </div>

      {/* ------------------- Badal to'lovi va qoidalar ------------------- */}
      {about.fee_enabled || about.rules.length > 0 ? (
        <section
          id="badal"
          aria-label="Badal toʻlovi va qoidalar"
          className="mt-16 grid scroll-mt-24 gap-4 lg:mt-24 lg:grid-cols-12 lg:gap-5"
        >
          {about.fee_enabled ? (
            <Reveal
              className={`relative overflow-hidden rounded-panel border border-line bg-surface p-6 sm:p-8 ${
                about.rules.length > 0 ? "lg:col-span-5" : "lg:col-span-12"
              }`}
            >
              <div className="yw-apply-bg yw-apply-bg--plain" aria-hidden />
              <div className="relative flex h-full flex-col">
                <IconChip icon={Wallet} />
                <h2 className="mt-5 text-[22px] font-bold tracking-[-0.02em] text-ink lg:text-[26px]">
                  {about.fee_title}
                </h2>

                {amount ? (
                  <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-[38px] font-extrabold leading-none tracking-[-0.035em] text-accent-text tabular-nums lg:text-[44px]">
                      {amount}
                    </span>
                    <span className="text-[16px] font-semibold text-ink">
                      {about.fee_currency}
                    </span>
                    {about.fee_period ? (
                      <span className="ml-1 rounded-full bg-accent-soft px-2.5 py-1 text-[11.5px] font-semibold text-accent-soft-fg">
                        {about.fee_period}
                      </span>
                    ) : null}
                  </p>
                ) : null}

                {about.fee_description ? (
                  <p className="mt-4 whitespace-pre-line text-[14.5px] leading-[1.75] text-ink-2">
                    {about.fee_description}
                  </p>
                ) : null}

                <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:items-center">
                  <ButtonLink href="/ariza" className="yw-press">
                    Ariza qoldirish
                    <ArrowRight className="size-4" />
                  </ButtonLink>
                  <a
                    href={telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-4 text-[14px] font-semibold text-accent-text transition-colors hover:bg-accent-soft"
                  >
                    <TelegramIcon className="size-[18px]" />
                    Savol berish
                  </a>
                </div>
              </div>
            </Reveal>
          ) : null}

          {about.rules.length > 0 ? (
            <Reveal
              delay={80}
              className={`rounded-panel border border-line bg-surface p-6 sm:p-8 ${
                about.fee_enabled ? "lg:col-span-7" : "lg:col-span-12"
              }`}
            >
              <h2 className="text-[22px] font-bold tracking-[-0.02em] text-ink lg:text-[26px]">
                {about.rules_title}
              </h2>
              <ol className="mt-5 space-y-3">
                {about.rules.map((rule, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3.5 rounded-card border border-line bg-surface-2 px-4 py-3.5"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-[12px] font-bold text-accent-fg tabular-nums">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-[14px] leading-relaxed text-ink">
                      {rule}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          ) : null}
        </section>
      ) : null}

      {/* ---------------------- Ijtimoiy tarmoqlar ---------------------- */}
      <section id="tarmoqlar" className="mt-16 scroll-mt-24 lg:mt-24">
        <Reveal>
          <h2 className="text-[24px] font-bold tracking-[-0.02em] text-ink lg:text-[30px]">
            Bizni kuzatib boring
          </h2>
          <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-2">
            Yangi profillar, tanlovlar va eʼlonlar birinchi boʻlib ijtimoiy
            tarmoqlardagi sahifalarimizda chiqadi.
          </p>
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              name: "Telegram",
              href: telegram,
              Icon: TelegramIcon,
              text: "Rasmiy kanal — yangiliklar va eʼlonlar",
              chip: "bg-[#229ed9] text-white",
            },
            {
              name: "Instagram",
              href: instagram,
              Icon: InstagramIcon,
              text: "Yoshlar hikoyalari, foto va videolar",
              chip: "bg-linear-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white",
            },
          ].map(({ name, href, Icon, text, chip }, index) => (
            <Reveal key={name} delay={index * 80}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-panel border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-yw sm:p-6"
              >
                <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${chip}`}>
                  <Icon className="size-7" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-ink-3">{name}</span>
                  <span className="block truncate text-[18px] font-bold tracking-[-0.01em] text-ink">
                    {socialHandle(href)}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-ink-2">{text}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-ink-3 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text" />
              </a>
            </Reveal>
          ))}
        </div>
      </section>

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
              <ul className="mt-5 space-y-2.5 text-[14px]">
                {contacts?.email ? (
                  <li>
                    <a
                      href={`mailto:${contacts.email}`}
                      className="inline-flex items-center gap-2.5 font-medium text-ink hover:text-accent-text"
                    >
                      <Mail className="size-[18px] text-accent-text" strokeWidth={1.9} />
                      {contacts.email}
                    </a>
                  </li>
                ) : null}
                <li>
                  <a
                    href={telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 font-medium text-ink hover:text-accent-text"
                  >
                    <TelegramIcon className="size-[18px] text-accent-text" />
                    Telegram: {socialHandle(telegram)}
                  </a>
                </li>
                <li>
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 font-medium text-ink hover:text-accent-text"
                  >
                    <InstagramIcon className="size-[18px] text-accent-text" />
                    Instagram: {socialHandle(instagram)}
                  </a>
                </li>
              </ul>
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
