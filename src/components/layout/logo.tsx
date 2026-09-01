import Link from "next/link";

/**
 * "• yoshlarwiki.uz" — dizayndagi logotip.
 * "yoshlar" ko'k, "wiki.uz" asosiy matn rangida, oldida kichik ko'k nuqta.
 */
export function Logo({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const text = size === "sm" ? "text-[17px]" : "text-[21px]";
  const dot = size === "sm" ? "size-1.5" : "size-2";

  return (
    <Link
      href="/"
      aria-label="YoshlarWiki — bosh sahifa"
      className={`group inline-flex items-center gap-2 ${className}`}
    >
      <span className={`rounded-full bg-accent-text ${dot}`} aria-hidden />
      <span
        className={`font-extrabold tracking-[-0.02em] ${text} leading-none`}
      >
        <span className="text-accent-text">yoshlar</span>
        <span className="text-ink">wiki.uz</span>
      </span>
    </Link>
  );
}
