/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import type { SignatureImage } from "./assets";
import {
  fitFontSize,
  fitSignature,
  H,
  IconCalendar,
  IconCertificate,
  IconGlobe,
  LOGO_ASPECT,
  SealImage,
  uz,
  W,
} from "./shared";

/**
 * MUALLIFLIK SERTIFIKATI — klassik, rasmiy uslub.
 *
 * Buyurtmachi bergan namunaga mos: oq-kulrang "qog'oz", chap-yuqori va
 * o'ng-pastki burchakda to'q ko'k diagonal tasma va oltin chiziq, katta
 * serif "SERTIFIKAT", chapda kitoblar to'plami, o'ngda Registon uslubidagi
 * me'moriy chizma, pastda QR, imzo va dumaloq muhr.
 */

export type AuthorshipProps = {
  name: string;
  code: string;
  issuedOn: string;
  verifyUrlLabel: string;
  domain: string;
  logo: string;
  qr: string;
  /** Oldindan chizilgan muhr (render.tsx → renderSeal). */
  seal: string;
  signerTitle: string;
  signerName: string;
  signature: SignatureImage | null;
};

const NAVY = "#0f2147";
const NAVY_DEEP = "#0a1733";
const INK = "#1c2a46";
const MUTED = "#4a5876";
const GOLD = "#c9a45c";

const SERIF = "Playfair";
const SANS = "Montserrat";

/** Me'moriy chizma: minora, peshtoq va gumbaz (chiziqli, juda och). */
function Architecture() {
  const stroke = NAVY;
  return (
    <svg
      width={300}
      height={470}
      viewBox="0 0 300 470"
      style={{ position: "absolute", right: 18, top: 136, opacity: 0.085 }}
    >
      <g fill="none" stroke={stroke} strokeWidth={1.6} strokeLinejoin="round">
        {/* Minora */}
        <path d="M214 466 L218 118 L242 118 L246 466" />
        <path d="M206 118 H254 V100 H206 Z" />
        <path d="M210 100 Q230 58 250 100" />
        <path d="M230 64 V40" />
        <circle cx={230} cy={36} r={4} />
        <path d="M217 150 H243 M216.6 190 H243.4 M216.2 230 H243.8 M215.8 270 H244.2 M215.4 310 H244.6 M215 350 H245 M214.6 390 H245.4 M214.2 430 H245.8" />
        <path d="M219 160 L241 180 M241 160 L219 180 M218 240 L242 260 M242 240 L218 260 M217 320 L243 340 M243 320 L217 340" strokeWidth={0.9} />

        {/* Gumbaz */}
        <path d="M58 214 Q58 140 116 128 Q174 140 174 214" />
        <path d="M70 214 Q72 160 116 140 M162 214 Q160 160 116 140 M116 128 V214 M92 214 Q94 160 116 136 M140 214 Q138 160 116 136" strokeWidth={0.9} />
        <path d="M52 214 H180 V230 H52 Z" />
        <path d="M116 128 V112 M112 112 H120" />

        {/* Peshtoq (portal) */}
        <path d="M40 466 V236 H192 V466" />
        <path d="M52 466 V248 H180 V466" strokeWidth={1} />
        <path d="M78 466 V338 Q78 284 116 262 Q154 284 154 338 V466" />
        <path d="M90 466 V346 Q90 300 116 282 Q142 300 142 346 V466" strokeWidth={1} />
        <path d="M60 256 H172 M60 270 H74 M158 270 H172" strokeWidth={0.9} />

        {/* Yon qanotlar va ravoqlar */}
        <path d="M0 466 V300 H40 M192 300 H214" />
        <path d="M8 466 V380 Q8 352 20 344 Q32 352 32 380 V466" strokeWidth={1} />
        <path d="M8 330 V318 Q8 306 20 300 Q32 306 32 318 V330" strokeWidth={1} />
        <path d="M196 466 V392 Q196 370 205 364 Q214 370 214 392 V466" strokeWidth={1} />
        <path d="M0 466 H300" />
        <path d="M0 470 H300" strokeWidth={0.8} />
      </g>
    </svg>
  );
}

