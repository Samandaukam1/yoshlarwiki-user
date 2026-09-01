import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { Eyebrow } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="yw-container flex min-h-[52vh] flex-col items-center justify-center py-16 text-center">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-5 text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink lg:text-[42px]">
        Sahifa topilmadi
      </h1>
      <p className="mt-4 max-w-[440px] text-[15px] leading-relaxed text-ink-2">
        Siz izlagan sahifa oʻchirilgan yoki manzil notoʻgʻri kiritilgan
        boʻlishi mumkin.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-accent px-6 text-[14px] font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
        >
          Bosh sahifa
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/yoshlar"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-line bg-surface px-6 text-[14px] font-semibold text-ink transition-colors hover:bg-surface-hover"
        >
          <Search className="size-4" strokeWidth={1.9} />
          Yoshlarni qidirish
        </Link>
      </div>
    </div>
  );
}
