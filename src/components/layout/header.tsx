"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Sahifa almashganda menyu yopiladi. Effekt emas, render paytida
  // holatni moslash — React tavsiya qiladigan naqsh.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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

      <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md">
        <div className="yw-container flex h-[72px] items-center gap-4">
          <Logo priority />

          <nav
            aria-label="Asosiy menyu"
            className="ml-auto hidden lg:flex lg:items-center lg:gap-8"
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

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1.5 lg:ml-8 lg:gap-2">
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

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Menyuni ochish"
              aria-expanded={menuOpen}
              className="grid size-9 shrink-0 place-items-center rounded-full text-ink hover:bg-surface-hover lg:hidden"
            >
              <Menu className="size-[22px]" strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobil menyu */}
      {menuOpen ? (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <button
            type="button"
            aria-label="Menyuni yopish"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 cursor-default bg-ink/30"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menyu"
            className="absolute inset-x-0 top-0 rounded-b-panel border-b border-line bg-surface p-5 shadow-yw-lg"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Yopish"
                className="grid size-9 place-items-center rounded-full text-ink hover:bg-surface-hover"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav aria-label="Mobil menyu" className="mt-5 flex flex-col">
              {navigation.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-xl px-3 py-3 text-[15px] ${
                      active
                        ? "bg-accent-soft font-semibold text-accent-soft-fg"
                        : "font-medium text-ink hover:bg-surface-hover"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
