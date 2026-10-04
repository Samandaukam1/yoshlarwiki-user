import Link from "next/link";

import { CountUp, Reveal } from "./reveal";
import {
  Award,
  ChevronRight,
  FileText,
  GraduationCap,
  Globe,
  Users,
  type LucideIcon,
} from "lucide-react";

import { IconChip } from "./ui";
import type { PublicStats } from "@/lib/queries";

/**
 * Haqiqiy sonni dizayndagi ko'rinishga yaqinlashtiradi.
 * Kichik sonlar aniq ko'rsatiladi — soxta "2500+" chiqmaydi.
 */
export function formatStat(value: number): { value: number; suffix: string } {
  if (value < 100) return { value, suffix: "" };
  if (value < 1000) return { value: Math.floor(value / 50) * 50, suffix: "+" };
  return { value: Math.floor(value / 500) * 500, suffix: "+" };
}

type StatItem = {
  key: keyof PublicStats;
  label: string;
  icon: LucideIcon;
  href: string;
};

const STAT_ITEMS: StatItem[] = [
  { key: "candidates", label: "Yoshlar profili", icon: Users, href: "/yoshlar" },
  { key: "categories", label: "Kategoriyalar", icon: GraduationCap, href: "/kategoriyalar" },
  { key: "regions", label: "Shahar va viloyatlar", icon: Globe, href: "/yoshlar" },
  { key: "achievements", label: "Yutuq va mukofotlar", icon: Award, href: "/yoshlar" },
  { key: "approved_applications", label: "Tasdiqlangan arizalar", icon: FileText, href: "/ariza" },
];

/**
 * Kartalar orasidagi ajratgichlar — `gap-px` + chegara rangidagi fon.
 * Shu usulda chiziqlar har qanday ustunlar sonida aniq 1px bo'ladi va
 * yumaloq burchakdan tashqariga chiqib qolmaydi (`overflow-hidden`).
 *
 * Joylashuv: mobil — 2 ustun (oxirgisi to'liq kenglikda), planshet —
 * 6 qismli to'r (3 + 2 karta), desktop — bitta qatorda 5 ta ustun.
 */
const STAT_SPANS = [
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-3",
  "col-span-2 sm:col-span-3",
];

export function StatsBar({
  stats,
  className = "",
}: {
  stats: PublicStats;
  className?: string;
}) {
  return (
    <Reveal
      className={`overflow-hidden rounded-panel border border-line bg-line shadow-yw ${className}`}
    >
      <dl className="grid grid-cols-2 gap-px sm:grid-cols-6 lg:grid-cols-5">
        {STAT_ITEMS.map((item, index) => {
          const stat = formatStat(stats[item.key]);
          return (
            <div
              key={item.key}
              className={`flex min-w-0 flex-col gap-3 bg-surface p-4 sm:flex-row sm:items-center sm:gap-3.5 sm:px-5 sm:py-5 lg:col-span-1 lg:px-6 ${
                STAT_SPANS[index] ?? ""
              } ${index === STAT_ITEMS.length - 1 ? "max-sm:flex-row max-sm:items-center" : ""}`}
            >
              <IconChip icon={item.icon} size="sm" className="sm:size-11" />
              <div className="min-w-0">
                <dd className="text-[21px] font-bold leading-tight tracking-[-0.01em] text-ink tabular-nums">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-0.5 text-[12.5px] leading-snug text-ink-2">
                  {item.label}
                </dt>
              </div>
            </div>
          );
        })}
      </dl>
    </Reveal>
  );
}

/** Mobil bosh sahifa uchun: "Biz haqimizda" ro'yxati. */
export function StatsList({ stats }: { stats: PublicStats }) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <ul>
        {STAT_ITEMS.map((item, index) => {
          const stat = formatStat(stats[item.key]);
          return (
          <li key={item.key}>
            <Link
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-surface-hover ${
                index > 0 ? "border-t border-line" : ""
              }`}
            >
              <IconChip icon={item.icon} />
              <span className="min-w-0 flex-1">
                <span className="block text-[19px] font-bold leading-tight text-ink tabular-nums">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="block truncate text-[13px] text-ink-2">
                  {item.label}
                </span>
              </span>
              <ChevronRight
                className="size-[18px] shrink-0 text-ink-3"
                strokeWidth={2}
              />
            </Link>
          </li>
          );
        })}
      </ul>
    </div>
  );
}
