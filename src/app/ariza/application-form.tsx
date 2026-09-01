"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Phone,
  Send,
  Ticket,
  TriangleAlert,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useId, useState } from "react";

import { submitApplication } from "./actions";
import { initialApplicationState } from "./types";

const GENDERS = [
  { value: "ayol", label: "Ayol" },
  { value: "erkak", label: "Erkak" },
];

const AGE_RANGES = [
  { value: "14_18", label: "14–18" },
  { value: "19_24", label: "19–24" },
  { value: "25_29", label: "25–29" },
  { value: "35_plus", label: "35+" },
];

const FIELD_LABEL =
  "block text-[13px] font-semibold text-ink";
const FIELD_HELP = "mt-1 text-[12px] leading-snug text-ink-3";
const INPUT =
  "h-12 w-full rounded-[10px] border border-line bg-surface text-[14px] text-ink outline-none transition-colors focus:border-accent-text placeholder:text-ink-3";

/** Telefon raqamni "90 123 45 67" ko'rinishida ko'rsatadi. */
function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 9);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);
  return parts.join(" ");
}

export function ApplicationForm() {
  const [state, formAction, pending] = useActionState(
    submitApplication,
    initialApplicationState,
  );
  const [phone, setPhone] = useState("");
  const [promo, setPromo] = useState("");
  const ids = {
    name: useId(),
    phone: useId(),
    telegram: useId(),
    gender: useId(),
    age: useId(),
    promo: useId(),
  };

  const errorFor = (field: string) =>
    state.status === "error" && state.field === field ? state.message : null;

  if (state.status === "success") {
    return (
      <div className="yw-enter-pop rounded-panel border border-line bg-surface p-8 text-center shadow-yw lg:p-10">
        <span
          style={{ animationDelay: "150ms" }}
          className="yw-enter-pop mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-success"
        >
          <CheckCircle2 className="size-7" strokeWidth={1.8} />
        </span>
        <h2 className="mt-5 text-[22px] font-bold text-ink">
          {state.duplicate ? "Ariza allaqachon qabul qilingan" : "Rahmat!"}
        </h2>
        <p className="mx-auto mt-3 max-w-[380px] text-[14px] leading-relaxed text-ink-2">
          {state.message} Tez orada jamoamiz siz bilan bogʻlanadi.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/yoshlar"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-accent px-6 text-[14px] font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
          >
            Yoshlarni koʻrish
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-line bg-surface px-6 text-[14px] font-semibold text-ink transition-colors hover:bg-surface-hover"
          >
            Bosh sahifa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      className="rounded-panel border border-line bg-surface p-6 shadow-yw transition-shadow duration-300 hover:shadow-yw-lg sm:p-8"
    >
      <h2 className="text-[24px] font-bold tracking-[-0.02em] text-ink sm:text-[26px]">
        Ariza formasi
      </h2>
      <p className="mt-1.5 text-[13px] text-ink-2">
        Iltimos, barcha maydonlarni toʻgʻri toʻldiring.
      </p>

      {state.status === "error" && !state.field ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-[10px] bg-danger-soft px-4 py-3 text-[13px] text-danger"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          {state.message}
        </p>
      ) : null}

      {/* Bot tuzog'i */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute size-0 opacity-0"
      />

      <div className="mt-6 space-y-5">
        {/* 1. Ism familiya */}
        <div>
          <label htmlFor={ids.name} className={FIELD_LABEL}>
            Ism familiya
          </label>
          <div className="relative mt-2">
            <User
              className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-3"
              strokeWidth={1.8}
            />
            <input
              id={ids.name}
              name="full_name"
              required
              autoComplete="name"
              maxLength={120}
              aria-invalid={Boolean(errorFor("full_name"))}
              placeholder="Ism va familiyangizni kiriting"
              className={`${INPUT} pl-12 pr-4`}
            />
          </div>
          {errorFor("full_name") ? (
            <p role="alert" className="mt-1.5 text-[12px] text-danger">
              {errorFor("full_name")}
            </p>
          ) : null}
        </div>

        {/* 2. Telefon raqam */}
        <div>
          <label htmlFor={ids.phone} className={FIELD_LABEL}>
            Telefon raqamingiz
          </label>
          <p className={FIELD_HELP}>
            Iltimos ishlaydigan telefon raqam qoldiring
          </p>
          <div className="relative mt-2">
            <Phone
              className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-3"
              strokeWidth={1.8}
            />
            <span className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-[14px] font-medium text-ink-2">
              +998
            </span>
            <input
              id={ids.phone}
              name="phone"
              type="tel"
              inputMode="numeric"
              required
              autoComplete="tel-national"
              value={phone}
              onChange={(event) => setPhone(formatPhone(event.target.value))}
              aria-invalid={Boolean(errorFor("phone"))}
              aria-describedby={`${ids.phone}-help`}
              placeholder="90 123 45 67"
              className={`${INPUT} pl-[86px] pr-4`}
            />
          </div>
          <span id={`${ids.phone}-help`} className="sr-only">
            Oʻzbekiston raqami, mamlakat kodi +998
          </span>
          {errorFor("phone") ? (
            <p role="alert" className="mt-1.5 text-[12px] text-danger">
              {errorFor("phone")}
            </p>
          ) : null}
        </div>

        {/* 3. Telegram */}
        <div>
          <label htmlFor={ids.telegram} className={FIELD_LABEL}>
            Telegram profili ochiq telefon raqam yoki Telegram username
          </label>
          <p className={FIELD_HELP}>Username boʻlsa @ kuchukcha belgisi bilan</p>
          <div className="relative mt-2">
            <Send
              className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-3"
              strokeWidth={1.8}
            />
            <input
              id={ids.telegram}
              name="telegram"
              required
              maxLength={120}
              aria-invalid={Boolean(errorFor("telegram"))}
              placeholder="@username yoki +998 XX XXX XX XX"
              className={`${INPUT} pl-12 pr-4`}
            />
          </div>
          {errorFor("telegram") ? (
            <p role="alert" className="mt-1.5 text-[12px] text-danger">
              {errorFor("telegram")}
            </p>
          ) : null}
        </div>

        {/* 4. Jinsingiz */}
        <fieldset aria-describedby={ids.gender}>
          <legend className={FIELD_LABEL}>Jinsingiz?</legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {GENDERS.map((option) => (
              <label
                key={option.value}
                className="group relative flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-line bg-surface text-[14px] font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-hover has-checked:border-accent has-checked:bg-accent-soft has-checked:text-accent-soft-fg"
              >
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  required
                  className="sr-only"
                />
                <Users className="size-4" strokeWidth={1.9} aria-hidden />
                {option.label}
              </label>
            ))}
          </div>
          {errorFor("gender") ? (
            <p role="alert" id={ids.gender} className="mt-1.5 text-[12px] text-danger">
              {errorFor("gender")}
            </p>
          ) : null}
        </fieldset>

        {/* 5. Yoshingiz */}
        <fieldset aria-describedby={ids.age}>
          <legend className={FIELD_LABEL}>Yoshingiz</legend>
          <div className="mt-2 grid grid-cols-4 gap-2.5">
            {AGE_RANGES.map((option) => (
              <label
                key={option.value}
                className="flex h-12 cursor-pointer items-center justify-center rounded-[10px] border border-line bg-surface text-[14px] font-medium tabular-nums text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-hover has-checked:border-accent has-checked:bg-accent-soft has-checked:text-accent-soft-fg"
              >
                <input
                  type="radio"
                  name="age_range"
                  value={option.value}
                  required
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
          {errorFor("age_range") ? (
            <p role="alert" id={ids.age} className="mt-1.5 text-[12px] text-danger">
              {errorFor("age_range")}
            </p>
          ) : null}
        </fieldset>

        {/* 6. Promokod */}
        <div>
          <label htmlFor={ids.promo} className={FIELD_LABEL}>
            PROMOKOD <span className="font-normal text-ink-3">(Agar boʻlsa)</span>
          </label>
          <p className={FIELD_HELP}>
            Hamma harfni orasida joy qoldirmasdan bosh harflarda yoziladi
          </p>
          <div className="relative mt-2">
            <Ticket
              className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-3"
              strokeWidth={1.8}
            />
            <input
              id={ids.promo}
              name="promo_code"
              value={promo}
              onChange={(event) =>
                setPromo(event.target.value.toUpperCase().replace(/\s+/g, ""))
              }
              maxLength={40}
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="PROMOKOD"
              className={`${INPUT} pl-12 pr-4 tracking-wider`}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="yw-press mt-7 inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[10px] bg-accent text-[15px] font-semibold text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="size-[18px] animate-spin" />
            Yuborilmoqda…
          </>
        ) : (
          <>
            Ariza yuborish
            <ArrowRight className="size-[18px]" />
          </>
        )}
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-ink-3">
        <CalendarDays className="size-3.5" strokeWidth={1.9} aria-hidden />
        Arizangiz 1–3 ish kuni ichida koʻrib chiqiladi
      </p>
    </form>
  );
}
