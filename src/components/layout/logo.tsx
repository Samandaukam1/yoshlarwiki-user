import Link from "next/link";

import { YoshlarWikiLogo } from "../../../components/brand/YoshlarWikiLogo";

/**
 * Header/footer/mobil menyudagi YoshlarWiki logotipi.
 *
 * Torroq ekranlarda (< sm) tor sarlavha qatoriga sig'ishi uchun kvadrat
 * "short" logotip, kengroq joyda esa to'liq gorizontal logotip ko'rsatiladi
 * — shu bilan logotip hech qachon siqilib/cho'zilib ko'rinmaydi.
 */
export function Logo({
  className = "",
  size = "md",
  priority = false,
}: {
  className?: string;
  size?: "sm" | "md";
  priority?: boolean;
}) {
  const shortHeight = size === "sm" ? "h-7" : "h-16";
  const horizontalHeight = size === "sm" ? "h-8" : "h-[72px]";

  return (
    <Link
      href="/"
      aria-label="YoshlarWiki — bosh sahifa"
      className={`inline-flex shrink-0 items-center ${className}`}
    >
      {/* Ekran o'lchami va mavzu — ikki mustaqil o'lchov. Ularni bitta
          elementda "sm:hidden"+"dark:hidden" kabi tekis klasslar bilan
          qo'shsa, Tailwind ularni display uchun mustaqil OR shartlari
          sifatida qo'llaydi (AND emas) va ikkalasi ham bараvar chiqib
          qolishi mumkin. Shu sabab ekran o'lchami ustki <span> orqali,
          mavzu esa YoshlarWikiLogo ichidagi dark:/hidden juftligi orqali
          — ikki alohida qatlamda boshqariladi. */}
      <span className="sm:hidden">
        <YoshlarWikiLogo
          variant="short"
          alt=""
          priority={priority}
          className={`${shortHeight} w-auto`}
        />
      </span>
      <span className="hidden sm:inline-block">
        <YoshlarWikiLogo
          variant="horizontal"
          alt=""
          priority={priority}
          className={`${horizontalHeight} w-auto`}
        />
      </span>
    </Link>
  );
}
