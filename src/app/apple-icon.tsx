import { ImageResponse } from "next/og";

export const alt = "Gymacro";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          background: "linear-gradient(145deg, #ede9fe 0%, #e0e7ff 45%, #ccfbf1 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 2,
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#18181b",
          }}
        >
          <span>GYM</span>
          <span style={{ color: "#6d28d9" }}>ACRO</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
