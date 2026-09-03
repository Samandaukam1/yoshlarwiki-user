import Link from "next/link";
import { createElement } from "react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ChefHat,
  Cpu,
  GraduationCap,
  HandHeart,
  HardHat,
  HeartPulse,
  Landmark,
  Leaf,
  Lightbulb,
  Mic,
  Palette,
  Plane,
  Scale,
  Shield,
  Sparkles,
  Sprout,
  Trophy,
  Truck,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Kategoriya ikonkalari                                              */
/* ------------------------------------------------------------------ */

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  "heart-pulse": HeartPulse,
  shield: Shield,
  "graduation-cap": GraduationCap,
  palette: Palette,
  "chef-hat": ChefHat,
  "book-open": BookOpen,
  lightbulb: Lightbulb,
  cpu: Cpu,
  trophy: Trophy,
  mic: Mic,
  sprout: Sprout,
  "hard-hat": HardHat,
  scale: Scale,
  leaf: Leaf,
  plane: Plane,
  landmark: Landmark,
  "hand-heart": HandHeart,
  truck: Truck,
};

export function categoryIcon(name: string | null | undefined): LucideIcon {
  return (name && CATEGORY_ICONS[name]) || Sparkles;
}

/**
 * Kategoriya ikonkasini nomi bo'yicha chizadi.
 * Render paytida komponent o'zgaruvchisi yaratilmasligi uchun alohida komponent.
 */
export function CategoryIcon({
  name,
  className,
  strokeWidth = 1.8,
}: {
  name: string | null | undefined;
  className?: string;
  strokeWidth?: number;
}) {
  // createElement: ikonka turi dinamik bo'lgani uchun render paytida
  // komponent o'zgaruvchisi yaratilmaydi.
  return createElement(categoryIcon(name), {
    className,
    strokeWidth,
    "aria-hidden": true,
  });
}

/* ------------------------------------------------------------------ */
/* Tugmalar                                                           */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold " +
  "transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-fg hover:bg-accent-hover",
  secondary:
    "border border-line bg-surface text-ink hover:bg-surface-hover hover:border-line-strong",
  ghost: "text-ink-2 hover:bg-surface-hover hover:text-ink",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-[14px]",
  lg: "h-[52px] px-7 text-[15px]",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra = "",
) {
  return `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${extra}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Kichik elementlar                                                  */
/* ------------------------------------------------------------------ */

/** "YOSHLAR ENSIKLOPEDIYASI" tipidagi kichik yorliq. */
export function Eyebrow({
  children,
  variant = "pill",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "pill" | "plain";
  className?: string;
}) {
  if (variant === "plain") {
    return (
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.14em] text-accent-text ${className}`}
      >
        {children}
      </p>
    );
  }
  return (
    <span
      className={`inline-flex items-center rounded-full bg-accent-soft px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-accent-soft-fg ${className}`}
    >
      {children}
    </span>
  );
}

/** Ochiq ko'k fonli kvadrat ikonka konteyneri. */
export function IconChip({
  icon: Icon,
  size = "md",
  className = "",
}: {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box =
    size === "sm" ? "size-9" : size === "lg" ? "size-12" : "size-11";
  const glyph =
    size === "sm" ? "size-[18px]" : size === "lg" ? "size-6" : "size-[21px]";
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-soft-fg ${box} ${className}`}
    >
      <Icon className={glyph} strokeWidth={1.8} />
    </span>
  );
}

/** Bo'lim sarlavhasi + ixtiyoriy "Barchasini ko'rish" havolasi. */
export function SectionHeading({
  title,
  href,
  linkLabel = "Barchasini koʻrish",
  className = "",
  id,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  id?: string;
}) {
  return (
    <div className={`flex items-end justify-between gap-4 ${className}`}>
      <h2
        id={id}
        className="text-[20px] font-bold tracking-[-0.01em] text-ink sm:text-[22px]"
      >
        {title}
      </h2>
      {href ? (
        <Link
          href={href}
          className="shrink-0 text-[13px] font-medium text-accent-text hover:underline"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Holat komponentlari                                                */
/* ------------------------------------------------------------------ */

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Sparkles,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center rounded-panel border border-line bg-surface px-6 py-14 text-center">
      <IconChip icon={Icon} size="lg" />
      <h3 className="mt-4 text-[17px] font-bold text-ink">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-md text-[14px] leading-relaxed text-ink-2">
          {description}
        </p>
      ) : null}
      {action ? (
        <ButtonLink href={action.href} className="mt-6">
          {action.label}
          <ArrowRight className="size-4" />
        </ButtonLink>
      ) : null}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`yw-skeleton rounded-lg ${className}`} />;
}
