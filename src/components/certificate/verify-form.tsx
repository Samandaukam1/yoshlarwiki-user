import { Search } from "lucide-react";

import { buttonClass } from "@/components/ui";

/**
 * Sertifikat raqami bo'yicha tekshirish formasi.
 * JavaScript'siz ham ishlaydi: oddiy GET so'rov /sertifikat?raqam=… ga
 * boradi, sahifa esa to'g'ri raqamni sertifikat sahifasiga yo'naltiradi.
 */
export function VerifyForm({
  defaultValue = "",
  error,
  autoFocus = false,
}: {
  defaultValue?: string;
  error?: string | null;
  autoFocus?: boolean;
}) {
  return (
    <form action="/sertifikat" method="get" className="w-full">
      <label htmlFor="sertifikat-raqam" className="block text-[13px] font-semibold text-ink">
        Sertifikat raqami
      </label>
      <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-3"
            strokeWidth={1.9}
            aria-hidden
          />
          <input
            id="sertifikat-raqam"
            name="raqam"
            defaultValue={defaultValue}
            required
            autoFocus={autoFocus}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="YW-2026-00001"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "sertifikat-xato" : undefined}
            className="h-[52px] w-full rounded-[12px] border border-line bg-surface pl-11 pr-4 text-[16px] font-semibold uppercase tracking-wide text-ink outline-none transition-colors placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-3 focus:border-accent-text sm:text-[15px]"
          />
        </div>
        <button type="submit" className={buttonClass("primary", "lg", "yw-press")}>
          Tekshirish
        </button>
      </div>
      {error ? (
        <p id="sertifikat-xato" role="alert" className="mt-2 text-[13px] text-danger">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-[12.5px] text-ink-3">
          Raqam sertifikatda «YW-» bilan boshlanadi, masalan YW-2026-00001.
        </p>
      )}
    </form>
  );
}
