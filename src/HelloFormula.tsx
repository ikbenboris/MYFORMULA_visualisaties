import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const HelloFormula: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 20], [0.8, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          color: "#e8002d",
          fontFamily: "sans-serif",
          fontSize: 80,
          fontWeight: "bold",
          letterSpacing: 4,
        }}
      >
        MYFORMULA
      </div>
    </AbsoluteFill>
  );
};
