type MarkProps = { size?: "sm" | "md" | "lg" };

const dims = {
  sm: "h-8 w-8",
  md: "h-14 w-14",
  lg: "h-28 w-28",
};

/** 赤・青の吹き出し＋中央に開いた本とR（ブランドロゴ） */
export function LogoMark({ size = "md" }: MarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-label="RONPA logo"
      className={`${dims[size]} drop-shadow-[0_0_14px_rgba(0,229,255,0.25)]`}
    >
      {/* 肯定側（赤）の吹き出し */}
      <circle
        cx="36"
        cy="47"
        r="25"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="6"
      />
      <path d="M20 66 L10 85 L34 71 Z" fill="var(--color-accent)" />
      {/* 否定側（青）の吹き出し */}
      <circle
        cx="64"
        cy="53"
        r="25"
        fill="none"
        stroke="var(--color-blue)"
        strokeWidth="6"
      />
      <path d="M80 72 L90 90 L66 77 Z" fill="var(--color-blue)" />
      {/* 中央の開いた本 */}
      <path
        d="M50 34 C43 30 33 30 29 33 L29 63 C33 60 43 60 50 64 Z"
        fill="var(--color-ink)"
      />
      <path
        d="M50 34 C57 30 67 30 71 33 L71 63 C67 60 57 60 50 64 Z"
        fill="var(--color-ink)"
      />
      <text
        x="39"
        y="55"
        fontSize="17"
        fontWeight="800"
        textAnchor="middle"
        fill="#05070d"
      >
        R
      </text>
    </svg>
  );
}

export function Wordmark({ className = "text-2xl" }: { className?: string }) {
  return (
    <span
      className={`${className} text-glow font-display font-bold tracking-[0.3em] text-ink`}
    >
      RONPA
    </span>
  );
}