/** Burchakdagi tasmalar, oltin chiziqlar va ramka. */
function Frame() {
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <defs>
        <linearGradient id="navy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#24406f" />
          <stop offset="0.55" stopColor="#13284f" />
          <stop offset="1" stopColor={NAVY_DEEP} />
        </linearGradient>
        <linearGradient id="navy2" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={NAVY_DEEP} />
          <stop offset="1" stopColor="#1f3866" />
        </linearGradient>
      </defs>

      {/* Ingichka ramka */}
      <rect x={16} y={16} width={W - 32} height={H - 32} fill="none" stroke="rgba(15,33,71,0.16)" strokeWidth={1} />
      <path d={`M${W - 92} 16 H${W - 16} V92`} fill="none" stroke={NAVY} strokeWidth={2.4} />
      <path d={`M190 ${H - 22} H${W - 140}`} stroke="rgba(15,33,71,0.28)" strokeWidth={1} />

      {/* Chap-yuqori burchak */}
      <polygon points="0,0 246,0 0,226" fill="rgba(31,56,102,0.14)" />
      <polygon points="0,0 208,0 0,190" fill="url(#navy)" />
      <line x1={226} y1={0} x2={0} y2={207} stroke={GOLD} strokeWidth={2.2} />
      <line x1={262} y1={0} x2={0} y2={240} stroke="rgba(201,164,92,0.45)" strokeWidth={0.8} />

      {/* O'ng-pastki burchak */}
      <polygon points={`${W},${H} ${W - 150},${H} ${W},${H - 138}`} fill="rgba(31,56,102,0.14)" />
      <polygon points={`${W},${H} ${W - 118},${H} ${W},${H - 110}`} fill="url(#navy2)" />
      <line x1={W - 134} y1={H} x2={W} y2={H - 124} stroke={GOLD} strokeWidth={2.2} />
    </svg>
  );
}

