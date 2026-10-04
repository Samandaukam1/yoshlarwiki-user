import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Download,
  FileImage,
  ShieldX,
  UserRound,
} from "lucide-react";

import { ShareButton } from "@/components/certificate/share-button";
import { buttonClass } from "@/components/ui";
import {
  CERTIFICATE_LABELS,
  formatIssuedOn,
  getCertificate,
  type PublicCertificate,
} from "@/lib/certificates";

// Sertifikat bekor qilinsa, sahifa bir daqiqada yangilanadi.
export const revalidate = 60;

// Oldindan hech narsa yig'ilmaydi — har bir sertifikat birinchi ochilganda
// tayyorlanib, keyin keshdan beriladi (ISR).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(
  props: PageProps<"/sertifikat/[code]">,
): Promise<Metadata> {
  const { code } = await props.params;
  const cert = await getCertificate(code);
  if (!cert) return { title: "Sertifikat topilmadi", robots: { index: false } };

  const label = CERTIFICATE_LABELS[cert.type];
  const title = `${label} — ${cert.recipient_name}`;
  const description = cert.is_revoked
    ? `${cert.code} raqamli sertifikat bekor qilingan.`
    : `${cert.recipient_name}ga YoshlarWiki Ensiklopediyasi tomonidan berilgan ${label.toLowerCase()} (${cert.code}).`;

  return {
    title,
    description,
    // Shaxsiy hujjat — qidiruv tizimlarida ko'rinmasin, lekin havola orqali ochiladi.
    robots: { index: false, follow: true },
    alternates: { canonical: `/sertifikat/${cert.code}` },
    openGraph: {
      title,
      description,
      url: `/sertifikat/${cert.code}`,
      images: cert.is_revoked
        ? undefined
        : [{ url: `/sertifikat/${cert.code}/rasm`, width: 1797, height: 1270, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-3 first:border-t-0 first:pt-0 last:pb-0">
      <dt className="shrink-0 text-[13px] text-ink-3">{label}</dt>
      <dd className="text-right text-[14px] font-semibold text-ink">{children}</dd>
    </div>
  );
}

function StatusBanner({ cert }: { cert: PublicCertificate }) {
  if (cert.is_revoked) {
    return (
      <div role="status" className="flex items-start gap-3.5 rounded-panel border border-danger/25 bg-danger-soft p-4 sm:p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-danger text-white">
          <ShieldX className="size-6" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[16px] font-bold text-danger">Sertifikat bekor qilingan</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">
            Ushbu sertifikat YoshlarWiki tahririyati tomonidan bekor qilingan va
            endi haqiqiy hisoblanmaydi
            {cert.revoked_at
              ? ` (${formatIssuedOn(cert.revoked_at)})`
              : ""}
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div role="status" className="flex items-start gap-3.5 rounded-panel border border-success/25 bg-success-soft p-4 sm:p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-success text-white">
        <BadgeCheck className="size-6" strokeWidth={2} />
      </span>
      <div>
        <p className="text-[16px] font-bold text-success">Sertifikat haqiqiy</p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">
          Ushbu sertifikat YoshlarWiki Ensiklopediyasi tomonidan berilgan va
          maʼlumotlar bazasida tasdiqlangan.
        </p>
      </div>
    </div>
  );
}

export default async function CertificatePage(props: PageProps<"/sertifikat/[code]">) {
  const { code } = await props.params;
  const cert = await getCertificate(code);
  if (!cert) notFound();

  const label = CERTIFICATE_LABELS[cert.type];
  const image = `/sertifikat/${cert.code}/rasm`;

  return (
    <div className="yw-container py-8 lg:py-14">
      <nav aria-label="Yoʻl" className="yw-enter flex items-center gap-1.5 text-[13px] text-ink-3">
        <Link href="/sertifikat" className="hover:text-accent-text">
          Sertifikatni tekshirish
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="font-medium text-ink-2">{cert.code}</span>
      </nav>

      <h1
        style={{ animationDelay: "80ms" }}
        className="yw-enter mt-4 text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[36px] lg:text-[42px]"
      >
        {label}
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
        <div className="min-w-0">
          <div className="yw-enter" style={{ animationDelay: "140ms" }}>
            <StatusBanner cert={cert} />
          </div>

          {cert.is_revoked ? null : (
            <>
              <div
                style={{ animationDelay: "220ms" }}
                className="yw-enter-pop mt-5 overflow-hidden rounded-panel border border-line bg-surface-2 shadow-yw-lg"
              >
                <Image
                  src={image}
                  alt={`${label} — ${cert.recipient_name}`}
                  width={1797}
                  height={1270}
                  unoptimized
                  preload
                  className="block h-auto w-full"
                />
              </div>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <a
                  href={`/sertifikat/${cert.code}/pdf`}
                  download
                  className={buttonClass("primary", "lg", "yw-press w-full sm:w-auto")}
                >
                  <Download className="size-[18px]" strokeWidth={2} />
                  PDF yuklab olish
                </a>
                <a
                  href={`${image}?yuklash=1`}
                  download
                  className={buttonClass("secondary", "lg", "yw-press w-full sm:w-auto")}
                >
                  <FileImage className="size-[18px]" strokeWidth={1.9} />
                  Rasm sifatida
                </a>
                <ShareButton
                  url={`/sertifikat/${cert.code}`}
                  title={`${label} — ${cert.recipient_name}`}
                  className={buttonClass("ghost", "lg", "yw-press w-full sm:w-auto")}
                />
              </div>
              <p className="mt-3 text-[12.5px] text-ink-3">
                PDF chop etishga tayyor (A4, albom) — tayyorlanishi bir necha soniya oladi.
              </p>
            </>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <section className="rounded-panel border border-line bg-surface p-5">
            <h2 className="text-[15px] font-bold text-ink">Sertifikat maʼlumotlari</h2>
            <dl className="mt-4">
              <Detail label="Egasi">{cert.recipient_name}</Detail>
              <Detail label="Turi">{label}</Detail>
              <Detail label="Raqami">
                <span className="tabular-nums">{cert.code}</span>
              </Detail>
              <Detail label="Berilgan sana">
                <span className="tabular-nums">{formatIssuedOn(cert.issued_on)}</span>
              </Detail>
              <Detail label="Holati">
                {cert.is_revoked ? (
                  <span className="text-danger">Bekor qilingan</span>
                ) : (
                  <span className="text-success">Faol</span>
                )}
              </Detail>
            </dl>
          </section>

          {cert.candidate ? (
            <Link
              href={`/yoshlar/${cert.candidate.slug}`}
              className="group flex items-center gap-4 rounded-panel border border-line bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-yw"
            >
              <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-surface-2">
                {cert.candidate.portrait_url ? (
                  <Image
                    src={cert.candidate.portrait_url}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover object-top"
                  />
                ) : (
                  <span className="grid size-full place-items-center text-ink-3">
                    <UserRound className="size-7" strokeWidth={1.5} />
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] text-ink-3">Ensiklopediyadagi profil</span>
                <span className="block truncate text-[15px] font-bold text-ink group-hover:text-accent-text">
                  {cert.candidate.full_name}
                </span>
                {cert.candidate.title ? (
                  <span className="block truncate text-[12.5px] text-ink-2">{cert.candidate.title}</span>
                ) : null}
              </span>
              <ArrowRight className="size-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-text" />
            </Link>
          ) : null}

          <Link
            href="/sertifikat"
            className="text-center text-[13px] font-medium text-accent-text hover:underline lg:text-left"
          >
            Boshqa sertifikatni tekshirish
          </Link>
        </aside>
      </div>
    </div>
  );
}
