/** Декоративные траектории движения — «линии снаряда / ленты» поверх фото hero. */
export function HeroMotion() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="hero-orbit absolute inset-0 h-full w-full opacity-70"
        viewBox="0 0 1200 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-40 520 C 180 220 320 640 520 360 S 860 120 1240 280"
          stroke="rgba(94,234,212,0.45)"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="hero-path-draw"
        />
        <path
          d="M80 640 Q 360 280 620 480 T 1180 200"
          stroke="rgba(125,211,252,0.28)"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeDasharray="7 12"
          className="hero-path-dash"
        />
        <path
          d="M40 180 L 200 120 L 340 260 L 520 90 L 720 210 L 920 70"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="520"
          cy="360"
          r="4"
          fill="rgba(45,212,191,0.55)"
          className="hero-pulse-dot origin-center"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        <circle cx="620" cy="480" r="3" fill="rgba(125,211,252,0.5)" />
        <circle cx="200" cy="120" r="2.5" fill="rgba(255,255,255,0.35)" />
      </svg>

      <div className="absolute -left-16 top-1/4 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-48 w-72 rounded-full bg-sky-400/10 blur-3xl" />
    </div>
  );
}
