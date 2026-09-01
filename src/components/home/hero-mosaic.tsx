import Image from "next/image";

import type { HeroPortrait } from "@/lib/queries";

/**
 * Bosh sahifa hero mozaikasi.
 *
 * Desktopda kartalar dizayndagi kabi turli balandliklarda joylashadi —
 * o'lchamlar PDF'dan olingan foizlarga asoslangan. Mobilda esa dizayndagi
 * 4-3-4 ustunli kompakt grid ishlatiladi (desktop CSS shunchaki kichraytirilmagan).
 */

type Slot = {
  /** chapdan foiz */ left: number;
  /** kenglik foizda */ width: number;
  /** hero balandligining foizi */ top: number;
  /** kenglik / balandlik */ ratio: number;
};

const DESKTOP_SLOTS: Slot[] = [
  { left: 2.7, width: 10.6, top: 18.4, ratio: 0.63 },
  { left: 14.5, width: 9.8, top: 15.5, ratio: 0.62 },
  { left: 25.5, width: 9.3, top: 25.3, ratio: 0.68 },
  { left: 36.2, width: 9.9, top: 17.7, ratio: 0.64 },
  { left: 46.9, width: 10.6, top: 22.8, ratio: 0.84 },
  { left: 58.7, width: 10.5, top: 18.0, ratio: 0.66 },
  { left: 70.5, width: 11.9, top: 19.0, ratio: 0.77 },
  { left: 83.6, width: 10.2, top: 20.9, ratio: 0.62 },
  { left: 2.5, width: 10.2, top: 53.6, ratio: 0.61 },
  { left: 13.9, width: 10.5, top: 49.9, ratio: 0.65 },
  { left: 72.8, width: 10.8, top: 52.4, ratio: 0.58 },
  { left: 85.9, width: 11.4, top: 54.3, ratio: 0.67 },
];

/** Yuqoridagi bo'sh ("ghost") kartalar — dizaynda header ortida ko'rinadi. */
const GHOST_SLOTS = [
  { left: 3.2, width: 8.7 },
  { left: 13.1, width: 9.1 },
  { left: 25.5, width: 9.1 },
  { left: 35.9, width: 10.4 },
  { left: 47.1, width: 10.4 },
  { left: 58.7, width: 10.4 },
  { left: 70.3, width: 12.0 },
  { left: 83.6, width: 10.0 },
  { left: 94.4, width: 5.4 },
];

function Portrait({
  portrait,
  className = "",
  sizes,
  priority = false,
  style,
}: {
  portrait: HeroPortrait;
  className?: string;
  sizes: string;
  priority?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`relative overflow-hidden rounded-[14px] bg-surface-2 ${className}`}
    >
      <Image
        src={portrait.image_url}
        alt={portrait.alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-top"
      />
    </div>
  );
}

export function HeroMosaicDesktop({
  portraits,
}: {
  portraits: HeroPortrait[];
}) {
  if (portraits.length === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <div className="yw-container relative h-full">
        {GHOST_SLOTS.map((slot, index) => (
          <div
            key={`ghost-${index}`}
            className="absolute rounded-[14px] bg-ghost-card"
            style={{
              left: `${slot.left}%`,
              width: `${slot.width}%`,
              top: "-2%",
              height: "16%",
            }}
          />
        ))}

        {DESKTOP_SLOTS.map((slot, index) => {
          const portrait = portraits[index % portraits.length];
          return (
            <div
              key={portrait.id + index}
              className="absolute"
              style={{
                left: `${slot.left}%`,
                width: `${slot.width}%`,
                top: `${slot.top}%`,
                aspectRatio: slot.ratio,
              }}
            >
              <Portrait
                portrait={portrait}
                className="size-full"
                sizes="(min-width: 1280px) 140px, 12vw"
                priority={index < 4}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HeroMosaicMobile({ portraits }: { portraits: HeroPortrait[] }) {
  if (portraits.length === 0) return null;

  const at = (index: number) => portraits[index % portraits.length];

  // Kartalar pastdan tekislanadi, balandliklari esa dizayndagidek biroz farq qiladi.
  const rows: { items: number[]; ratios: number[]; inset: string; cols: string }[] =
    [
      { items: [0, 1, 2, 3], ratios: [0.61, 0.57, 0.62, 0.6], inset: "", cols: "grid-cols-4" },
      { items: [4, 5, 6], ratios: [0.71, 0.67, 0.72], inset: "mx-[9%]", cols: "grid-cols-3" },
      { items: [7, 8, 9, 10], ratios: [0.57, 0.56, 0.57, 0.56], inset: "", cols: "grid-cols-4" },
    ];

  return (
    <div aria-hidden className="flex flex-col gap-2.5 lg:hidden">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid items-end gap-2.5 ${row.cols} ${row.inset}`}
        >
          {row.items.map((index, itemIndex) => (
            <Portrait
              key={`${rowIndex}-${itemIndex}`}
              portrait={at(index)}
              style={{ aspectRatio: row.ratios[itemIndex] }}
              sizes="(min-width: 640px) 160px, 24vw"
              priority={rowIndex === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
