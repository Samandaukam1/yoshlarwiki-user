/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import type { SignatureImage } from "./assets";
import {
  fitFontSize,
  fitSignature,
  H,
  IconBadgeCheck,
  IconCalendar,
  IconCompass,
  IconGlobe,
  IconHash,
  LOGO_ASPECT,
  SealImage,
  uz,
  W,
} from "./shared";

/**
 * AʼZOLIK SERTIFIKATI — YoshlarWiki'ning o'z uslubida.
 *
 * Sayt dizayn tizimidan: brend ko'k (#0050FA), qaymoqrang fon, Inter
 * shrifti, "Yoshlar tomonidan." dagi kabi qo'lda chizilgan ko'k chiziq,
 * yumaloq kartalar va och-ko'k ikonka "chiplari". Chapdagi ko'k panelda
 * a'zoning portreti — a'zolik guvohnomasi ruhida.
 */

export type MembershipProps = {
  name: string;
  code: string;
  issuedOn: string;
  verifyUrlLabel: string;
  domain: string;
  logo: string;
  qr: string;
  /** Oldindan chizilgan muhr (render.tsx → renderSeal). */
  seal: string;
  portrait: string | null;
  title: string | null;
  category: string | null;
  region: string | null;
  signerTitle: string;
  signerName: string;
  signature: SignatureImage | null;
};

const BLUE = "#0050fa";
const BLUE_DEEP = "#0036b8";
const INK = "#0a1020";
const INK2 = "#575d6e";
const INK3 = "#8a8c96";
const CREAM = "#f6f2ea";
const SURFACE = "#fffdf9";
const LINE = "#e8e1d5";
const SOFT = "#e7edfb";

const SANS = "Inter";
const PANEL = 372;
const LEFT = PANEL + 56;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 14px",
        minHeight: 78,
        backgroundColor: SURFACE,
        border: `1px solid ${LINE}`,
        borderRadius: 16,
        boxShadow: "0 1px 2px rgba(60,42,20,0.05), 0 8px 22px rgba(60,42,20,0.06)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: 12,
          backgroundColor: SOFT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 11, color: INK3 }}>{label}</div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 14.5,
            lineHeight: 1.25,
            color: INK,
            marginTop: 2,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

/** Chap paneldagi globus chiziqlari (meridian/parallellar). */
function GlobeLines() {
  return (
    <svg
      width={PANEL}
      height={H}
      viewBox={`0 0 ${PANEL} ${H}`}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <g fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={1.2}>
        <circle cx={300} cy={760} r={250} />
        <ellipse cx={300} cy={760} rx={120} ry={250} />
        <ellipse cx={300} cy={760} rx={190} ry={250} />
        <path d="M50 760 H550" />
        <ellipse cx={300} cy={760} rx={250} ry={90} />
        <ellipse cx={300} cy={760} rx={250} ry={170} />
        <circle cx={40} cy={40} r={150} />
        <circle cx={40} cy={40} r={110} />
      </g>
    </svg>
  );
}

