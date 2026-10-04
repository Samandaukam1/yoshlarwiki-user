import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import QRCode from "qrcode";
import sharp, { type Sharp } from "sharp";

/**
 * Sertifikat chizish uchun resurslar: shriftlar, logotip, portret, imzo, QR.
 *
 * Shriftlar va logotip bir marta o'qiladi va jarayon davomida keshda
 * turadi (har so'rovda diskdan qayta o'qilmaydi).
 */

type FontWeight = 400 | 500 | 600 | 700 | 800;

export type SatoriFont = {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: "normal" | "italic";
};

const FONT_DIR = join(process.cwd(), "assets/fonts");

const FONT_FILES: Record<string, Omit<SatoriFont, "data"> & { file: string }> = {
  playfair600: { name: "Playfair", file: "PlayfairDisplay-SemiBold.ttf", weight: 600, style: "normal" },
  playfair700: { name: "Playfair", file: "PlayfairDisplay-Bold.ttf", weight: 700, style: "normal" },
  montserrat400: { name: "Montserrat", file: "Montserrat-Regular.ttf", weight: 400, style: "normal" },
  montserrat500: { name: "Montserrat", file: "Montserrat-Medium.ttf", weight: 500, style: "normal" },
  montserrat600: { name: "Montserrat", file: "Montserrat-SemiBold.ttf", weight: 600, style: "normal" },
  montserrat700: { name: "Montserrat", file: "Montserrat-Bold.ttf", weight: 700, style: "normal" },
  montserrat800: { name: "Montserrat", file: "Montserrat-ExtraBold.ttf", weight: 800, style: "normal" },
  montserratItalic: { name: "Montserrat", file: "Montserrat-Italic.ttf", weight: 400, style: "italic" },
  inter400: { name: "Inter", file: "Inter-Regular.ttf", weight: 400, style: "normal" },
  inter500: { name: "Inter", file: "Inter-Medium.ttf", weight: 500, style: "normal" },
  inter600: { name: "Inter", file: "Inter-SemiBold.ttf", weight: 600, style: "normal" },
  inter700: { name: "Inter", file: "Inter-Bold.ttf", weight: 700, style: "normal" },
  inter800: { name: "Inter", file: "Inter-ExtraBold.ttf", weight: 800, style: "normal" },
  script: { name: "GreatVibes", file: "GreatVibes-Regular.ttf", weight: 400, style: "normal" },
};

export type FontKey = keyof typeof FONT_FILES;

const fontCache = new Map<FontKey, Promise<SatoriFont>>();

function loadFont(key: FontKey): Promise<SatoriFont> {
  let pending = fontCache.get(key);
  if (!pending) {
    const { file, ...meta } = FONT_FILES[key];
    pending = readFile(join(FONT_DIR, file)).then((buffer) => ({
      ...meta,
      data: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer,
    }));
    // Xatolik keshda qolib ketmasin — keyingi so'rov qayta urinsin.
    pending.catch(() => fontCache.delete(key));
    fontCache.set(key, pending);
  }
  return pending;
}

export function loadFonts(keys: FontKey[]): Promise<SatoriFont[]> {
  return Promise.all(keys.map(loadFont));
}

/* ------------------------------------------------------------------ */
/* Rasmlar                                                            */
/* ------------------------------------------------------------------ */

