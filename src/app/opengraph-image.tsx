import { ImageResponse } from "next/og";

export const alt = "Gymacro — гимнастика: статьи и гайды";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #ede9fe 0%, #e0e7ff 40%, #ccfbf1 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#18181b",
          }}
        >
          <span>GYM</span>
          <span style={{ color: "#6d28d9" }}>ACRO</span>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 30,
            fontWeight: 600,
            color: "#3f3f46",
            maxWidth: 1000,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          Статьи и гайды для спортсменов, тренеров и родителей
        </div>
        <div style={{ marginTop: 16, fontSize: 22, color: "#71717a" }}>gymacro.ru</div>
      </div>
    ),
    { ...size },
  );
}
