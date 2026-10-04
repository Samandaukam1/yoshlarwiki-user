import { renderCertificatePdf } from "@/lib/certificate-render/render";
import { certificateFileName, getCertificate, getCertificateSettings } from "@/lib/certificates";

/** Chop etishga tayyor PDF (A4 albom). Har doim fayl sifatida yuklab beriladi. */
export async function GET(_request: Request, ctx: RouteContext<"/sertifikat/[code]/pdf">) {
  const { code } = await ctx.params;
  const cert = await getCertificate(code);

  if (!cert || cert.is_revoked) {
    return new Response("Sertifikat topilmadi", { status: 404 });
  }

  try {
    const settings = await getCertificateSettings();
    const pdf = await renderCertificatePdf(cert, settings);

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${certificateFileName(cert, "pdf")}"`,
        "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Sertifikat PDF'ini tayyorlashda xatolik:", error);
    return new Response("PDF'ni tayyorlab boʻlmadi", { status: 500 });
  }
}
