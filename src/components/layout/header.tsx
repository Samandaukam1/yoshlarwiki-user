"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { BottomNav } from "./bottom-nav";
import { Logo } from "./logo";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "@/components/theme";
import { navigation } from "@/lib/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  // "/" tugmasi bilan qidiruvni ochish.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (event.key === "/" && !typing) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-accent-fg"
      >
        Asosiy kontentga oʻtish
      </a>

      {/* viewport-fit=cover bilan sahifa status-bar ostiga ham yoyiladi —
          sarlavha xavfsiz hududdan pastda boshlanadi. */}
      <header className="bg-bg pt-[env(safe-area-inset-top)]">
        <div className="yw-container flex h-20 items-center gap-4">
          <Logo priority />

          <nav
            aria-label="Asosiy menyu"
            className="ml-auto hidden lg:flex lg:items-center lg:gap-5 xl:gap-8"
          >
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-1 text-[14px] transition-colors ${
                    active
                      ? "font-semibold text-accent-text"
                      : "font-medium text-ink hover:text-accent-text"
                  }`}
                >
                  {item.label}
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute -bottom-2.5 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-accent-text"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1.5 lg:ml-6 lg:gap-2 xl:ml-8">
            {/* Kecha/kunduz rejimi qidiruv yonida — barcha ekran o'lchamlarida. */}
            <ThemeToggle className="shrink-0" />

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Qidirish"
              className="grid size-9 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-surface-hover"
            >
              <Search className="size-[19px]" strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobil navigatsiya — burger menyu o'rniga ekran pastidagi panel. */}
      <BottomNav />

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
