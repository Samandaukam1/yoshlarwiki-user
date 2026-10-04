import "server-only";

import { ImageResponse } from "next/og";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

import {
  inkStamp,
  loadFonts,
  loadInkLogo,
  loadLogo,
  loadPortrait,
  loadSignature,
  makeQr,
  type FontKey,
} from "./assets";
import { AuthorshipCertificate } from "./authorship";
import { MembershipCertificate } from "./membership";
import { H, Seal, W } from "./shared";
import {
  CERTIFICATE_LABELS,
  certificateUrl,
  formatIssuedOn,
  type CertificateSettings,
  type PublicCertificate,
} from "@/lib/certificates";
import { siteConfig } from "@/lib/site";

/**
 * Sertifikatni rasm va PDF ko'rinishida chizadi.
 *
 * Yagona manba — Satori shabloni (authorship.tsx / membership.tsx):
 * saytdagi rasm, Telegram/OG ko'rinishi va PDF aynan bir xil chiqadi.
 * Matn vektor yo'llarga aylanib, so'ng kerakli o'lchamda rasterlanadi —
 * shuning uchun har qanday masshtabda tiniq.
 */

const FONTS: Record<PublicCertificate["type"], FontKey[]> = {
  mualliflik: [
    "playfair600",
    "playfair700",
    "montserrat400",
    "montserrat500",
    "montserrat600",
    "montserratItalic",
    "script",
  ],
  azolik: ["inter400", "inter500", "inter600", "inter700", "inter800", "script"],
};

/** A4 albom, punktlarda (1 pt = 1/72 dyuym). */
const A4_LANDSCAPE: [number, number] = [841.89, 595.28];

/* ------------------------------------------------------------------ */
/* Muhr — katta o'lchamda bir marta chiziladi va keshda saqlanadi      */
/* ------------------------------------------------------------------ */

const SEAL_SIZE = 640;

/* Siyoh ranglari: mualliflik — klassik ko'k-binafsha muhr siyohi, a'zolik — brend ko'ki. */
const SEALS: Record<PublicCertificate["type"], { color: string; font: FontKey; family: string; seed: number }> = {
  mualliflik: { color: "#22389a", font: "montserrat800", family: "Montserrat", seed: 20261004 },
  azolik: { color: "#0a49d6", font: "inter800", family: "Inter", seed: 5000427 },
};

const sealCache = new Map<PublicCertificate["type"], Promise<string>>();

function renderSeal(type: PublicCertificate["type"]): Promise<string> {
  let pending = sealCache.get(type);
  if (!pending) {
    const spec = SEALS[type];
    pending = Promise.all([loadInkLogo(spec.color), loadFonts([spec.font])]).then(async ([logo, fonts]) => {
      const response = new ImageResponse(
        (
          <div style={{ width: SEAL_SIZE, height: SEAL_SIZE, display: "flex", position: "relative" }}>
            <Seal
              size={SEAL_SIZE}
              left={0}
              top={0}
              color={spec.color}
              logo={logo}
              fontFamily={spec.family}
            />
          </div>
        ),
        { width: SEAL_SIZE, height: SEAL_SIZE, fonts },
      );
      const flat = Buffer.from(await response.arrayBuffer());
      const stamped = await inkStamp(flat, spec.seed);
      return `data:image/png;base64,${stamped.toString("base64")}`;
    });
    pending.catch(() => sealCache.delete(type));
    sealCache.set(type, pending);
  }
  return pending;
}

type RenderOptions = {
  /** Faqat lokal namuna uchun: portretni tayyor data URI sifatida berish. */
  portraitDataUri?: string | null;
};

async function renderPng(
  cert: PublicCertificate,
  settings: CertificateSettings,
  scale: number,
  options: RenderOptions = {},
): Promise<Buffer> {
  const isAuthorship = cert.type === "mualliflik";

  const [fonts, logo, seal, qr, signature, portrait] = await Promise.all([
    loadFonts(FONTS[cert.type]),
    loadLogo(),
    renderSeal(cert.type),
    makeQr(certificateUrl(cert.code), isAuthorship ? "#0f2147" : "#0a1020"),
    loadSignature(settings.signature_url, settings.signer_name),
    isAuthorship
      ? Promise.resolve(null)
      : options.portraitDataUri !== undefined
        ? Promise.resolve(options.portraitDataUri)
        : loadPortrait(cert.candidate?.portrait_url),
  ]);

  const common = {
    name: cert.recipient_name,
    code: cert.code,
    issuedOn: formatIssuedOn(cert.issued_on),
    verifyUrlLabel: `${siteConfig.domain}/sertifikat`,
    domain: siteConfig.domain,
    logo,
    seal,
    qr,
    signerTitle: settings.signer_title,
    signerName: settings.signer_name,
    signature,
  };

  const certificate = isAuthorship ? (
    <AuthorshipCertificate {...common} />
  ) : (
    <MembershipCertificate
      {...common}
      portrait={portrait}
      title={cert.candidate?.title ?? null}
      category={cert.candidate?.category ?? null}
      region={cert.candidate?.region ?? null}
    />
  );

  const width = Math.round(W * scale);
  const height = Math.round(H * scale);

  const response = new ImageResponse(
    (
      <div style={{ width, height, display: "flex", backgroundColor: "#ffffff" }}>
        <div
          style={{
            width: W,
            height: H,
            display: "flex",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {certificate}
        </div>
      </div>
    ),
    { width, height, fonts },
  );

  return Buffer.from(await response.arrayBuffer());
}

/** Sahifada ko'rsatish va ulashish uchun JPEG (~1800 px). */
export async function renderCertificateImage(
  cert: PublicCertificate,
  settings: CertificateSettings,
  options?: RenderOptions,
): Promise<Buffer> {
  const png = await renderPng(cert, settings, 1.6, options);
  return sharp(png).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
}

/** Chop etishga tayyor PDF: A4 albom, ~250 dpi. */
export async function renderCertificatePdf(
  cert: PublicCertificate,
  settings: CertificateSettings,
  options?: RenderOptions,
): Promise<Uint8Array> {
  const png = await renderPng(cert, settings, 2.6, options);
  const jpeg = await sharp(png).jpeg({ quality: 93, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer();

  const pdf = await PDFDocument.create();
  const label = CERTIFICATE_LABELS[cert.type];
  pdf.setTitle(`${label} — ${cert.recipient_name} (${cert.code})`);
  pdf.setAuthor("YoshlarWiki Ensiklopediyasi");
  pdf.setSubject(`${label} ${cert.code}`);
  pdf.setCreator(siteConfig.domain);
  pdf.setProducer(siteConfig.domain);
  pdf.setKeywords(["YoshlarWiki", "sertifikat", cert.code]);
  pdf.setCreationDate(new Date());

  const image = await pdf.embedJpg(jpeg);
  const page = pdf.addPage(A4_LANDSCAPE);
  page.drawImage(image, { x: 0, y: 0, width: A4_LANDSCAPE[0], height: A4_LANDSCAPE[1] });

  return pdf.save();
}
