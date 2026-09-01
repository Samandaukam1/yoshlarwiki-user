import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  Calendar,
  ChevronRight,
  FolderKanban,
  GraduationCap,
  MapPin,
  Star,
  Trophy,
} from "lucide-react";

import { ProfileNav } from "@/components/candidate/profile-nav";
import { VideoButton } from "@/components/candidate/video-button";
import { ViewTracker } from "@/components/candidate/view-tracker";
import { SOCIAL_LABELS, socialIcon } from "@/components/social-icons";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { getCandidateBySlug, getPublishedSlugs } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/yoshlar/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const candidate = await getCandidateBySlug(slug);

  if (!candidate) {
    return { title: "Nomzod topilmadi", robots: { index: false, follow: false } };
  }

  const title =
    candidate.seo_title ??
    `${candidate.full_name}${candidate.title ? ` — ${candidate.title}` : ""}`;
  const description =
    candidate.seo_description ??
    candidate.intro ??
    `${candidate.full_name} haqida maʼlumot — ${siteConfig.name}.`;
  const url = `${siteConfig.url}/yoshlar/${candidate.slug}`;
  const image = candidate.og_image_url ?? candidate.portrait_url ?? undefined;

  return {
    title,
    description,
    keywords: candidate.keywords.length ? candidate.keywords : undefined,
    alternates: { canonical: candidate.canonical_url ?? `/yoshlar/${candidate.slug}` },
    robots: candidate.no_index
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "profile",
      url,
      title: candidate.og_title ?? title,
      description: candidate.og_description ?? description,
      images: image ? [{ url: image, alt: candidate.portrait_alt ?? candidate.full_name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: candidate.og_title ?? title,
      description: candidate.og_description ?? description,
      images: image ? [image] : undefined,
    },
  };
}

function formatDate(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}

const EDUCATION_LEVELS: Record<string, string> = {
  orta: "Oʻrta",
  orta_maxsus: "Oʻrta maxsus",
  bakalavr: "Bakalavr",
  magistr: "Magistr",
  doktorantura: "Doktorantura",
  kurs: "Kurs",
  boshqa: "Boshqa",
};

