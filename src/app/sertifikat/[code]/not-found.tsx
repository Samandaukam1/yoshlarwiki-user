import { SearchX } from "lucide-react";

import { VerifyForm } from "@/components/certificate/verify-form";
import { IconChip } from "@/components/ui";

export default function CertificateNotFound() {
  return (
    <div className="yw-container py-14 lg:py-20">
      <div className="mx-auto max-w-[560px] rounded-panel border border-line bg-surface p-6 text-center shadow-yw sm:p-10">
        <IconChip icon={SearchX} size="lg" className="mx-auto" />
        <h1 className="mt-5 text-[24px] font-extrabold tracking-[-0.02em] text-ink">
          Sertifikat topilmadi
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
          Bunday raqamli sertifikat YoshlarWiki maʼlumotlar bazasida yoʻq.
          Raqamni tekshirib, qaytadan kiriting.
        </p>
        <div className="mt-7 text-left">
          <VerifyForm />
        </div>
      </div>
    </div>
  );
}
