"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Info, LayoutGrid, Plus, Trophy, Users, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

type DockItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/* Yorliqlar 5 ta ustunga sig'ishi uchun qisqa shaklda. */
const ITEMS: DockItem[] = [
  { href: "/", label: "Asosiy", icon: House },
  { href: "/kategoriyalar", label: "Kategoriya", icon: LayoutGrid },
  { href: "/yoshlar", label: "Yoshlar", icon: Users },
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
 * Mobil pastki navigatsiya paneli + suzuvchi "Ariza topshirish" tugmasi.
 *
 * Panel — ekran pastida suzib turuvchi shisha "dok": faol bo'limni yumshoq
 * tabletka belgilaydi va u bo'limdan bo'limga silliq suzib o'tadi.
 *
 * Ariza tugmasi — o'ng burchakda, panel ustida. Sahifa pastga
 * aylantirilganda ixcham doiraga aylanadi, tepaga qaytilganda yozuvi bilan
 * kengayadi va vaqti-vaqti bilan ohista "nafas oladi".
 *
 * Matn kiritilayotganda (klaviatura ochiq) ikkalasi ham yashirinadi.
 */
export function BottomNav() {
  const pathname = usePathname();
  const [typing, setTyping] = useState(false);
  const [compact, setCompact] = useState(false);

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

  // Skroll yo'nalishi: pastga — ixcham, tepaga yoki sahifa boshida — keng.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 80) setCompact(false);
        else if (Math.abs(y - last) > 6) setCompact(y > last);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const activeIndex = ITEMS.findIndex((item) => isActive(pathname, item.href));
  const onApplyPage = isActive(pathname, "/ariza");
  const hidden = typing ? "pointer-events-none translate-y-[140%] opacity-0" : "translate-y-0 opacity-100";

  return (
    <>
      {/* ------------------------- Ariza tugmasi ------------------------- */}
      {onApplyPage ? null : (
        <Link
          href="/ariza"
          aria-label="Ariza topshirish"
          className={`yw-fab fixed right-4 z-[91] flex h-14 items-center rounded-full bg-accent pl-4 text-accent-fg transition-[transform,opacity,padding] duration-300 ease-out lg:hidden ${
            compact ? "pr-4" : "pr-5"
          } ${typing ? "pointer-events-none translate-y-8 scale-90 opacity-0" : ""}`}
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 92px)" }}
        >
          <span aria-hidden className="yw-fab-ring absolute inset-0 rounded-full" />
          <Plus className="relative size-6 shrink-0" strokeWidth={2.6} aria-hidden />
          <span
            className={`relative overflow-hidden whitespace-nowrap text-[14px] font-semibold transition-[max-width,opacity,margin] duration-300 ease-out ${
              compact ? "ml-0 max-w-0 opacity-0" : "ml-2 max-w-[160px] opacity-100"
            }`}
          >
            Ariza topshirish
          </span>
        </Link>
      )}

      {/* ------------------------- Pastki panel -------------------------- */}
      <nav
        aria-label="Asosiy menyu"
        className={`fixed inset-x-0 z-[90] px-3 transition-[transform,opacity] duration-300 ease-out lg:hidden ${hidden}`}
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
                opacity: activeIndex >= 0 ? 1 : 0,
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
                    className={`yw-dock-item flex h-[58px] flex-col items-center justify-center gap-1 rounded-[18px] ${
                      active ? "text-accent-soft-fg" : "text-ink-3 hover:text-ink"
                    }`}
                  >
                    <Icon className="size-[22px]" strokeWidth={active ? 2.2 : 1.8} aria-hidden />
                    <span
                      className={`text-[10.5px] leading-none tracking-[-0.005em] ${
                        active ? "font-semibold" : "font-medium"
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
    </>
  );
}