function toDataUri(buffer: Buffer, mime: string) {
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

const LOGO_FILE = "public/assets/brand/png/certificate-logo.png";

let logoCache: Promise<string> | null = null;

/**
 * Brend belgisi (globus + YW + kitob), shaffof fonli PNG.
 * Manba: public/assets/brand/png/certificate-logo.png (990×715, chetlari kesilgan).
 */
export function loadLogo(): Promise<string> {
  if (!logoCache) {
    logoCache = readFile(join(process.cwd(), LOGO_FILE))
      .then((file) => sharp(file).resize({ width: 520 }).png().toBuffer())
      .then((png) => toDataUri(png, "image/png"));
    logoCache.catch(() => {
      logoCache = null;
    });
  }
  return logoCache;
}

const inkLogoCache = new Map<string, Promise<string>>();

/**
 * Muhr ichidagi logotip — bitta siyoh rangida, xuddi rezina muhr izi kabi:
 * logotipning to'q joylari to'liq siyoh, och joylari och iz, oq joylari
 * (kitob sahifalari) — bo'sh qog'oz.
 */
export function loadInkLogo(hex: string): Promise<string> {
  let pending = inkLogoCache.get(hex);
  if (!pending) {
    const ink = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
    pending = readFile(join(process.cwd(), LOGO_FILE))
      .then((file) =>
        sharp(file).resize({ width: 640 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
      )
      .then(({ data, info }) => {
        for (let i = 0; i < data.length; i += 4) {
          const luminance = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          const coverage = Math.min(1, Math.pow(1 - luminance, 0.75) * 1.35);
          data[i] = ink[0];
          data[i + 1] = ink[1];
          data[i + 2] = ink[2];
          data[i + 3] = Math.round(data[i + 3] * coverage);
        }
        return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
          .png()
          .toBuffer();
      })
      .then((png) => toDataUri(png, "image/png"));
    pending.catch(() => inkLogoCache.delete(hex));
    inkLogoCache.set(hex, pending);
  }
  return pending;
}

/** Takrorlanuvchi tasodifiy sonlar (har safar bir xil "siyoh izi"). */
function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Silliq tasodifiy maydon (value noise) — `cells`×`cells` katakli. */
function valueNoise(width: number, height: number, cells: number, random: () => number) {
  const grid = new Float32Array((cells + 1) * (cells + 1)).map(() => random());
  const field = new Float32Array(width * height);
  const smooth = (t: number) => t * t * (3 - 2 * t);
  for (let y = 0; y < height; y += 1) {
    const gy = (y / height) * cells;
    const y0 = Math.floor(gy);
    const ty = smooth(gy - y0);
    for (let x = 0; x < width; x += 1) {
      const gx = (x / width) * cells;
      const x0 = Math.floor(gx);
      const tx = smooth(gx - x0);
      const a = grid[y0 * (cells + 1) + x0];
      const b = grid[y0 * (cells + 1) + x0 + 1];
      const c = grid[(y0 + 1) * (cells + 1) + x0];
      const d = grid[(y0 + 1) * (cells + 1) + x0 + 1];
      field[y * width + x] = (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
    }
  }
  return field;
}

/**
 * Tekis chizilgan muhrni "qog'ozga bosilgan" ko'rinishga keltiradi:
 * siyoh notekis yuqqan (katta dog'lar), joy-joyida siyoh tushmagan
 * (mayda bo'shliqlar), donador tekstura va chetlari biroz yoyilgan.
 */
export async function inkStamp(png: Buffer, seed: number): Promise<Buffer> {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const random = seededRandom(seed);

  const blotches = valueNoise(width, height, 5, random); // katta: bosim notekisligi
  const patches = valueNoise(width, height, 46, random); // o'rta: siyoh tushmagan joylar
  const grain = valueNoise(width, height, 170, random); // mayda: qog'oz donadorligi

  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    const alpha = data[i + 3];
    if (alpha === 0) continue;

    let density = 0.7 + 0.3 * blotches[p];
    const patch = patches[p];
    if (patch < 0.2) density *= 0.12 + patch * 2.5;
    else if (patch < 0.3) density *= 0.72;
    density *= 0.8 + 0.2 * grain[p];

    data[i + 3] = Math.round(alpha * Math.min(1, density) * 0.9);
  }

  return sharp(data, { raw: { width, height, channels: 4 } })
    .blur(0.9)
    .png()
    .toBuffer();
}

/**
 * Masofaviy rasmni yuklab, har qanday formatdan (webp/avif/png/jpg)
 * Satori tushunadigan PNG/JPEG'ga o'tkazadi. Muvaffaqiyatsiz bo'lsa
 * `null` — sertifikat rasmsiz chiziladi, lekin baribir chiqadi.
 */
async function fetchImage(
  url: string,
  transform: (image: Sharp) => Sharp,
  mime: "image/png" | "image/jpeg",
): Promise<string | null> {
  if (!/^https:\/\//i.test(url)) return null;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    const input = Buffer.from(await response.arrayBuffer());
    const output = await transform(sharp(input, { failOn: "none" }).rotate()).toBuffer();
    return toDataUri(output, mime);
  } catch {
    return null;
  }
}

/** Portret — yuz tushadigan yuqori qism bilan kesilgan JPEG. */
export function loadPortrait(url: string | null | undefined): Promise<string | null> {
  if (!url) return Promise.resolve(null);
  return fetchImage(
    url,
    (image) =>
      image
        .resize({ width: 600, height: 760, fit: "cover", position: "top" })
        .jpeg({ quality: 88 }),
    "image/jpeg",
  );
}

export type SignatureImage = {
  src: string;
  /** kenglik / balandlik */
  aspect: number;
};

/** Loyiha rahbari Saidaxror Olimovning imzosi (ko'k — och fon uchun). */
const DEFAULT_SIGNATURE_FILE = "public/assets/brand/signature/saidaxror-olimov-blue.png";
export const DEFAULT_SIGNER = "Saidaxror Olimov";

let defaultSignatureCache: Promise<SignatureImage> | null = null;

async function toSignature(input: Buffer): Promise<SignatureImage> {
  const png = await sharp(input, { failOn: "none" })
    .trim()
    .resize({ height: 220, withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { src: toDataUri(png.data, "image/png"), aspect: png.info.width / png.info.height };
}

/**
 * Imzo rasmi:
 *  1. admin paneldan imzo havolasi berilgan bo'lsa — o'sha;
 *  2. aks holda, imzo qo'yuvchi standart (Saidaxror Olimov) bo'lsa — uning
 *     loyiha ichidagi imzosi;
 *  3. boshqa odam bo'lsa va rasm berilmagan bo'lsa — `null` (shablon ismni
 *     qo'lyozma shriftda yozadi).
 */
export async function loadSignature(
  url: string | null | undefined,
  signerName: string,
): Promise<SignatureImage | null> {
  if (url && /^https:\/\//i.test(url)) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (response.ok) return await toSignature(Buffer.from(await response.arrayBuffer()));
    } catch {
      // Tashqi rasm ochilmadi — standart imzoga qaytamiz.
    }
  }

  const name = signerName.trim();
  if (name && name !== DEFAULT_SIGNER) return null;

  if (!defaultSignatureCache) {
    defaultSignatureCache = readFile(join(process.cwd(), DEFAULT_SIGNATURE_FILE)).then(toSignature);
    defaultSignatureCache.catch(() => {
      defaultSignatureCache = null;
    });
  }
  return defaultSignatureCache;
}

/* ------------------------------------------------------------------ */
/* QR kod                                                             */
/* ------------------------------------------------------------------ */

/** QR kod — vektor SVG (har qanday o'lchamda tiniq), data URI ko'rinishida. */
export async function makeQr(text: string, color: string): Promise<string> {
  const svg = await QRCode.toString(text, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: color, light: "#00000000" },
  });
  return toDataUri(Buffer.from(svg), "image/svg+xml");
}
