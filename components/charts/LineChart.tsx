import type { LineChartPoint } from "@/types/dashboard";

interface LineChartProps {
  data: LineChartPoint[];
  color?: string;
  height?: number;
}

function safeNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

export function LineChart({ data, color = "#6366f1", height = 160 }: LineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-slate-400">
        No trend data
      </div>
    );
  }

  const padding = { top: 20, right: 20, bottom: 30, left: 10 };
  const width = 400;
  const chartHeight = height - padding.top - padding.bottom;
  const chartWidth = width - padding.left - padding.right;

  const values = data.map((d) => d.value).filter((value) => Number.isFinite(value));
  const rawMin = values.length > 0 ? Math.min(...values) : 0;
  const rawMax = values.length > 0 ? Math.max(...values) : 1;
  let min = rawMin * 0.9;
  let max = rawMax * 1.05;
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    min = Math.min(rawMin, 0);
    max = Math.max(rawMax, min + 1);
  }
  const range = max - min || 1;
  const divisor = Math.max(data.length - 1, 1);

  const points = data.map((d, i) => {
    const x = safeNumber(padding.left + (i / divisor) * chartWidth, padding.left);
    const y = safeNumber(
      padding.top + chartHeight - ((d.value - min) / range) * chartHeight,
      padding.top + chartHeight / 2,
    );
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  const lastPoint = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={areaPath} fill="url(#lineGradient)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p) => (
        <circle
          key={p.label}
          cx={String(p.x)}
          cy={String(p.y)}
          r="3.5"
          fill="white"
          stroke={color}
          strokeWidth="2"
        />
      ))}

      {lastPoint && (
        <g>
          <rect
            x={lastPoint.x - 28}
            y={lastPoint.y - 32}
            width="56"
            height="22"
            rx="4"
            fill="#1e293b"
          />
          <text
            x={lastPoint.x}
            y={lastPoint.y - 17}
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="600"
          >
            {Number.isFinite(lastPoint.value) ? `${lastPoint.value}%` : "—"}
          </text>
        </g>
      )}

      {data.map((d, i) => (
        <text
          key={d.label}
          x={padding.left + (i / divisor) * chartWidth}
          y={height - 8}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="10"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
}
