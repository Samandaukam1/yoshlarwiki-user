import { renderCertificateImage } from "@/lib/certificate-render/render";
import { certificateFileName, getCertificate, getCertificateSettings } from "@/lib/certificates";

/**
 * Sertifikat rasmi (JPEG, ~1800 px) — sahifada ko'rsatish, Telegram/OG
 * ko'rinishi va "Rasm sifatida yuklab olish" uchun.
 * `?yuklash=1` bo'lsa fayl sifatida yuklab beriladi.
 */
export async function GET(request: Request, ctx: RouteContext<"/sertifikat/[code]/rasm">) {
  const { code } = await ctx.params;
  const cert = await getCertificate(code);

  if (!cert || cert.is_revoked) {
    return new Response("Sertifikat topilmadi", { status: 404 });
  }

  try {
    const settings = await getCertificateSettings();
    const image = await renderCertificateImage(cert, settings);
    const download = new URL(request.url).searchParams.has("yuklash");

    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${certificateFileName(cert, "jpg")}"`,
        "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Sertifikat rasmini chizishda xatolik:", error);
    return new Response("Sertifikatni tayyorlab boʻlmadi", { status: 500 });
  }
}
