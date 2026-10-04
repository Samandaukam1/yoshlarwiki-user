import { getPublicSetting } from "./queries";

/**
 * "Biz haqimizda" sahifasining tahrirlanadigan matni.
 * Admin paneldagi "Biz haqimizda" bo'limidan `site_settings` jadvalidagi
 * `about` kaliti ostida saqlanadi. Yozuv hali yaratilmagan bo'lsa
 * quyidagi standart matn ko'rsatiladi.
 *
 * Bu turning nusxasi admin repoda ham bor:
 * yoshlarwiki-admin/src/app/(panel)/biz-haqimizda/types.ts
 */
export type AboutContent = {
  /** Sahifa boshidagi umumiy ma'lumot. Bo'sh qator — yangi xatboshi. */
  intro: string;
  fee_enabled: boolean;
  fee_title: string;
  /** Faqat raqamlar, masalan "150000". Bo'sh bo'lsa narx ko'rsatilmaydi. */
  fee_amount: string;
  fee_currency: string;
  /** Narx ostidagi izoh, masalan "bir martalik". */
  fee_period: string;
  fee_description: string;
  rules_title: string;
  rules: string[];
};

export type Contacts = {
  email?: string;
  telegram?: string;
  instagram?: string;
  youtube?: string;
};

export const DEFAULT_ABOUT: AboutContent = {
  intro:
    "YoshlarWiki — Oʻzbekiston yoshlari haqidagi ochiq ensiklopediya. Biz turli sohalarda faoliyat yuritayotgan iqtidorli, faol va tashabbuskor yoshlar haqidagi maʼlumotlarni bir joyda jamlaymiz, tartibga solamiz va ularni keng jamoatchilikka tanitamiz.",
  fee_enabled: true,
  fee_title: "Badal toʻlovi",
  fee_amount: "",
  fee_currency: "soʻm",
  fee_period: "bir martalik",
  fee_description:
    "Profilni tayyorlash, tahrir qilish va ensiklopediyada eʼlon qilish xizmati uchun badal toʻlovi mavjud. Toʻlov tartibi haqida tahririyat arizangizni koʻrib chiqqach siz bilan bogʻlanib batafsil maʼlumot beradi.",
  rules_title: "Qoidalar",
  rules: [
    "Arizada faqat haqiqiy va tekshirilishi mumkin boʻlgan maʼlumotlar koʻrsatiladi.",
    "Har bir profil eʼlon qilinishidan oldin tahririyat tekshiruvidan oʻtadi.",
    "Badal toʻlovi profilni tayyorlash va joylash xizmati uchun olinadi.",
    "Notoʻgʻri yoki chalgʻituvchi maʼlumot aniqlansa, profil olib tashlanadi.",
  ],
};

/** Ijtimoiy tarmoq havolalari admin paneldan kiritilmagan bo'lsa. */
export const DEFAULT_SOCIALS = {
  telegram: "https://t.me/yoshlarwiki",
  instagram: "https://instagram.com/yoshlarwiki",
};

export async function getAboutContent(): Promise<AboutContent> {
  const stored = await getPublicSetting<Partial<AboutContent>>("about");
  if (!stored) return DEFAULT_ABOUT;

  return {
    ...DEFAULT_ABOUT,
    ...Object.fromEntries(
      Object.entries(stored).filter(([, value]) => value !== null && value !== undefined),
    ),
    rules: Array.isArray(stored.rules)
      ? stored.rules.filter((rule) => typeof rule === "string" && rule.trim())
      : DEFAULT_ABOUT.rules,
  };
}

/** "150000" → "150 000". */
export function formatAmount(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** "https://t.me/yoshlarwiki" yoki "@yoshlarwiki" → "@yoshlarwiki". */
export function socialHandle(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  if (trimmed.startsWith("@")) return trimmed;
  const last = trimmed.split("/").pop() ?? trimmed;
  return `@${last.replace(/^@/, "")}`;
}

/** "@yoshlarwiki" yoki "yoshlarwiki" kiritilgan bo'lsa ham to'liq havola. */
export function socialUrl(value: string, base: "https://t.me/" | "https://instagram.com/"): string {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${base}${trimmed.replace(/^@/, "")}`;
}
