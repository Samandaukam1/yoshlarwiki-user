"use client";

import { useEffect, useState } from "react";

type Section = { id: string; num: string; label: string };

/**
 * Profil ichidagi navigatsiya. Skroll paytida faol bo'limni kuzatadi
 * va dizayndagi kabi "— 01 Asosiy ma'lumot" ko'rinishida chizadi.
 */
export function ProfileNav({
  sections,
  className = "",
}: {
  sections: Section[];
  className?: string;
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    if (sections.length === 0) return;

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -60% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Profil boʻlimlari" className={className}>
      <ul className="space-y-4">
        {sections.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center gap-3 text-[13px] transition-colors"
              >
                <span
                  aria-hidden
                  className={`h-px shrink-0 rounded-full transition-all ${
                    isActive ? "w-5 bg-accent-text" : "w-0 bg-transparent"
                  }`}
                />
                <span
                  className={`tabular-nums transition-colors ${
                    isActive ? "font-semibold text-accent-text" : "text-ink-3"
                  }`}
                >
                  {section.num}
                </span>
                <span
                  className={`whitespace-nowrap transition-colors ${
                    isActive
                      ? "font-semibold text-ink"
                      : "text-ink-3 group-hover:text-ink-2"
                  }`}
                >
                  {section.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
