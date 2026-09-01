import type { Metadata } from "next";

import { ApplicationForm } from "./application-form";
import { StatsBar } from "@/components/stats";
import { Eyebrow } from "@/components/ui";
import { getStats } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Ariza topshirish",
  description:
    "Yoshlar ensiklopediyasiga ariza qoldiring. Oʻzingiz haqingizdagi maʼlumotlarni biz bilan boʻlishing.",
  alternates: { canonical: "/ariza" },
  openGraph: {
    title: "Ariza topshirish | YoshlarWiki",
    description:
      "Yoshlar ensiklopediyasiga ariza qoldiring va boshqa yoshlar uchun ilhom manbaiga aylaning.",
    url: `${siteConfig.url}/ariza`,
  },
};

export default async function ArizaPage() {
  const stats = await getStats();

  return (
    <div className="relative overflow-hidden">
      <div className="yw-apply-bg" aria-hidden />

      <div className="yw-container relative py-10 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Chap ustun — matn */}
          <div className="max-w-[520px]">
            <span className="yw-enter inline-block" style={{ animationDelay: "60ms" }}>
              <Eyebrow>Ariza topshirish</Eyebrow>
            </span>
            <h1
              style={{ animationDelay: "160ms" }}
              className="yw-enter mt-5 text-[32px] font-extrabold leading-[1.12] tracking-[-0.03em] text-ink sm:text-[38px] lg:text-[42px]"
            >
              Yoshlar ensiklopediyasiga{" "}
              <span className="text-accent-text">ariza qoldiring</span>
            </h1>
            <p
              style={{ animationDelay: "280ms" }}
              className="yw-enter mt-5 text-[15px] leading-[1.75] text-ink-2"
            >
              Oʻzingiz haqingizdagi maʼlumotlarni biz bilan boʻlishing va boshqa
              yoshlar uchun ilhom manbaiga aylaning.
            </p>

            <ul className="mt-8 space-y-3 text-[14px] text-ink-2">
              {[
                "Arizani toʻldirish 2 daqiqa vaqt oladi",
                "Maʼlumotlaringiz faqat tahririyat tomonidan koʻriladi",
                "Tasdiqlangach profilingiz saytda eʼlon qilinadi",
              ].map((item, index) => (
                <li
                  key={item}
                  style={{ animationDelay: `${380 + index * 90}ms` }}
                  className="yw-enter flex items-start gap-3"
                >
                  <span
                    aria-hidden
                    className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent-text"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* O'ng ustun — forma */}
          <div
            style={{ animationDelay: "220ms" }}
            className="yw-enter lg:w-full lg:max-w-[540px] lg:justify-self-end"
          >
            <ApplicationForm />
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <StatsBar stats={stats} />
        </div>
      </div>
    </div>
  );
}
