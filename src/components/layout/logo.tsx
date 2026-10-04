import Link from "next/link";

import { YoshlarWikiLogo } from "../../../components/brand/YoshlarWikiLogo";

/**
 * Header/footer'dagi YoshlarWiki logotipi.
 *
 * Torroq ekranlarda (< sm) to'liq gorizontal PNG sarlavha qatoriga sig'maydi,
 * shuning uchun kvadrat "YW" belgisi yonida matnli yozuv ko'rsatiladi:
 * "YoshlarWiki" + "Ensiklopediyasi". Kengroq joyda esa yozuvi rasmning
 * o'zida bo'lgan to'liq gorizontal logotip chiqadi.
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
  const md = size === "md";
  const shortHeight = md ? "h-12" : "h-9";
  const horizontalHeight = md ? "h-[60px] xl:h-[72px]" : "h-8";

  return (
    <Link
      href="/"
      aria-label="YoshlarWiki Ensiklopediyasi — bosh sahifa"
      className={`group inline-flex shrink-0 items-center ${className}`}
    >
      {/* Ekran o'lchami va mavzu — ikki mustaqil o'lchov. Ularni bitta
          elementda "sm:hidden"+"dark:hidden" kabi tekis klasslar bilan
          qo'shsa, Tailwind ularni display uchun mustaqil OR shartlari
          sifatida qo'llaydi (AND emas) va ikkalasi ham baravar chiqib
          qolishi mumkin. Shu sabab ekran o'lchami ustki <span> orqali,
          mavzu esa YoshlarWikiLogo ichidagi dark:/hidden juftligi orqali
          — ikki alohida qatlamda boshqariladi. */}
      <span className="flex items-center gap-2 sm:hidden">
        <YoshlarWikiLogo
          variant="short"
          alt=""
          priority={priority}
          className={`${shortHeight} w-auto transition-transform duration-500 group-hover:scale-105`}
        />
        <span aria-hidden className="flex flex-col">
          <span
            className={`font-extrabold leading-none tracking-[-0.035em] ${
              md ? "text-[19px]" : "text-[16px]"
            }`}
          >
            <span className="bg-linear-to-r from-[#2f7bff] to-accent-text bg-clip-text text-transparent dark:from-[#5b9bff] dark:to-accent-text">
              Yoshlar
            </span>
            <span className="text-ink">Wiki</span>
          </span>
          <span
            className={`mt-[5px] flex items-center gap-1.5 font-semibold uppercase leading-none text-ink-3 ${
              md ? "text-[8.5px] tracking-[0.24em]" : "text-[7.5px] tracking-[0.2em]"
            }`}
          >
            <span className="h-px w-2.5 bg-accent-text/70" />
            Ensiklopediyasi
          </span>
        </span>
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