/** Chap pastdagi kitoblar to'plami: ILM, INSON, JAMIYAT, KELAJAK. */
function Books() {
  const books = [
    { label: "ILM", width: 176, left: -10 },
    { label: "INSON", width: 188, left: -4 },
    { label: "JAMIYAT", width: 180, left: -12 },
    { label: "KELAJAK", width: 192, left: -2 },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 566,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Ustki kitobning sahifalari */}
      <div
        style={{
          marginLeft: -10,
          width: 168,
          height: 7,
          borderRadius: "0 6px 0 0",
          backgroundImage: "linear-gradient(180deg, #f3efe6, #d8d1c2)",
          display: "flex",
        }}
      />
      {books.map((book, index) => (
        <div
          key={book.label}
          style={{
            marginLeft: book.left,
            marginTop: index === 0 ? 0 : 4,
            width: book.width,
            height: 44,
            display: "flex",
            alignItems: "center",
            position: "relative",
            borderRadius: "0 8px 8px 0",
            backgroundImage:
              "linear-gradient(180deg, #3a527c 0%, #1d335d 32%, #13274d 70%, #0b1936 100%)",
            boxShadow: "0 6px 12px rgba(10,23,51,0.32)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 2,
              borderRadius: "0 8px 0 0",
              backgroundColor: "rgba(255,255,255,0.22)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 30,
              top: 6,
              bottom: 6,
              width: 1.5,
              backgroundColor: "rgba(201,164,92,0.65)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 24,
              top: 6,
              bottom: 6,
              width: 1.5,
              backgroundColor: "rgba(201,164,92,0.65)",
            }}
          />
          <div
            style={{
              paddingLeft: 40,
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 12.5,
              letterSpacing: 3,
              color: "rgba(221,228,240,0.78)",
            }}
          >
            {book.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label?: string;
  value: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", width: 24, justifyContent: "center" }}>{icon}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {label ? (
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 10.5, color: MUTED }}>
            {label}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: SANS,
            fontWeight: label ? 600 : 500,
            fontSize: label ? 13.5 : 12,
            color: label ? NAVY : INK,
            marginTop: label ? 2 : 0,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function Line({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", whiteSpace: "pre" }}>{children}</div>
  );
}

export function AuthorshipCertificate(props: AuthorshipProps) {
  const name = uz(props.name);
  const nameSize = fitFontSize(name, 60, 34, 21);
  const logoW = 94;

  return (
    <div
      style={{
        width: W,
        height: H,
        display: "flex",
        position: "relative",
        // overflow: hidden YO'Q — Satori'da scale() bilan birga rasmlarni
        // noto'g'ri kesib tashlaydi. Chetdan chiqqan qism baribir tuvaldan tashqarida.
        backgroundImage: "linear-gradient(135deg, #f9fafb 0%, #eef1f5 48%, #f6f7f9 100%)",
        fontFamily: SANS,
      }}
    >
      {/* Yorug'lik */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          backgroundImage:
            "radial-gradient(circle at 50% 38%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      {/* Katta "YW" suv belgisi */}
      <div
        style={{
          position: "absolute",
          left: -26,
          top: 150,
          display: "flex",
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 470,
          lineHeight: 1,
          letterSpacing: -30,
          color: "rgba(15,33,71,0.035)",
        }}
      >
        YW
      </div>

      <Architecture />
      <Frame />
      <Books />

      {/* ---------------------------- Sarlavha qatori ---------------------------- */}
      <div style={{ position: "absolute", left: 196, top: 52, display: "flex", alignItems: "center" }}>
        <img src={props.logo} width={logoW} height={logoW * LOGO_ASPECT} />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 12 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 27, color: NAVY, letterSpacing: -0.4, lineHeight: 1.05 }}>
            Yoshlar Wiki
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 17.5, color: "#2b3b5c", marginTop: 3 }}>
            Ensiklopediyasi
          </div>
        </div>
        <div style={{ width: 1.2, height: 54, backgroundColor: "rgba(15,33,71,0.45)", marginLeft: 22, display: "flex" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 16,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 11.5,
            lineHeight: 1.45,
            color: INK,
          }}
        >
          <div>Yoshlar haqidagi</div>
          <div>bilimlar —</div>
          <div>kelajak uchun.</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 72,
          top: 70,
          display: "flex",
          gap: 14,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 11,
          color: INK,
        }}
      >
        <div>Ochiq bilimlar</div>
        <div style={{ color: "rgba(15,33,71,0.4)" }}>|</div>
        <div>Yangi imkoniyatlar</div>
        <div style={{ color: "rgba(15,33,71,0.4)" }}>|</div>
        <div>Yuksak maqsadlar</div>
      </div>

      {/* ------------------------------ Asosiy qism ------------------------------ */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 146,
          width: W,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 100,
            lineHeight: 1,
            letterSpacing: 2,
            color: NAVY,
          }}
        >
          SERTIFIKAT
        </div>

        <div style={{ display: "flex", alignItems: "center", marginTop: 20, gap: 26 }}>
          <div style={{ width: 92, height: 1.2, backgroundColor: "rgba(15,33,71,0.55)", display: "flex" }} />
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 20, letterSpacing: 6.5, color: "#13254a" }}>
            MUALLIFLIK SERTIFIKATI
          </div>
          <div style={{ width: 92, height: 1.2, backgroundColor: "rgba(15,33,71,0.55)", display: "flex" }} />
        </div>

        <div
          style={{
            display: "flex",
            height: 92,
            alignItems: "center",
            marginTop: 8,
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: nameSize,
            lineHeight: 1.1,
            letterSpacing: -0.5,
            color: NAVY,
          }}
        >
          {name}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 6,
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 16,
            lineHeight: 1.62,
            color: "#1f2d48",
          }}
        >
          <Line>
            <span>Ushbu sertifikat sizning </span>
            <span style={{ fontWeight: 600, color: NAVY }}>Yoshlar Wiki Ensiklopediyasi</span>
            <span>ga</span>
          </Line>
          <Line>
            <span>{uz("taqdim etgan maqola va materiallaringiz, shuningdek, yoshlar uchun")}</span>
          </Line>
          <Line>
            <span>{uz("ochiq bilimlar bazasini shakllantirishdagi faol ishtirokingiz uchun berildi.")}</span>
          </Line>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 16,
            fontFamily: SANS,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 13.5,
            lineHeight: 1.5,
            color: "#3c4a63",
          }}
        >
          <div>Sizning bilim va tashabbusingiz —</div>
          <div>Yangi avlod uchun muhim qadriyat.</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
          <div style={{ width: 40, height: 1, backgroundColor: "rgba(15,33,71,0.4)", display: "flex" }} />
          <div style={{ width: 36, height: 2.6, borderRadius: 2, backgroundColor: NAVY, display: "flex" }} />
          <div style={{ width: 40, height: 1, backgroundColor: "rgba(15,33,71,0.4)", display: "flex" }} />
        </div>
      </div>

      {/* ------------------------------ Pastki qator ----------------------------- */}
      <div
        style={{
          position: "absolute",
          left: 208,
          top: 588,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <InfoRow icon={<IconCertificate size={22} color={NAVY} />} label="Sertifikat raqami" value={props.code} />
        <InfoRow icon={<IconCalendar size={21} color={NAVY} />} label="Berilgan sana" value={props.issuedOn} />
        <InfoRow icon={<IconGlobe size={20} color={NAVY} />} value={props.domain} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 412,
          top: 590,
          width: 170,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: 5,
            backgroundColor: "rgba(255,255,255,0.85)",
            borderRadius: 4,
          }}
        >
          <img src={props.qr} width={72} height={72} />
        </div>
        <div style={{ marginTop: 8, fontFamily: SANS, fontWeight: 500, fontSize: 10.5, color: MUTED }}>
          Sertifikatni tekshirish
        </div>
        <div style={{ marginTop: 2, fontFamily: SANS, fontWeight: 600, fontSize: 11, color: NAVY }}>
          {props.verifyUrlLabel}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 610,
          top: 588,
          width: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: SANS,
        }}
      >
        <div style={{ fontWeight: 500, fontSize: 11.5, color: INK }}>Yoshlar Wiki Ensiklopediyasi</div>
        <div style={{ fontWeight: 500, fontSize: 11.5, color: INK, marginTop: 4 }}>
          {uz(props.signerTitle)}
        </div>
        <div style={{ display: "flex", height: 54, alignItems: "flex-end", justifyContent: "center" }}>
          {props.signature ? (
            <img src={props.signature.src} {...fitSignature(props.signature.aspect, 210, 56)} />
          ) : props.signerName ? (
            <div
              style={{
                fontFamily: "GreatVibes",
                fontSize: fitFontSize(props.signerName, 34, 20, 14),
                lineHeight: 1,
                whiteSpace: "nowrap",
                color: "#16295a",
                marginBottom: 2,
              }}
            >
              {uz(props.signerName)}
            </div>
          ) : null}
        </div>
        <div style={{ width: 188, height: 1, backgroundColor: "rgba(15,33,71,0.6)", display: "flex" }} />
        <div style={{ fontWeight: 500, fontSize: 10.5, color: MUTED, marginTop: 6 }}>
          {props.signerName ? uz(props.signerName) : "Imzo"}
        </div>
      </div>

      <SealImage src={props.seal} size={146} left={884} top={574} />

      <div
        style={{
          position: "absolute",
          right: 150,
          top: 740,
          display: "flex",
          gap: 10,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 10.5,
          letterSpacing: 3.2,
          color: INK,
        }}
      >
        <div>BILIM</div>
        <div>•</div>
        <div>YOSHLAR</div>
        <div>•</div>
        <div>KELAJAK</div>
      </div>
    </div>
  );
}
