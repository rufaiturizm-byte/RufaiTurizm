export function Logo({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const ink = tone === "light" ? "#fff" : "oklch(0.22 0.035 258)";
  const sub = tone === "light" ? "rgba(255,255,255,0.55)" : "oklch(0.52 0.02 258)";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 120 120" aria-hidden="true" className="shrink-0">
        <circle cx="60" cy="60" r="57" fill="none" stroke="var(--brand-gold)" strokeWidth="3" />
        <g fill="var(--brand-gold)">
          <path d="M38 30.4l1.5 3.1 3.4.5-2.45 2.4.58 3.4L38 38.2l-3.03 1.6.58-3.4-2.45-2.4 3.4-.5z" />
          <path d="M49 26.2l1.5 3.1 3.4.5-2.45 2.4.58 3.4L49 34l-3.03 1.6.58-3.4-2.45-2.4 3.4-.5z" />
          <path d="M60 24.6l1.5 3.1 3.4.5-2.45 2.4.58 3.4L60 32.4l-3.03 1.6.58-3.4-2.45-2.4 3.4-.5z" />
          <path d="M71 26.2l1.5 3.1 3.4.5-2.45 2.4.58 3.4L71 34l-3.03 1.6.58-3.4-2.45-2.4 3.4-.5z" />
          <path d="M82 30.4l1.5 3.1 3.4.5-2.45 2.4.58 3.4L82 38.2l-3.03 1.6.58-3.4-2.45-2.4 3.4-.5z" />
        </g>
        <path d="M40 84V45h17.5c6.9 0 12.2 4.9 12.2 11.4 0 5.6-3.7 10-9.2 11.1L74 84h-9.6L54.4 68.6h-6.1V84z" fill={ink} />
        <path
          d="M48.3 52.2v9.6h8.4c3.1 0 5.2-2 5.2-4.8s-2.1-4.8-5.2-4.8z"
          fill={tone === "light" ? "var(--brand-night)" : "#fff"}
        />
        <path d="M28 88c7.5-5.4 14.9-5.4 22.4 0s14.9 5.4 22.4 0 14.9-5.4 19.2-1.6v6.2c-4.3-3.8-11.7-3.8-19.2 1.6s-14.9 5.4-22.4 0-14.9-5.4-22.4 0z" fill="var(--brand-gold)" />
      </svg>
      <div className="leading-none">
        <div className="text-[17px] font-bold tracking-wide" style={{ color: ink }}>
          RUFAI
        </div>
        <div className="mt-1 text-[9px] tracking-[0.34em]" style={{ color: sub }}>
          TOURISM
        </div>
      </div>
    </div>
  );
}
