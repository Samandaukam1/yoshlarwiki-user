import { getPublicSetting } from "./queries";
import { siteConfig } from "./site";
import { supabase } from "./supabase/server";

/**
 * Sertifikatlar — ma'lumot qatlami.
 *
 * Sertifikatlar admin paneldan yaratiladi (`certificates` jadvali).
 * Sayt jadvalni to'g'ridan-to'g'ri o'qiy olmaydi: bitta sertifikat aniq
 * raqami bo'yicha `get_certificate()` funksiyasi orqali olinadi — shu
 * sababli ro'yxatni "terib" chiqib bo'lmaydi.
 */

export type CertificateType = "mualliflik" | "azolik";

export type PublicCertificate = {
  code: string;
  type: CertificateType;
  recipient_name: string;
  /** YYYY-MM-DD */
  issued_on: string;
  is_revoked: boolean;
  revoked_at: string | null;
  /** Faqat nomzod profili nashr etilgan bo'lsa. */
  candidate: {
    slug: string;
    full_name: string;
    title: string | null;
    portrait_url: string | null;
    category: string | null;
    region: string | null;
  } | null;
};

export type CertificateSettings = {
  /** Imzo ostidagi ism (rasm bo'lmasa — qo'lyozma shriftda chiziladi). */
  signer_name: string;
  signer_title: string;
  /** Shaffof fonli imzo rasmi (PNG) havolasi — ixtiyoriy. */
  signature_url: string;
};

export const DEFAULT_CERTIFICATE_SETTINGS: CertificateSettings = {
  signer_name: "Saidaxror Olimov",
  signer_title: "Loyiha rahbari",
  signature_url: "",
};

export const CERTIFICATE_LABELS: Record<CertificateType, string> = {
  mualliflik: "Mualliflik sertifikati",
  azolik: "Aʼzolik sertifikati",
};

/** YW-2026-00001 */
export const CERTIFICATE_CODE_RE = /^YW-\d{4}-\d{5,7}$/;

export function normalizeCertificateCode(raw: string): string {
  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    // Buzuq URL kodlash — xom qiymat bilan davom etamiz (keyin regex rad etadi).
  }
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export async function getCertificate(rawCode: string): Promise<PublicCertificate | null> {
  const code = normalizeCertificateCode(rawCode);
  if (!CERTIFICATE_CODE_RE.test(code)) return null;

  const { data, error } = await supabase.rpc("get_certificate", { p_code: code });
  if (error || !data) return null;
  return data as unknown as PublicCertificate;
}

export async function getCertificateSettings(): Promise<CertificateSettings> {
  const stored = await getPublicSetting<Partial<CertificateSettings>>("certificate");
  return {
    signer_name: stored?.signer_name?.trim() || DEFAULT_CERTIFICATE_SETTINGS.signer_name,
    signer_title: stored?.signer_title?.trim() || DEFAULT_CERTIFICATE_SETTINGS.signer_title,
    signature_url: stored?.signature_url?.trim() || DEFAULT_CERTIFICATE_SETTINGS.signature_url,
  };
}

/** "2026-10-04" → "04.10.2026" (vaqt mintaqasidan qat'i nazar). */
export function formatIssuedOn(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split("-");
  return `${day}.${month}.${year}`;
}

/**
 * Sertifikatning ochiq tekshirish havolasi (QR kod shu yerga olib boradi).
 * Production'da muhit o'zgaruvchisi yo'q bo'lsa ham hech qachon localhost
 * bosilib qolmasligi uchun asosiy domenga qaytadi.
 */
export function certificateUrl(code: string): string {
  const base =
    process.env.NODE_ENV === "production" && /localhost|127\.0\.0\.1/.test(siteConfig.url)
      ? `https://${siteConfig.domain}`
      : siteConfig.url.replace(/\/+$/, "");
  return `${base}/sertifikat/${code}`;
}

export function certificateFileName(cert: Pick<PublicCertificate, "code">, ext: "pdf" | "jpg") {
  return `YoshlarWiki-sertifikat-${cert.code}.${ext}`;
}
