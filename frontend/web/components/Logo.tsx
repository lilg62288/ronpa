export function HankoMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = {
    sm: "h-8 w-8 rounded-lg text-lg",
    md: "h-12 w-12 rounded-xl text-2xl",
    lg: "h-20 w-20 rounded-2xl text-4xl",
  }[size];
  return (
    <span
      className={`${dims} inline-flex rotate-3 items-center justify-center bg-accent font-black text-white shadow-lg shadow-accent/30`}
    >
      論
    </span>
  );
}

export function Wordmark({ className = "text-2xl" }: { className?: string }) {
  return (
    <span className={`${className} font-black tracking-[0.2em] text-ink`}>
      RONPA
    </span>
  );
}
