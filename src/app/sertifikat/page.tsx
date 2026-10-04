import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Award, IdCard, QrCode, ShieldCheck } from "lucide-react";

import { VerifyForm } from "@/components/certificate/verify-form";
import { Eyebrow, IconChip } from "@/components/ui";
import { CERTIFICATE_CODE_RE, normalizeCertificateCode } from "@/lib/certificates";

export const metadata: Metadata = {
  title: "Sertifikatni tekshirish",
  description:
    "YoshlarWiki Ensiklopediyasi tomonidan berilgan mualliflik va aʼzolik sertifikatlarining haqiqiyligini raqami boʻyicha tekshiring.",
  alternates: { canonical: "/sertifikat" },
};

const TYPES = [
  {
    icon: Award,
    title: "Mualliflik sertifikati",
    text: "Ensiklopediyaga maqola va materiallar taqdim etgan, ochiq bilimlar bazasini boyitgan mualliflarga beriladi.",
  },
  {
    icon: IdCard,
    title: "Aʼzolik sertifikati",
    text: "YoshlarWiki hamjamiyatining rasmiy aʼzosi ekanligini tasdiqlaydi — profil, loyihalar va imkoniyatlar.",
  },
];

export default async function VerifyPage(props: PageProps<"/sertifikat">) {
  const searchParams = await props.searchParams;
  const raw = typeof searchParams.raqam === "string" ? searchParams.raqam : "";

  let error: string | null = null;
  if (raw) {
    const code = normalizeCertificateCode(raw);
    if (CERTIFICATE_CODE_RE.test(code)) redirect(`/sertifikat/${code}`);
    error = "Raqam notoʻgʻri formatda. Masalan: YW-2026-00001";
  }

  return (
    <div className="relative overflow-hidden">
      <div className="yw-apply-bg" aria-hidden />

      <div className="yw-container relative py-10 lg:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-[540px]">
            <span className="yw-enter inline-block">
              <Eyebrow>Sertifikatlar</Eyebrow>
            </span>
            <h1
              style={{ animationDelay: "100ms" }}
              className="yw-enter mt-5 text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[38px] lg:text-[44px]"
            >
              Sertifikatni <span className="text-accent-text">tekshirish</span>
            </h1>
            <p
              style={{ animationDelay: "200ms" }}
              className="yw-enter mt-5 text-[15px] leading-[1.75] text-ink-2"
            >
              YoshlarWiki tomonidan berilgan har bir sertifikatning oʻz raqami va
              QR kodi bor. Raqamni kiriting yoki sertifikatdagi QR kodni telefon
              kamerasi bilan skanerlang — sertifikat haqiqiy yoki yoʻqligi darhol
              koʻrinadi.
            </p>

            <ul
              style={{ animationDelay: "280ms" }}
              className="yw-enter mt-7 space-y-3 text-[14px] text-ink-2"
            >
              <li className="flex items-center gap-3">
                <QrCode className="size-[18px] shrink-0 text-accent-text" strokeWidth={1.9} aria-hidden />
                QR kod toʻgʻridan-toʻgʻri sertifikat sahifasini ochadi
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-[18px] shrink-0 text-accent-text" strokeWidth={1.9} aria-hidden />
                Bekor qilingan sertifikatlar alohida belgilanadi
              </li>
            </ul>
          </div>

          <div
            style={{ animationDelay: "160ms" }}
            className="yw-enter rounded-panel border border-line bg-surface p-6 shadow-yw sm:p-8"
          >
            <VerifyForm defaultValue={raw} error={error} />
          </div>
        </div>

        <section aria-label="Sertifikat turlari" className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20">
          {TYPES.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-panel border border-line bg-surface p-5 sm:p-6">
              <IconChip icon={item.icon} />
              <div>
                <h2 className="text-[16px] font-bold text-ink">{item.title}</h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{item.text}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