export function MembershipCertificate(props: MembershipProps) {
  const name = uz(props.name);
  const nameSize = fitFontSize(name, 46, 28, 22);

  return (
    <div
      style={{
        width: W,
        height: H,
        display: "flex",
        position: "relative",
        // overflow: hidden YO'Q — Satori'da scale() bilan birga rasmlarni
        // noto'g'ri kesib tashlaydi. Chetdan chiqqan qism baribir tuvaldan tashqarida.
        backgroundColor: CREAM,
        fontFamily: SANS,
      }}
    >
      {/* O'ng tomon: nozik vertikal to'r va yumshoq ko'k nur (sayt hero foni kabi) */}
      <div
        style={{
          position: "absolute",
          left: PANEL,
          top: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          backgroundImage:
            "radial-gradient(circle at 78% 18%, rgba(0,80,250,0.08) 0%, rgba(0,80,250,0) 45%)",
        }}
      />
      <svg
        width={W - PANEL}
        height={H}
        viewBox={`0 0 ${W - PANEL} ${H}`}
        style={{ position: "absolute", left: PANEL, top: 0 }}
      >
        {[1, 2, 3, 4, 5].map((index) => (
          <line
            key={index}
            x1={index * 125}
            y1={0}
            x2={index * 125}
            y2={H}
            stroke="rgba(60,42,20,0.045)"
            strokeWidth={1}
          />
        ))}
        <circle cx={W - PANEL + 30} cy={-30} r={170} fill="none" stroke="rgba(0,80,250,0.10)" strokeWidth={1.2} />
        <circle cx={W - PANEL + 30} cy={-30} r={125} fill="none" stroke="rgba(0,80,250,0.08)" strokeWidth={1.2} />
      </svg>

      {/* ------------------------------ Ko'k panel ------------------------------ */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: PANEL,
          height: H,
          display: "flex",
          backgroundImage: `linear-gradient(160deg, #2a77ff 0%, ${BLUE} 42%, ${BLUE_DEEP} 100%)`,
        }}
      />
      <GlobeLines />

      {/* Logotip va yozuv */}
      <div style={{ position: "absolute", left: 40, top: 42, display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 18,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 24px rgba(0,25,90,0.35)",
          }}
        >
          <img src={props.logo} width={52} height={52 * LOGO_ASPECT} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontWeight: 800, fontSize: 23, letterSpacing: -0.8, color: "#ffffff", lineHeight: 1 }}>
            YoshlarWiki
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 7 }}>
            <div style={{ width: 12, height: 1.4, backgroundColor: "rgba(255,255,255,0.7)", display: "flex" }} />
            <div style={{ fontWeight: 600, fontSize: 9.5, letterSpacing: 2.6, color: "rgba(255,255,255,0.78)" }}>
              ENSIKLOPEDIYASI
            </div>
          </div>
        </div>
      </div>

      {/* Portret */}
      <div
        style={{
          position: "absolute",
          left: 52,
          top: 146,
          width: 268,
          height: 334,
          borderRadius: 24,
          border: "6px solid rgba(255,255,255,0.96)",
          backgroundColor: "rgba(255,255,255,0.14)",
          boxShadow: "0 26px 50px rgba(0,22,85,0.42)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.portrait ? (
          <img
            src={props.portrait}
            width={256}
            height={322}
            style={{ objectFit: "cover", borderRadius: 18 }}
          />
        ) : (
          <div style={{ display: "flex", fontWeight: 800, fontSize: 92, letterSpacing: -3, color: "rgba(255,255,255,0.92)" }}>
            {initials(name)}
          </div>
        )}
      </div>

      {/* Tasdiqlangan a'zo */}
      <div
        style={{
          position: "absolute",
          left: 52,
          top: 500,
          width: 268,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "7px 14px",
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.16)",
            border: "1px solid rgba(255,255,255,0.28)",
          }}
        >
          <IconBadgeCheck size={16} color="#ffffff" />
          <div style={{ fontWeight: 600, fontSize: 12.5, color: "#ffffff" }}>Tasdiqlangan aʼzo</div>
        </div>
        {props.title ? (
          <div
            style={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              marginTop: 16,
              fontWeight: 600,
              fontSize: 13.5,
              lineHeight: 1.4,
              color: "#ffffff",
              maxWidth: 268,
            }}
          >
            {uz(props.title)}
          </div>
        ) : null}
        {props.region ? (
          <div style={{ marginTop: 6, fontWeight: 500, fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
            {uz(props.region)}
          </div>
        ) : null}
      </div>

      <div
        style={{
          position: "absolute",
          left: 40,
          bottom: 38,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <IconGlobe size={16} color="rgba(255,255,255,0.85)" />
        <div style={{ fontWeight: 600, fontSize: 13, color: "rgba(255,255,255,0.88)" }}>{props.domain}</div>
      </div>

      {/* ------------------------------ Asosiy qism ------------------------------ */}
      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: 50,
          display: "flex",
          padding: "7px 14px",
          borderRadius: 999,
          backgroundColor: SOFT,
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: 1.8,
          color: BLUE,
        }}
      >
        YOSHLAR ENSIKLOPEDIYASI
      </div>
      <div
        style={{
          position: "absolute",
          right: 56,
          top: 56,
          display: "flex",
          fontWeight: 600,
          fontSize: 12,
          color: INK3,
          letterSpacing: 0.4,
        }}
      >
        {props.code}
      </div>

      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: 100,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", fontWeight: 800, fontSize: 66, lineHeight: 1.02, letterSpacing: -2.4, color: INK }}>
          {uz("Aʼzolik")}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "flex", fontWeight: 800, fontSize: 66, lineHeight: 1.02, letterSpacing: -2.4, color: BLUE }}>
            sertifikati.
          </div>
          {/* Saytdagi "tomonidan." ostidagi qo'lda chizilgan chiziq */}
          <svg width={330} height={16} viewBox="0 0 330 16" style={{ marginTop: 2, marginLeft: 4 }}>
            <path d="M4 11 Q 120 2 326 7" fill="none" stroke={BLUE} strokeWidth={6} strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: 282,
          width: W - LEFT - 56,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2, color: INK3 }}>
          USHBU SERTIFIKAT EGASI
        </div>
        <div
          style={{
            display: "flex",
            height: 58,
            alignItems: "center",
            marginTop: 4,
            fontWeight: 800,
            fontSize: nameSize,
            letterSpacing: -1.2,
            color: INK,
          }}
        >
          {name}
        </div>
        <div style={{ marginTop: 8, fontWeight: 400, fontSize: 15, lineHeight: 1.65, color: INK2 }}>
          {uz(
            "YoshlarWiki — Oʻzbekiston yoshlari ensiklopediyasi hamjamiyatining rasmiy aʼzosi ekanligini tasdiqlaydi. Aʼzolik ensiklopediyada profil yuritish, loyihalarda ishtirok etish va hamjamiyat imkoniyatlaridan foydalanish huquqini beradi.",
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
          <InfoCard icon={<IconHash size={19} color={BLUE} />} label={uz("Aʼzo raqami")} value={props.code} />
          <InfoCard icon={<IconCalendar size={19} color={BLUE} strokeWidth={1.9} />} label="Berilgan sana" value={props.issuedOn} />
          <InfoCard
            icon={<IconCompass size={19} color={BLUE} />}
            label={uz("Yoʻnalish")}
            value={uz(props.category ?? "Yoshlar ensiklopediyasi")}
          />
        </div>
      </div>

      {/* ------------------------------ Pastki qator ----------------------------- */}
      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: 596,
          width: 282,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: 12,
          backgroundColor: SURFACE,
          border: `1px solid ${LINE}`,
          borderRadius: 18,
        }}
      >
        <img src={props.qr} width={92} height={92} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: INK }}>Sertifikatni tekshirish</div>
          <div style={{ marginTop: 4, fontWeight: 400, fontSize: 11, lineHeight: 1.45, color: INK2 }}>
            QR kodni skanerlang yoki saytga kiring
          </div>
          <div style={{ marginTop: 6, fontWeight: 600, fontSize: 11, color: BLUE }}>{props.verifyUrlLabel}</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 732,
          top: 598,
          width: 196,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", height: 56, alignItems: "flex-end", justifyContent: "center" }}>
          {props.signature ? (
            <img src={props.signature.src} {...fitSignature(props.signature.aspect, 196, 56)} />
          ) : props.signerName ? (
            <div
              style={{
                fontFamily: "GreatVibes",
                fontSize: fitFontSize(props.signerName, 34, 20, 14),
                lineHeight: 1,
                whiteSpace: "nowrap",
                color: "#0b2a7a",
                marginBottom: 2,
              }}
            >
              {uz(props.signerName)}
            </div>
          ) : null}
        </div>
        <div style={{ width: 180, height: 1, backgroundColor: "rgba(10,16,32,0.35)", display: "flex" }} />
        <div style={{ marginTop: 7, fontWeight: 600, fontSize: 12, color: INK }}>
          {props.signerName ? uz(props.signerName) : "Imzo"}
        </div>
        <div style={{ marginTop: 2, fontWeight: 500, fontSize: 11, color: INK3 }}>{uz(props.signerTitle)}</div>
      </div>

      <SealImage src={props.seal} size={128} left={W - 56 - 128} top={592} />

      <div
        style={{
          position: "absolute",
          left: LEFT,
          bottom: 30,
          display: "flex",
          gap: 6,
          fontWeight: 500,
          fontSize: 11,
          color: INK3,
        }}
      >
        <div style={{ fontWeight: 700, color: INK2 }}>Yoshlar haqida.</div>
        <div style={{ fontWeight: 700, color: BLUE }}>Yoshlar tomonidan.</div>
      </div>
    </div>
  );
}
