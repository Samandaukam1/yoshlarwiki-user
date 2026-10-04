/**
 * Ikkala sertifikat shabloni uchun umumiy bo'laklar.
 *
 * Shablonlar Satori (next/og) bilan chiziladi: faqat flexbox va absolute
 * joylashuv, bir nechta bolasi bor har bir element `display: flex` bo'lishi
 * shart. Barcha o'lchamlar A4 albom (1123×794, 96 dpi) bazasida —
 * kattalashtirish `render.tsx` dagi bitta `scale()` bilan qilinadi.
 */

export const W = 1123;
export const H = 794;

/** Logotip balandligi / kengligi (certificate-logo.png: 990×715). */
export const LOGO_ASPECT = 715 / 990;

/**
 * Oʻzbekcha tutuq belgilari (ʻ U+02BB, ʼ U+02BC) har bir shriftda
 * bo'lavermaydi — ko'rinishi bir xil bo'lgan ‘ ’ ga almashtiriladi.
 * Aks holda Satori yetishmayotgan belgini tashqi manbadan qidiradi.
 */
export function uz(text: string): string {
  return text.replace(/ʻ/g, "‘").replace(/[ʼ`]/g, "’");
}

/** Ism uzunligiga qarab shrift o'lchami — har doim bir qatorga sig'adi. */
export function fitFontSize(text: string, max: number, min: number, fitChars: number): number {
  const length = Math.max(1, text.length);
  if (length <= fitChars) return max;
  return Math.max(min, Math.floor((max * fitChars) / length));
}

/** Bosh harflarning taxminiy kengligi (em) — Montserrat/Inter o'rtachasi. */
const CAP_WIDTHS: Record<string, number> = {
  A: 0.68, B: 0.7, C: 0.72, D: 0.76, E: 0.63, F: 0.6, G: 0.76, H: 0.77, I: 0.29,
  J: 0.55, K: 0.69, L: 0.57, M: 0.9, N: 0.77, O: 0.8, P: 0.67, Q: 0.8, R: 0.69,
  S: 0.65, T: 0.62, U: 0.75, V: 0.68, W: 0.98, X: 0.69, Y: 0.6, Z: 0.65,
};

/** Aylana bo'ylab yozuv uchun harf kengligining taxminiy ulushi (em). */
function glyphWidth(char: string): number {
  if (char === " ") return 0.3;
  return CAP_WIDTHS[char] ?? 0.66;
}

type ArcProps = {
  text: string;
  cx: number;
  cy: number;
  /** Harflar markazidan o'tadigan radius. */
  radius: number;
  fontSize: number;
  tracking: number;
  color: string;
  fontFamily: string;
  fontWeight: number;
  /** "top" — tepada, "bottom" — pastda (harflar tik turadi). */
  position: "top" | "bottom";
  /** Butun yozuvni burish (radian). Ota elementni transform bilan burish
   *  Satori'da ichki transformlar bilan noto'g'ri qo'shiladi. */
  tilt?: number;
};

/** Aylana yoyi bo'ylab joylashgan harflar (Satori'da textPath yo'q). */
function ArcText({
  text,
  cx,
  cy,
  radius,
  fontSize,
  tracking,
  color,
  fontFamily,
  fontWeight,
  position,
  tilt = 0,
}: ArcProps) {
  const chars = [...text];
  const advances = chars.map((char) => glyphWidth(char) * fontSize + tracking);
  const total = advances.reduce((sum, value) => sum + value, 0) - tracking;
  const totalAngle = total / radius;

  let cursor = 0;
  return (
    <>
      {chars.map((char, index) => {
        const center = cursor + (advances[index] - tracking) / 2;
        cursor += advances[index];
        const offset = center / radius - totalAngle / 2;
        const angle = (position === "top" ? offset : Math.PI - offset) + tilt;
        const x = cx + radius * Math.sin(angle);
        const y = cy - radius * Math.cos(angle);
        const rotation = position === "top" ? angle : angle - Math.PI;
        const box = fontSize * 1.3;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x - box / 2,
              top: y - box / 2,
              width: box,
              height: box,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${(rotation * 180) / Math.PI}deg)`,
              // Aniq ko'rsatiladi: Satori ildizdagi "top left" ni meros qilib oladi.
              transformOrigin: "50% 50%",
              fontSize,
              fontFamily,
              fontWeight,
              color,
              lineHeight: 1,
            }}
          >
            {char === " " ? "" : char}
          </div>
        );
      })}
    </>
  );
}

