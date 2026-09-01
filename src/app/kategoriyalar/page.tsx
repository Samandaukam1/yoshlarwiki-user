import type { Metadata } from "next";

import { CategoryCard } from "@/components/cards";
import { Reveal } from "@/components/reveal";
import { EmptyState, Eyebrow } from "@/components/ui";
import { getCategories, getCategoryCounts } from "@/lib/queries";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Kategoriyalar",
  description:
    "YoshlarWiki ensiklopediyasidagi barcha yoʻnalishlar: biznes, taʼlim, sogʻliqni saqlash, sanʼat, IT va boshqalar.",
  alternates: { canonical: "/kategoriyalar" },
};

export default async function CategoriesPage() {
  const [categories, counts] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
  ]);

  return (
    <div className="yw-container py-10 lg:py-16">
      <header className="yw-enter max-w-[640px]">
        <Eyebrow>Kategoriyalar</Eyebrow>
        <h1 className="mt-4 text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink lg:text-[44px]">
          Yoʻnalish boʻyicha{" "}
          <span className="text-accent-text">yoshlarni toping</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
          Har bir kategoriya oʻz sohasida faol yoshlarni birlashtiradi.
          Sizni qiziqtirgan yoʻnalishni tanlang.
        </p>
      </header>

      {categories.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Kategoriyalar hali qoʻshilmagan"
            description="Tez orada yoʻnalishlar roʻyxati toʻldiriladi."
          />
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={(index % 4) * 60}>
              <CategoryCard category={category} count={counts[category.slug] ?? 0} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
