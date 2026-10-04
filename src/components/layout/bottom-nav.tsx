"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Info, LayoutGrid, Plus, Trophy, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

type DockItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Markazdagi asosiy harakat — ko'k tugma ko'rinishida. */
  primary?: boolean;
};

/* Yorliqlar 5 ta ustunga sig'ishi uchun qisqa shaklda. */
const ITEMS: DockItem[] = [
  { href: "/", label: "Asosiy", icon: House },
  { href: "/kategoriyalar", label: "Kategoriya", icon: LayoutGrid },
  { href: "/ariza", label: "Ariza", icon: Plus, primary: true },
  { href: "/reyting", label: "Reyting", icon: Trophy },
  { href: "/biz-haqimizda", label: "InfoWiki", icon: Info },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Matn kiritiladigan maydon — klaviatura ochiladi. */
function isTextField(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable || target.tagName === "TEXTAREA") return true;
  if (target.tagName === "SELECT") return true;
  if (target.tagName !== "INPUT") return false;
  const type = (target as HTMLInputElement).type;
  return !["checkbox", "radio", "button", "submit", "reset", "range", "color", "file"].includes(type);
}

/**
 * Mobil pastki navigatsiya paneli.
 *
 * Ekran pastida suzib turuvchi shisha "dok": faol bo'limni yumshoq
 * tabletka belgilaydi va u sahifa almashganda bir tugmadan ikkinchisiga
 * silliq suzib o'tadi. Matn kiritilayotganda (klaviatura ochiq) panel
 * pastga yashirinadi — forma maydonlarini to'sib qo'ymaydi.
 */
export function BottomNav() {
  const pathname = usePathname();
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => setTyping(isTextField(event.target));
    const onFocusOut = (event: FocusEvent) => {
      if (!isTextField(event.relatedTarget)) setTyping(false);
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const activeIndex = ITEMS.findIndex((item) => isActive(pathname, item.href));
  const indicatorVisible = activeIndex >= 0 && !ITEMS[activeIndex].primary;

  return (
    <nav
      aria-label="Asosiy menyu"
      className={`fixed inset-x-0 z-[90] px-3 transition-[transform,opacity] duration-300 ease-out lg:hidden ${
        typing ? "pointer-events-none translate-y-[140%] opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)" }}
    >
      <div className="yw-dock mx-auto max-w-[440px] rounded-[24px] p-1.5">
        <ul className="relative grid grid-cols-5">
          {/* Suzuvchi faol belgi */}
          <li
            aria-hidden
            className="yw-dock-indicator pointer-events-none absolute inset-y-0 left-0 w-1/5"
            style={{
              transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
              opacity: indicatorVisible ? 1 : 0,
            }}
          >
            <span className="absolute inset-0 rounded-[18px] bg-accent-soft" />
          </li>

          {ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`yw-dock-item flex h-[60px] flex-col items-center justify-center gap-[3px] rounded-[18px] ${
                    item.primary
                      ? "text-accent-text"
                      : active
                        ? "text-accent-soft-fg"
                        : "text-ink-3 hover:text-ink"
                  }`}
                >
                  {item.primary ? (
                    <span
                      className={`grid size-[34px] place-items-center rounded-[12px] bg-accent text-accent-fg shadow-[0_6px_16px_-4px_rgb(0_80_250/0.55)] transition-transform duration-300 ${
                        active ? "scale-105" : ""
                      }`}
                    >
                      <Icon className="size-[20px]" strokeWidth={2.4} aria-hidden />
                    </span>
                  ) : (
                    // Markazdagi ko'k tugma bilan bir xil balandlik — barcha
                    // yorliqlar bitta chiziqda turadi.
                    <span className="grid h-[34px] place-items-center">
                      <Icon
                        className="size-[21px]"
                        strokeWidth={active ? 2.2 : 1.8}
                        aria-hidden
                      />
                    </span>
                  )}
                  <span
                    className={`text-[10.5px] leading-none tracking-[-0.005em] ${
                      active || item.primary ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
