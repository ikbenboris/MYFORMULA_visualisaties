import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// Brand colors extracted from myformula.nl screenshot
const C = {
  bg: "#F8F8F8",
  pot: "#1A1A1A",
  potDark: "#0D0D0D",
  purple: "#8B7FD4",
  white: "#FFFFFF",
  text: "#1C1C1C",
  textMid: "#666666",
  textLight: "#AAAAAA",
  track: "#E5E5E5",
};

const INGREDIENTS = [
  { name: "Beta-alanine", unit: "g",  max: 3.2,  color: "#FF6B8A" },
  { name: "Taurine",      unit: "g",  max: 2.0,  color: "#8B7FD4" },
  { name: "Caffeine",     unit: "mg", max: 200,  color: "#6B4226" },
  { name: "L-Arginine",   unit: "g",  max: 2.5,  color: "#FF9F43" },
  { name: "L-Tyrosine",   unit: "g",  max: 1.5,  color: "#FFC312" },
];

// Pot geometry (px)
const PW   = 360;
const PBH  = 420;
const PLH  = 65;
const FX   = 26;
const FW   = PW - FX * 2;
const FY   = 14;
const FH   = PBH - FY - 16;
const LH   = FH / INGREDIENTS.length;

// Timeline helpers
const ease = Easing.out(Easing.cubic);
const ei = (frame: number, [a, b]: [number, number], [from, to]: [number, number]) =>
  interpolate(frame, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

// Slider i animates in window [start, start+34]
const sliderStart = (i: number) => 48 + i * 42;
const sliderEnd   = (i: number) => sliderStart(i) + 34;

const LAST_SLIDER_END  = sliderEnd(INGREDIENTS.length - 1);
const LOGO_REVEAL      = LAST_SLIDER_END + 18;
const TAGLINE_START    = LOGO_REVEAL + 28;
export const TOTAL_FRAMES = TAGLINE_START + 55;

export const PreWorkoutFill: React.FC = () => {
  const frame = useCurrentFrame();

  // Per-ingredient slider progress (0 → 1)
  const sv = INGREDIENTS.map((_, i) =>
    ei(frame, [sliderStart(i), sliderEnd(i)], [0, 1])
  );

  // Card slide-in opacity
  const cardOpacity = INGREDIENTS.map((_, i) =>
    ei(frame, [sliderStart(i) - 10, sliderStart(i) + 6], [0, 1])
  );
  const cardX = cardOpacity.map(o => interpolate(o, [0, 1], [-22, 0]));

  const avgFill = sv.reduce((a, b) => a + b, 0) / INGREDIENTS.length;

  // Pot entrance
  const potOpacity = ei(frame, [0, 28], [0, 1]);
  const potY       = ei(frame, [0, 28], [50, 0]);

  // Header
  const titleOpacity = ei(frame, [8, 36], [0, 1]);
  const titleY       = ei(frame, [8, 36], [18, 0]);

  // Logo on pot
  const logoOpacity = ei(frame, [LOGO_REVEAL, LOGO_REVEAL + 22], [0, 1]);

  // Tagline
  const tagOpacity = ei(frame, [TAGLINE_START, TAGLINE_START + 22], [0, 1]);
  const tagY       = ei(frame, [TAGLINE_START, TAGLINE_START + 22], [14, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, flexDirection: "row", alignItems: "center" }}>
      {/* ─── Left: Pot ─── */}
      <div
        style={{
          flex: "0 0 780px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: potOpacity,
          transform: `translateY(${potY}px)`,
        }}
      >
        <div style={{ position: "relative", width: PW, height: PBH + PLH }}>
          <svg
            width={PW}
            height={PBH + PLH}
            viewBox={`0 0 ${PW} ${PBH + PLH}`}
            style={{ filter: "drop-shadow(0 28px 52px rgba(0,0,0,0.28))" }}
          >
            <defs>
              <clipPath id="fillClip">
                <rect x={FX} y={PLH + FY} width={FW} height={FH} rx={6} />
              </clipPath>
              <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#0E0E0E" />
                <stop offset="48%"  stopColor="#2C2C2C" />
                <stop offset="100%" stopColor="#131313" />
              </linearGradient>
            </defs>

            {/* Body */}
            <rect x={0} y={PLH - 8} width={PW} height={PBH + 8} rx={22} fill="url(#potGrad)" />

            {/* Coloured powder layers, stacked from bottom */}
            <g clipPath="url(#fillClip)">
              {INGREDIENTS.map((ing, i) => {
                const belowH = sv.slice(0, i).reduce((s, v) => s + v * LH, 0);
                const thisH  = sv[i] * LH;
                return (
                  <rect
                    key={i}
                    x={FX}
                    y={PLH + FY + FH - belowH - thisH}
                    width={FW}
                    height={thisH + 0.5}
                    fill={ing.color}
                    opacity={0.88}
                  />
                );
              })}
            </g>

            {/* Lid */}
            <rect x={-12} y={0}       width={PW + 24} height={PLH}      rx={16} fill="#0D0D0D" />
            <rect x={-4}  y={PLH - 11} width={PW + 8}  height={11}      rx={0}  fill="#080808" />
            {/* Lid top groove highlight */}
            <rect x={28} y={8} width={PW - 56} height={4} rx={2} fill="#2A2A2A" />
          </svg>

          {/* MY FORMULA overlay on pot */}
          <div
            style={{
              position: "absolute",
              top: PLH + PBH * 0.26,
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              opacity: logoOpacity,
              color: C.white,
              fontFamily: "sans-serif",
              fontWeight: "bold",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ fontSize: 38, lineHeight: 1.05, letterSpacing: 2 }}>MY</div>
            <div style={{ fontSize: 38, lineHeight: 1.05, letterSpacing: 2 }}>FORMULA</div>
            <div style={{ width: 2, height: 38, backgroundColor: "rgba(255,255,255,0.35)", margin: "10px auto" }} />
            <div style={{ fontSize: 10, letterSpacing: 2.5, opacity: 0.55, textTransform: "uppercase" }}>
              Your choice, your secret.
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right: UI ─── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px 0 16px",
        }}
      >
        {/* Header */}
        <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, marginBottom: 28 }}>
          <div style={{ fontFamily: "sans-serif", fontSize: 13, letterSpacing: 4, color: C.purple, textTransform: "uppercase", marginBottom: 8 }}>
            MYFORMULA
          </div>
          <div style={{ fontFamily: "sans-serif", fontSize: 60, fontWeight: "bold", color: C.text, lineHeight: 1.1, marginBottom: 10 }}>
            Your Formula
          </div>
          <div style={{ fontFamily: "sans-serif", fontSize: 17, color: C.textMid }}>
            Stel samen met sliders · 25 scoops per pot
          </div>
        </div>

        {/* Progress ring */}
        <div style={{ marginBottom: 26 }}>
          <ProgressRing value={avgFill} />
        </div>

        {/* Ingredient slider cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {INGREDIENTS.map((ing, i) => (
            <div
              key={ing.name}
              style={{
                opacity: cardOpacity[i],
                transform: `translateX(${cardX[i]}px)`,
                backgroundColor: C.white,
                borderRadius: 12,
                padding: "13px 18px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontFamily: "sans-serif" }}>
                <span style={{ fontSize: 15, fontWeight: 500, color: C.text }}>{ing.name}</span>
                <span style={{ fontSize: 15, color: C.textMid }}>
                  {(sv[i] * ing.max).toFixed(ing.unit === "mg" ? 0 : 1)}{ing.unit}
                </span>
              </div>
              <div style={{ height: 6, backgroundColor: C.track, borderRadius: 3, position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${sv[i] * 100}%`, backgroundColor: ing.color, borderRadius: 3 }} />
                <div style={{ position: "absolute", left: `${sv[i] * 100}%`, top: "50%", transform: "translate(-50%, -50%)", width: 18, height: 18, backgroundColor: C.pot, borderRadius: "50%", boxShadow: "0 2px 6px rgba(0,0,0,0.28)" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div style={{ opacity: tagOpacity, transform: `translateY(${tagY}px)`, marginTop: 30, fontFamily: "sans-serif", fontSize: 18, color: C.purple, fontStyle: "italic", letterSpacing: 0.5 }}>
          Jouw formule. Jouw keuze.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SVG progress ring ──
const ProgressRing: React.FC<{ value: number }> = ({ value }) => {
  const SIZE = 122;
  const SW   = 8;
  const R    = (SIZE - SW) / 2;
  const CIRC = 2 * Math.PI * R;
  const clamped = Math.min(value, 1);
  const offset  = CIRC * (1 - clamped);
  const pct     = Math.round(clamped * 100);

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke={C.track}  strokeWidth={SW} />
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke={C.purple} strokeWidth={SW}
          strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontFamily: "sans-serif", fontSize: 22, fontWeight: "bold", color: C.purple }}>
        {pct}%
      </div>
    </div>
  );
};
