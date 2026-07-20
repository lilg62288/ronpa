type Axis = { label: string; score: number };

/** 4軸レーダーチャート（10点満点） */
export function RadarChart({ axes }: { axes: Axis[] }) {
  const cx = 130;
  const cy = 118;
  const r = 70;
  // 上・右・下・左の順
  const angles = [-90, 0, 90, 180].map((d) => (d * Math.PI) / 180);
  const coord = (angle: number, ratio: number): [number, number] => [
    cx + Math.cos(angle) * r * ratio,
    cy + Math.sin(angle) * r * ratio,
  ];
  const points = (ratio: number) =>
    angles.map((a) => coord(a, ratio).join(",")).join(" ");

  const valuePoints = axes
    .map((a, i) => coord(angles[i], a.score / 10).join(","))
    .join(" ");

  // [labelX, labelY, valueY, anchor]
  const labelPos: [number, number, number, "middle" | "start" | "end"][] = [
    [cx, 22, 40, "middle"],
    [cx + r + 14, cy - 4, cy + 14, "start"],
    [cx, cy + r + 20, cy + r + 38, "middle"],
    [cx - r - 14, cy - 4, cy + 14, "end"],
  ];

  return (
    <svg viewBox="-30 0 320 240" className="mx-auto w-full max-w-[320px]">
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <polygon
          key={ratio}
          points={points(ratio)}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={ratio === 1 ? 1.5 : 1}
        />
      ))}
      {angles.map((a, i) => {
        const [x, y] = coord(a, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--color-line)"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={valuePoints}
        fill="var(--color-cyan)"
        fillOpacity={0.18}
        stroke="var(--color-cyan)"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {axes.map((a, i) => {
        const [x, y] = coord(angles[i], a.score / 10);
        return (
          <circle
            key={a.label}
            cx={x}
            cy={y}
            r={4}
            fill="var(--color-cyan)"
            stroke="var(--color-bg)"
            strokeWidth={2}
          />
        );
      })}
      {axes.map((a, i) => {
        const [lx, ly, vy, anchor] = labelPos[i];
        return (
          <g key={a.label} textAnchor={anchor}>
            <text x={lx} y={ly} className="fill-ink-2 text-[11px] font-semibold">
              {a.label}
            </text>
            <text x={lx} y={vy} className="fill-ink text-[14px] font-bold">
              {a.score}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
