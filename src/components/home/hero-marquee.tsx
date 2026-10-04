import Image from "next/image";
import Link from "next/link";

import type { CandidateCard } from "@/lib/queries";

/**
 * Bosh sahifa hero karuseli.
 *
 * Saytda e'lon qilingan haqiqiy yoshlarning portretlari ikki qatorda
 * chapdan o'ngga uzluksiz suzib turadi. Har bir karta shu yoshning
 * biografik sahifasiga (/yoshlar/[slug]) olib boradi.
 *
 * Animatsiya to'liq CSS'da (globals.css → .yw-marquee) — JavaScript yo'q,
 * GPU'da transform bilan ishlaydi, shuning uchun telefonda ham silliq.
 * Desktopda kursor ustiga borganda to'xtaydi.
 */

/** Bir yarim-trek kamida shuncha kartadan iborat — keng ekranda ham bo'sh joy qolmaydi. */
const MIN_PER_ROW = 12;
/** Har bir karta uchun soniya — tezlik ro'yxat uzunligiga bog'liq bo'lmasin. */
const SECONDS_PER_CARD = 4.2;

function repeatToLength<T>(list: T[], min: number): T[] {
  if (list.length === 0) return [];
  const out = [...list];
  while (out.length < min) out.push(...list);
  return out;
}

function MarqueeCard({
  candidate,
  hidden,
  eager,
}: {
  candidate: CandidateCard;
  /** Takroriy nusxa — ekran o'quvchi va Tab uchun yashirin. */
  hidden: boolean;
  eager: boolean;
}) {
  return (
    <Link
      href={`/yoshlar/${candidate.slug}`}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
      draggable={false}
      className="yw-glass yw-marquee-card group relative block aspect-[3/4] w-[118px] overflow-hidden rounded-[18px] sm:w-[148px] lg:w-[176px] lg:rounded-[20px]"
    >
      {candidate.portrait_url ? (
        <Image
          src={candidate.portrait_url}
          alt=""
          fill
          draggable={false}
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 1024px) 176px, (min-width: 640px) 148px, 118px"
          className="yw-glass-photo object-cover object-top"
        />
      ) : null}

      <span className="absolute inset-x-1.5 bottom-1.5 rounded-[13px] bg-linear-to-t from-[#0a1838]/85 to-[#0a1838]/55 px-2 py-1.5 backdrop-blur-md lg:inset-x-2 lg:bottom-2 lg:rounded-[14px] lg:px-2.5 lg:py-2">
        <span className="block truncate text-[11.5px] font-semibold leading-tight text-white sm:text-[12.5px] lg:text-[13.5px]">
          {candidate.full_name}
        </span>
        {candidate.title ? (
          <span className="mt-0.5 block truncate text-[10px] leading-tight text-white/75 sm:text-[11px] lg:text-[11.5px]">
            {candidate.title}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function MarqueeRow({
  items,
  speed = 1,
  offset = 0,
  label,
}: {
  items: CandidateCard[];
  /** 1 — odatiy; kattaroq qiymat — sekinroq. */
  speed?: number;
  /** Boshlang'ich siljish, soniyada — qatorlar bir xil turmasligi uchun. */
  offset?: number;
  label: string;
}) {
  const filled = repeatToLength(items, MIN_PER_ROW);
  const track = [...filled, ...filled];
  const duration = filled.length * SECONDS_PER_CARD * speed;

  // Animatsiya -50% dan boshlanadi — ya'ni ekranda dastlab ikkinchi yarmning
  // boshi ko'rinadi. Shu kartalar darhol (eager) yuklanadi.
  const firstVisible = filled.length;

  return (
    <div className="yw-marquee">
      <ul
        aria-label={label}
        className="yw-marquee-track"
        style={
          {
            "--yw-marquee-duration": `${duration}s`,
            animationDelay: `-${offset}s`,
          } as React.CSSProperties
        }
      >
        {track.map((candidate, index) => (
          <li key={`${candidate.id}-${index}`} className="shrink-0 pr-2.5 lg:pr-4">
            <MarqueeCard
              candidate={candidate}
              hidden={index >= items.length}
              eager={index >= firstVisible - 2 && index < firstVisible + 9}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HeroMarquee({ candidates }: { candidates: CandidateCard[] }) {
  const people = candidates.filter((item) => item.portrait_url);
  if (people.length === 0) return null;

  // Yetarli odam bo'lsa — ikki qatorga bo'linadi (har biri o'z odamlari bilan),
  // kam bo'lsa ikkinchi qator o'sha ro'yxatni boshqa tartibda ko'rsatadi.
  let top: CandidateCard[];
  let bottom: CandidateCard[];
  if (people.length >= 8) {
    top = people.filter((_, index) => index % 2 === 0);
    bottom = people.filter((_, index) => index % 2 === 1);
  } else {
    const half = Math.ceil(people.length / 2);
    top = people;
    bottom = [...people.slice(half), ...people.slice(0, half)];
  }

  return (
    <div className="flex flex-col gap-2.5 lg:gap-4">
      <MarqueeRow items={top} label="Yoshlar — birinchi qator" />
      {people.length > 1 ? (
        <MarqueeRow
          items={bottom}
          speed={1.18}
          offset={SECONDS_PER_CARD * 1.6}
          label="Yoshlar — ikkinchi qator"
        />
      ) : null}
    </div>
  );
}
