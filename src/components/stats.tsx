import Link from "next/link";
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
export function formatStat(value: number): string {
  if (value < 100) return String(value);
  if (value < 1000) return `${Math.floor(value / 50) * 50}+`;
  return `${Math.floor(value / 500) * 500}+`;
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

/** Desktop uchun: bitta karta ichida 5 ta ustun, orasida ingichka ajratgich. */
export function StatsBar({
  stats,
  className = "",
}: {
  stats: PublicStats;
  className?: string;
}) {
  return (
    <div
      className={`rounded-panel border border-line bg-surface shadow-yw ${className}`}
    >
      <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {STAT_ITEMS.map((item, index) => (
          <div
            key={item.key}
            className={`flex items-center gap-3.5 px-5 py-5 lg:px-6 ${
              index > 0
                ? "border-t border-line sm:border-t-0 lg:border-l"
                : ""
            } ${index >= 2 ? "sm:border-t sm:first-of-type:border-t-0 lg:border-t-0" : ""} ${
              index % 2 === 1 ? "border-l sm:border-l" : ""
            }`}
          >
            <IconChip icon={item.icon} />
            <div className="min-w-0">
              <dd className="text-[21px] font-bold leading-tight tracking-[-0.01em] text-ink">
                {formatStat(stats[item.key])}
              </dd>
              <dt className="truncate text-[12.5px] text-ink-2">{item.label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Mobil bosh sahifa uchun: "Biz haqimizda" ro'yxati. */
export function StatsList({ stats }: { stats: PublicStats }) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <ul>
        {STAT_ITEMS.map((item, index) => (
          <li key={item.key}>
            <Link
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-surface-hover ${
                index > 0 ? "border-t border-line" : ""
              }`}
            >
              <IconChip icon={item.icon} />
              <span className="min-w-0 flex-1">
                <span className="block text-[19px] font-bold leading-tight text-ink">
                  {formatStat(stats[item.key])}
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
        ))}
      </ul>
    </div>
  );
}
