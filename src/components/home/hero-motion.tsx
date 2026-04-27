export function HeroMotion() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[18px]"
      aria-hidden
    >
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet-200/25 blur-3xl" />
      <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-violet-100/40 blur-2xl" />

      {/* Траектории: дуги и ломаные, как линии движения / снарядов */}
      <svg
        className="animate-float-line absolute inset-0 h-full w-full md:left-[28%]"
        viewBox="0 0 520 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-30 280 Q 120 80 280 200 T 520 120"
          className="text-violet-400/50"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M40 360 Q 200 200 340 260 Q 420 300 500 180"
          className="text-violet-400/35"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeDasharray="6 10"
        />
        <path
          d="M20 140 L 140 100 L 220 180 L 320 90 L 440 150"
          stroke="#0ea5e9"
          strokeOpacity="0.28"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 320 C 160 240 200 380 300 280 S 420 200 510 240"
          stroke="#6d28d9"
          strokeOpacity="0.22"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="280" cy="200" r="3.5" fill="#6d28d9" fillOpacity="0.25" />
        <circle cx="340" cy="260" r="2.5" fill="#0ea5e9" fillOpacity="0.35" />
        <circle cx="140" cy="100" r="2" fill="#6d28d9" fillOpacity="0.3" />
      </svg>
    </div>
  );
}
