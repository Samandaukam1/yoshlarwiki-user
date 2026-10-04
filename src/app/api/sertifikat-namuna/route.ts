import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

import { renderCertificateImage, renderCertificatePdf } from "@/lib/certificate-render/render";
import type { PublicCertificate } from "@/lib/certificates";

/**
 * Faqat lokal ishlab chiqish uchun: sertifikat dizaynini bazasiz, sinov
 * ma'lumotlari bilan ko'rish. Production'da mavjud emas (404).
 *
 *   /api/sertifikat-namuna?tur=mualliflik|azolik&format=jpg|pdf&ism=...&imzo=...
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const params = new URL(request.url).searchParams;
  const type = params.get("tur") === "azolik" ? "azolik" : "mualliflik";

  const cert: PublicCertificate = {
    code: "YW-2026-00427",
    type,
    recipient_name: params.get("ism") ?? "Jaxongir Qurbonnazarov",
    issued_on: "2026-10-04",
    is_revoked: false,
    revoked_at: null,
    candidate: {
      slug: "namuna",
      full_name: params.get("ism") ?? "Jaxongir Qurbonnazarov",
      title: params.get("kasb") ?? "Ijrochi direktor va moliyachi",
      portrait_url: null,
      category: params.get("yonalish") ?? "Biznes va tadbirkorlik",
      region: "Toshkent shahri",
    },
  };

  const settings = {
    signer_name: params.get("imzo") ?? "Saidaxror Olimov",
    signer_title: "Loyiha rahbari",
    signature_url: "",
  };

  // Portret o'rniga lokal fayl (masalan, ?rasm=public/assets/brand/png/app-icon-light-1024.png).
  const local = params.get("rasm");
  const portraitDataUri = local
    ? `data:image/jpeg;base64,${(
        await sharp(await readFile(join(process.cwd(), local)))
          .resize({ width: 600, height: 760, fit: "cover", position: "top" })
          .jpeg()
          .toBuffer()
      ).toString("base64")}`
    : null;

  const started = Date.now();
  if (params.get("format") === "pdf") {
    const pdf = await renderCertificatePdf(cert, settings, { portraitDataUri });
    return new Response(Buffer.from(pdf), {
      headers: { "Content-Type": "application/pdf", "X-Render-Ms": String(Date.now() - started) },
    });
  }

  const image = await renderCertificateImage(cert, settings, { portraitDataUri });
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/jpeg", "X-Render-Ms": String(Date.now() - started) },
  });
}