function starPoints(cx: number, cy: number, outer: number, inner: number) {
  const points: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`);
  }
  return points.join(" ");
}

/**
 * Dumaloq muhr: "YOSHLAR WIKI ★ ENSIKLOPEDIYASI ★", markazda logotip.
 *
 * Kichik o'lchamda Satori harflar joylashuvini butun pikselga yaxlitlaydi
 * va yoy bo'ylab yozuv "sakraydi". Shuning uchun muhr render.tsx da alohida,
 * katta o'lchamda bir marta chizilib, sertifikatga tayyor rasm sifatida
 * qo'yiladi (`SealImage`).
 */
export function Seal({
  size,
  left,
  top,
  color,
  logo,
  fontFamily,
  fontWeight = 800,
  innerFill = "rgba(255,255,255,0)",
}: {
  size: number;
  left: number;
  top: number;
  color: string;
  logo: string;
  fontFamily: string;
  fontWeight?: number;
  innerFill?: string;
}) {
  // Barcha o'lchamlar 146 px'lik asl dizaynga mutanosib.
  const k = size / 146;
  const c = size / 2;
  const outer = c - 2 * k;
  const ring2 = outer - 5.5 * k;
  const inner = size * 0.3;
  const textRadius = (ring2 + inner) / 2;
  const fontSize = size * 0.088;
  const logoWidth = inner * 1.42;
  // Muhr biroz qiya bosilgandek ko'rinsin.
  const tilt = (-8 * Math.PI) / 180;
  const starX = textRadius * Math.cos(tilt);
  const starY = textRadius * Math.sin(tilt);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        display: "flex",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <circle cx={c} cy={c} r={outer} fill="none" stroke={color} strokeWidth={3.6 * k} />
        <circle cx={c} cy={c} r={ring2} fill="none" stroke={color} strokeWidth={1.4 * k} />
        <circle cx={c} cy={c} r={inner} fill={innerFill} stroke={color} strokeWidth={2 * k} />
        <circle
          cx={c}
          cy={c}
          r={inner - 4 * k}
          fill="none"
          stroke={color}
          strokeWidth={0.8 * k}
          strokeDasharray={`${2 * k} ${3 * k}`}
        />
        <polygon points={starPoints(c - starX, c - starY, fontSize * 0.62, fontSize * 0.26)} fill={color} />
        <polygon points={starPoints(c + starX, c + starY, fontSize * 0.62, fontSize * 0.26)} fill={color} />
      </svg>

      <ArcText
        text="YOSHLAR WIKI"
        cx={c}
        cy={c}
        radius={textRadius}
        fontSize={fontSize}
        tracking={fontSize * 0.2}
        color={color}
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        position="top"
        tilt={tilt}
      />
      <ArcText
        text="ENSIKLOPEDIYASI"
        cx={c}
        cy={c}
        radius={textRadius}
        fontSize={fontSize}
        tracking={fontSize * 0.14}
        color={color}
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        position="bottom"
        tilt={tilt}
      />

      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        src={logo}
        width={logoWidth}
        height={logoWidth * LOGO_ASPECT}
        style={{
          position: "absolute",
          left: c - logoWidth / 2,
          top: c - (logoWidth * LOGO_ASPECT) / 2,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Kichik ikonkalar (lucide uslubida, chiziqli)                       */
/* ------------------------------------------------------------------ */

type IconProps = { size: number; color: string; strokeWidth?: number };

export function IconCertificate({ size, color, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
      <path d="M14 3v5h5" />
      <path d="M19 8v3" />
      <path d="M8 9h3" />
      <path d="M8 13h5" />
      <circle cx="17" cy="16" r="3" />
      <path d="M15.5 18.6 15 22l2-1 2 1-.5-3.4" />
    </svg>
  );
}

export function IconCalendar({ size, color, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  );
}

export function IconGlobe({ size, color, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function IconHash({ size, color, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h16" />
      <path d="M4 15h16" />
      <path d="M10 3 8 21" />
      <path d="M16 3l-2 18" />
    </svg>
  );
}

export function IconCompass({ size, color, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
    </svg>
  );
}

export function IconBadgeCheck({ size, color, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/** Oldindan chizilgan muhr rasmi. */
export function SealImage({
  src,
  size,
  left,
  top,
}: {
  src: string;
  size: number;
  left: number;
  top: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img src={src} width={size} height={size} style={{ position: "absolute", left, top }} />
  );
}

/** Imzo rasmini berilgan maydonga proporsiyasini buzmasdan sig'diradi. */
export function fitSignature(aspect: number, maxWidth: number, maxHeight: number) {
  const width = Math.min(maxWidth, maxHeight * aspect);
  return { width: Math.round(width), height: Math.round(width / aspect) };
}
