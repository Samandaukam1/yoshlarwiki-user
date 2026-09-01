import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";

import { CandidateCard } from "@/components/cards";
import { categoryIcon, EmptyState, Eyebrow, IconChip } from "@/components/ui";
import { getCategories, getCategoryBySlug, searchCandidates } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/kategoriyalar/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Kategoriya topilmadi", robots: { index: false, follow: false } };
  }

  const title = category.seo_title ?? category.name;
  const description =
    category.seo_description ??
    category.description ??
    `${category.name} yoʻnalishidagi yoshlar — ${siteConfig.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/kategoriyalar/${category.slug}` },
    openGraph: { title, description, url: `${siteConfig.url}/kategoriyalar/${category.slug}` },
  };
}

export default async function CategoryPage(
  props: PageProps<"/kategoriyalar/[slug]">,
) {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const results = await searchCandidates({ category: slug, limit: 24 });
  const Icon = categoryIcon(category.icon);

  return (
    <div className="yw-container py-10 lg:py-14">
      <nav aria-label="Yoʻnalish" className="flex items-center gap-1.5 text-[13px] text-ink-3">
        <Link href="/kategoriyalar" className="hover:text-accent-text">
          Kategoriyalar
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="text-ink-2">{category.name}</span>
      </nav>

      <header className="mt-6 flex items-start gap-4">
        <IconChip icon={Icon} size="lg" />
        <div className="min-w-0">
          <Eyebrow variant="plain">Kategoriya</Eyebrow>
          <h1 className="mt-1.5 text-[28px] font-extrabold leading-[1.15] tracking-[-0.025em] text-ink lg:text-[38px]">
            {category.name}
          </h1>
          {category.description ? (
            <p className="mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-ink-2">
              {category.description}
            </p>
          ) : null}
          <p className="mt-3 text-[13px] text-ink-3">
            {results.total} ta profil topildi
          </p>
        </div>
      </header>

      {results.items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={Icon}
            title="Bu yoʻnalishda hali profillar yoʻq"
            description="Tez orada bu kategoriyaga yangi yoshlar qoʻshiladi. Siz ham ariza qoldirishingiz mumkin."
            action={{ href: "/ariza", label: "Ariza qoldirish" }}
          />
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {results.items.map((candidate, index) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              priority={index < 4}
            />
          ))}
        </div>
      )}
    </div>
  );
}
