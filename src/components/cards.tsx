import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageOff, MapPin } from "lucide-react";

import { CategoryIcon } from "./ui";
import type { CandidateCard as CandidateCardData, Category } from "@/lib/queries";

/* ------------------------------------------------------------------ */
/* Kategoriya kartasi                                                 */
/* ------------------------------------------------------------------ */

/** Bosh sahifadagi kompakt katak: markazda ikonka, ostida ikki qatorli nom. */
export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/kategoriyalar/${category.slug}`}
      className="group flex h-full flex-col items-center gap-2.5 rounded-card border border-line bg-surface px-2.5 py-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-hover hover:shadow-yw"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-soft-fg transition-transform duration-300 group-hover:scale-110">
        <CategoryIcon name={category.icon} className="size-[19px]" />
      </span>
      <span className="text-[12px] font-medium leading-[1.35] text-ink-2">
        {category.name}
      </span>
    </Link>
  );
}

/** Kategoriyalar sahifasidagi to'liq karta. */
export function CategoryCard({
  category,
  count,
}: {
  category: Category;
  count?: number;
}) {
  return (
    <Link
      href={`/kategoriyalar/${category.slug}`}
      className="group flex h-full flex-col rounded-card border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-yw"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-soft-fg transition-transform duration-300 group-hover:scale-110">
        <CategoryIcon name={category.icon} className="size-[21px]" />
      </span>
      <h3 className="mt-3.5 text-[15px] font-bold leading-snug text-ink">
        {category.name}
      </h3>
      {category.description ? (
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-2">
          {category.description}
        </p>
      ) : null}
      <span className="mt-4 flex items-center justify-between pt-3 text-[12.5px] text-ink-3">
        <span>
          {typeof count === "number"
            ? `${count} ta profil`
            : "Profillarni koʻrish"}
        </span>
        <ArrowRight className="size-4 text-accent-text transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Nomzod kartasi                                                     */
/* ------------------------------------------------------------------ */

export function CandidateCard({
  candidate,
  priority = false,
}: {
  candidate: CandidateCardData;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/yoshlar/${candidate.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-line-strong hover:shadow-yw-lg"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
        {candidate.portrait_url ? (
          <Image
            src={candidate.portrait_url}
            alt={candidate.portrait_alt ?? candidate.full_name}
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
            priority={priority}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="grid size-full place-items-center text-ink-3">
            <ImageOff className="size-7" strokeWidth={1.5} />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-bold leading-snug text-ink">
          {candidate.full_name}
        </h3>
        {candidate.title ? (
          <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-accent-text">
            {candidate.title}
          </p>
        ) : null}

        <div className="mt-auto flex flex-col gap-1.5 pt-3.5 text-[12px] text-ink-3">
          {candidate.category ? (
            <span className="flex min-w-0 items-center gap-1.5">
              <CategoryIcon
                name={candidate.category.icon}
                className="size-[14px] shrink-0"
                strokeWidth={1.9}
              />
              <span className="truncate">{candidate.category.name}</span>
            </span>
          ) : null}
          {candidate.region ? (
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin className="size-[14px] shrink-0" strokeWidth={1.9} />
              <span className="truncate">{candidate.region.name}</span>
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export function CandidateCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <div className="yw-skeleton aspect-[4/5]" />
      <div className="space-y-2 p-4">
        <div className="yw-skeleton h-4 w-3/4 rounded" />
        <div className="yw-skeleton h-3 w-1/2 rounded" />
        <div className="yw-skeleton h-3 w-2/3 rounded pt-2" />
      </div>
    </div>
  );
}
