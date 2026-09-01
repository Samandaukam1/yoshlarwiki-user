export const siteConfig = {
  name: "YoshlarWiki",
  domain: "yoshlarwiki.uz",
  title: "YoshlarWiki — Yoshlar ensiklopediyasi",
  description:
    "Iqtidorli, faol va tashabbuskor yoshlar haqidagi maʼlumotlarni bir joyda jamlaymiz va dunyoga tanitamiz.",
  locale: "uz_UZ",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001",
} as const;

export const navigation = [
  { label: "Bosh sahifa", href: "/" },
  { label: "Kategoriyalar", href: "/kategoriyalar" },
  { label: "Yoshlar", href: "/yoshlar" },
  { label: "Ariza topshirish", href: "/ariza" },
  { label: "Biz haqimizda", href: "/biz-haqimizda" },
] as const;

export const footerLinks = [
  { label: "Kategoriyalar", href: "/kategoriyalar" },
  { label: "Yoshlar", href: "/yoshlar" },
  { label: "Ariza topshirish", href: "/ariza" },
  { label: "Biz haqimizda", href: "/biz-haqimizda" },
  { label: "Aloqa", href: "/biz-haqimizda#aloqa" },
] as const;

/** Profil sahifasidagi ichki navigatsiya bo'limlari. */
export const profileSections = [
  { id: "asosiy", num: "01", label: "Asosiy maʼlumot" },
  { id: "talim", num: "02", label: "Taʼlim" },
  { id: "faoliyat", num: "03", label: "Faoliyat" },
  { id: "yutuqlar", num: "04", label: "Yutuqlar" },
  { id: "loyihalar", num: "05", label: "Loyihalar" },
  { id: "galereya", num: "06", label: "Galereya" },
] as const;

export const GENDER_LABELS: Record<string, string> = {
  ayol: "Ayol",
  erkak: "Erkak",
};

export const AGE_RANGE_LABELS: Record<string, string> = {
  "14_18": "14–18",
  "19_24": "19–24",
  "25_29": "25–29",
  "35_plus": "35+",
};