export default async function CandidatePage(
  props: PageProps<"/yoshlar/[slug]">,
) {
  const { slug } = await props.params;
  const candidate = await getCandidateBySlug(slug);

  if (!candidate) notFound();

  const facts = [
    { icon: Calendar, label: "Tugʻilgan sana", value: formatDate(candidate.birth_date) },
    { icon: MapPin, label: "Tugʻilgan joy", value: candidate.birth_place },
    { icon: GraduationCap, label: "Mutaxassisligi", value: candidate.specialization },
    { icon: Star, label: "Yoʻnalishi", value: candidate.direction },
    { icon: Briefcase, label: "Faoliyat sohasi", value: candidate.activity_field },
  ].filter((fact) => Boolean(fact.value));

  const sections = [
    { id: "asosiy", num: "01", label: "Asosiy maʼlumot", show: true },
    { id: "talim", num: "02", label: "Taʼlim", show: candidate.education.length > 0 },
    { id: "faoliyat", num: "03", label: "Faoliyat", show: candidate.experience.length > 0 },
    { id: "yutuqlar", num: "04", label: "Yutuqlar", show: candidate.achievements.length > 0 },
    { id: "loyihalar", num: "05", label: "Loyihalar", show: candidate.projects.length > 0 },
    { id: "galereya", num: "06", label: "Galereya", show: candidate.media.length > 0 },
  ]
    .filter((section) => section.show)
    .map(({ id, num, label }) => ({ id, num, label }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: candidate.full_name,
    url: `${siteConfig.url}/yoshlar/${candidate.slug}`,
    image: candidate.portrait_url ?? undefined,
    jobTitle: candidate.title ?? undefined,
    description: candidate.intro ?? undefined,
    birthDate: candidate.birth_date ?? undefined,
    birthPlace: candidate.birth_place
      ? { "@type": "Place", name: candidate.birth_place }
      : undefined,
    knowsAbout: candidate.keywords.length ? candidate.keywords : undefined,
    sameAs: candidate.social_links.map((link) => link.url),
    alumniOf: candidate.education.map((item) => ({
      "@type": "EducationalOrganization",
      name: item.institution,
    })),
    award: candidate.achievements.map((item) => item.title),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker slug={candidate.slug} />

      {/* ============================ HERO ============================ */}
      <section id="asosiy" className="relative overflow-hidden scroll-mt-24">
        <div className="yw-hero-bg" aria-hidden />

        <div className="yw-container relative">
          <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)_186px] lg:gap-10">
            {/* Matn ustuni */}
            <div className="relative z-10 pb-8 pt-10 lg:pb-16 lg:pt-16">
              <Eyebrow variant="plain">Yoshlar ensiklopediyasi</Eyebrow>

              <h1 className="mt-3 max-w-[9ch] text-[38px] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[52px] lg:text-[64px]">
                {candidate.full_name}
              </h1>

              {candidate.title ? (
                <p className="mt-3 text-[17px] font-semibold text-accent-text lg:text-[19px]">
                  {candidate.title}
                </p>
              ) : null}

              {candidate.intro ? (
                <p className="mt-4 max-w-[58%] text-[13.5px] leading-[1.75] text-ink-2 sm:max-w-[420px] lg:text-[14px]">
                  {candidate.intro}
                </p>
              ) : null}

              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a
                  href="#men-haqimda"
                  className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent px-6 text-[14px] font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
                >
                  Batafsil maʼlumot
                  <ArrowUpRight className="size-4" />
                </a>
                {candidate.video_url ? (
                  <VideoButton url={candidate.video_url} title={candidate.full_name} />
                ) : null}
              </div>

              {candidate.social_links.length > 0 ? (
                <ul className="mt-8 flex items-center gap-6">
                  {candidate.social_links.map((link) => {
                    const Icon = socialIcon(link.platform);
                    if (!Icon) return null;
                    return (
                      <li key={link.id}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer me"
                          aria-label={SOCIAL_LABELS[link.platform] ?? link.platform}
                          className="block text-ink-3 transition-colors hover:text-accent-text"
                        >
                          <Icon className="size-[22px]" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>

            {/* Portret */}
            {candidate.portrait_url ? (
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[46%] max-w-[260px] sm:max-w-[320px] lg:static lg:w-auto lg:max-w-none">
                <div className="relative h-full min-h-[320px] lg:h-[560px]">
                  <Image
                    src={candidate.portrait_url}
                    alt={candidate.portrait_alt ?? candidate.full_name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 380px, 46vw"
                    className="object-contain object-bottom"
                  />
                </div>
              </div>
            ) : null}

            {/* O'ng ustun: bo'limlar navigatsiyasi + fon raqami */}
            <div className="relative hidden lg:block">
              <span
                aria-hidden
                className="yw-watermark pointer-events-none absolute -top-24 right-8 select-none"
              >
                01
              </span>
              <div className="relative pb-16">
                <ProfileNav sections={sections} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== ASOSIY MA'LUMOTLAR ==================== */}
      {facts.length > 0 ? (
        <section className="yw-container">
          <div className="rounded-panel border border-line bg-surface">
            <dl className="grid lg:grid-cols-5">
              {facts.map((fact, index) => (
                <div
                  key={fact.label}
                  className={`flex items-start gap-3.5 px-5 py-4 lg:flex-col lg:gap-2.5 lg:px-6 lg:py-6 ${
                    index > 0 ? "border-t border-line lg:border-l lg:border-t-0" : ""
                  }`}
                >
                  <fact.icon
                    className="mt-0.5 size-[21px] shrink-0 text-accent-text lg:mt-0"
                    strokeWidth={1.7}
                  />
                  <div className="min-w-0">
                    <dt className="text-[12px] text-ink-3">{fact.label}</dt>
                    <dd className="mt-0.5 text-[14px] font-bold text-ink">
                      {fact.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* ========================= ASOSIY BLOK ======================== */}
      <div className="yw-container mt-12 lg:mt-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-x-14">
          {/* Mobilda bo'limlar bitta ustunda (order bilan), desktopda
              ikki mustaqil ustun — dizayndagidek qatorlar tekislanmaydi. */}
          <div className="contents lg:block lg:space-y-14">
          {/* --- Men haqimda --- */}
          <section
            id="men-haqimda"
            className="order-1 scroll-mt-24 lg:order-none"
          >
            <SectionHeading title="Men haqimda" />
            {candidate.about ? (
              <p className="mt-4 whitespace-pre-line text-[13.5px] leading-[1.85] text-ink-2">
                {candidate.about}
              </p>
            ) : null}

            {candidate.years_experience !== null || candidate.projects_count !== null ? (
              <div className="mt-6 grid grid-cols-2 gap-4">
                {candidate.years_experience !== null ? (
                  <StatCard
                    icon={Award}
                    value={`${candidate.years_experience}+`}
                    label="Yillik tajriba"
                  />
                ) : null}
                {candidate.projects_count !== null ? (
                  <StatCard
                    icon={FolderKanban}
                    value={`${candidate.projects_count}+`}
                    label="Tugallangan loyiha"
                  />
                ) : null}
              </div>
            ) : null}
          </section>

          {/* --- Yutuqlari (desktopda chap ustun, mobilda oxirida) --- */}
          {candidate.achievements.length > 0 ? (
            <section
              id="yutuqlar"
              className="order-4 scroll-mt-24 lg:order-none"
            >
              <SectionHeading title="Yutuqlari" />
              <ul className="mt-4 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface lg:space-y-2.5 lg:divide-y-0 lg:rounded-none lg:border-0 lg:bg-transparent">
                {candidate.achievements.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3.5 lg:rounded-[10px] lg:border lg:border-line lg:bg-surface"
                  >
                    <Trophy
                      className="size-[18px] shrink-0 text-accent-text"
                      strokeWidth={1.7}
                    />
                    <span className="min-w-0 flex-1 text-[13px] leading-snug text-ink-2">
                      {item.title}
                    </span>
                    <ChevronRight
                      className="size-4 shrink-0 text-ink-3"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          </div>

          <div className="contents lg:block lg:space-y-14">
          {/* --- Ta'limi --- */}
          {candidate.education.length > 0 ? (
            <section
              id="talim"
              className="order-2 scroll-mt-24 lg:order-none"
            >
              <SectionHeading title="Taʼlimi" />
              <div className="mt-4 space-y-3">
                {candidate.education.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-card border border-line bg-surface p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-[14px] font-bold leading-snug text-ink">
                        {item.institution}
                      </h3>
                      {item.start_year || item.end_year ? (
                        <span className="shrink-0 text-[13px] tabular-nums text-ink-3">
                          {item.start_year ?? "…"} —{" "}
                          {item.is_current ? "hozir" : (item.end_year ?? "…")}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4">
                      <p className="text-[13px] text-ink-2">{item.degree}</p>
                      {item.level ? (
                        <span className="shrink-0 rounded-md bg-surface-2 px-2.5 py-1 text-[12px] font-medium text-ink-2">
                          {EDUCATION_LEVELS[item.level] ?? item.level}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* --- Faoliyat yo'li --- */}
          {candidate.experience.length > 0 ? (
            <section
              id="faoliyat"
              className="order-3 scroll-mt-24 lg:order-none"
            >
              <SectionHeading title="Faoliyat yoʻli" />
              <ol className="relative mt-5">
                {candidate.experience.map((item, index) => (
                  <li key={item.id} className="relative flex gap-4 pb-7 last:pb-0">
                    <span className="w-11 shrink-0 pt-px text-[13px] font-bold tabular-nums text-accent-text">
                      {item.year_label}
                    </span>
                    <span className="relative flex w-3 shrink-0 justify-center">
                      <span className="z-10 mt-1.5 size-[9px] rounded-full bg-accent-text" />
                      {index < candidate.experience.length - 1 ? (
                        <span
                          aria-hidden
                          className="absolute left-1/2 top-2 h-full w-px -translate-x-1/2 bg-line-strong"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-bold text-ink">
                        {item.title}
                      </span>
                      {item.subtitle ? (
                        <span className="mt-0.5 block text-[13px] text-ink-2">
                          {item.subtitle}
                        </span>
                      ) : null}
                      {item.description ? (
                        <span className="mt-1.5 block text-[12.5px] leading-relaxed text-ink-3">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
          </div>
        </div>
      </div>

      {/* ========================= LOYIHALARI ========================= */}
      {candidate.projects.length > 0 ? (
        <section id="loyihalar" className="yw-container mt-14 scroll-mt-24 lg:mt-20">
          <SectionHeading title="Loyihalari" />
          <ul className="yw-scroll-x mt-5 flex gap-4 pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {candidate.projects.map((project) => {
              const Wrapper = project.url ? "a" : "div";
              return (
                <li
                  key={project.id}
                  className="w-[210px] shrink-0 snap-start lg:w-auto"
                >
                  <Wrapper
                    {...(project.url
                      ? {
                          href: project.url,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                    className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-all hover:border-line-strong hover:shadow-yw"
                  >
                    <div className="relative aspect-[16/10] bg-surface-2">
                      {project.image_url ? (
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          fill
                          sizes="(min-width: 1024px) 300px, 210px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="grid size-full place-items-center text-ink-3">
                          <FolderKanban className="size-6" strokeWidth={1.5} />
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 items-end justify-between gap-3 p-4">
                      <span className="min-w-0">
                        <span className="block text-[14px] font-bold text-ink">
                          {project.title}
                        </span>
                        {project.description ? (
                          <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-2">
                            {project.description}
                          </span>
                        ) : null}
                      </span>
                      {project.url ? (
                        <ArrowUpRight className="size-4 shrink-0 text-accent-text transition-transform group-hover:translate-x-0.5" />
                      ) : null}
                    </div>
                  </Wrapper>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* ========================== GALEREYA ========================== */}
      {candidate.media.length > 0 ? (
        <section id="galereya" className="yw-container mt-14 scroll-mt-24 lg:mt-20">
          <SectionHeading title="Galereya" />
          <ul className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {candidate.media.map((item) => (
              <li
                key={item.id}
                className="relative aspect-[4/3] overflow-hidden rounded-card border border-line bg-surface-2"
              >
                {item.kind === "image" ? (
                  <Image
                    src={item.url}
                    alt={item.alt ?? item.caption ?? candidate.full_name}
                    fill
                    sizes="(min-width: 1024px) 300px, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-full place-items-center text-[13px] text-accent-text"
                  >
                    {item.caption ?? "Faylni ochish"}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ========================== NAVIGATSIYA ======================= */}
      <div className="yw-container mt-16">
        <Link
          href="/yoshlar"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-accent-text hover:underline"
        >
          Barcha yoshlar
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Award;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-card border border-line bg-surface px-4 py-4">
      <Icon className="size-[22px] shrink-0 text-accent-text" strokeWidth={1.7} />
      <div className="min-w-0">
        <p className="text-[18px] font-bold leading-tight text-ink">{value}</p>
        <p className="truncate text-[12px] text-ink-2">{label}</p>
      </div>
    </div>
  );
}
