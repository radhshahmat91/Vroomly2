export function RouteHeroArt() {
  return (
    <svg viewBox="0 0 480 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden>
      <path
        d="M40 380C120 380 100 260 180 260C260 260 240 140 320 140C380 140 380 70 440 40"
        stroke="var(--color-line-strong)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray="2 26"
      />
      <path
        d="M40 380C120 380 100 260 180 260C260 260 240 140 320 140C380 140 380 70 440 40"
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <circle cx="40" cy="380" r="10" fill="var(--color-route-500)" />
      <circle cx="440" cy="40" r="10" fill="var(--color-signal-500)" />

      {/* Pin marking a stop along the route */}
      <g transform="translate(180 226)">
        <path
          d="M0 34C0 34 20 18 20 4C20 -7 11 -16 0 -16C-11 -16 -20 -7 -20 4C-20 18 0 34 0 34Z"
          fill="var(--color-signal-500)"
        />
        <circle cx="0" cy="4" r="6" fill="white" />
      </g>

      {/* Simple side-profile car mark */}
      <g transform="translate(255 300)">
        <rect x="0" y="18" width="120" height="34" rx="8" fill="var(--color-ink)" />
        <path d="M14 18 L34 -6 H92 L112 18 Z" fill="var(--color-ink)" />
        <path d="M38 14 L50 -1 H84 L96 14 Z" fill="var(--color-paper)" opacity="0.85" />
        <circle cx="28" cy="54" r="14" fill="var(--color-ink)" />
        <circle cx="28" cy="54" r="6" fill="var(--color-paper)" />
        <circle cx="96" cy="54" r="14" fill="var(--color-ink)" />
        <circle cx="96" cy="54" r="6" fill="var(--color-paper)" />
        <rect x="106" y="26" width="10" height="8" rx="2" fill="var(--color-signal-500)" />
      </g>
    </svg>
  );
}
