import { ImageResponse } from "next/og";

export const alt = "Gymacro";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple Touch Icon — в одном стиле с `icon.svg` (А на зелёном фоне). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #22c55e 0%, #15803d 100%)",
          borderRadius: 40,
        }}
      >
        <span
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          А
        </span>
      </div>
    ),
    { ...size },
  );
}
