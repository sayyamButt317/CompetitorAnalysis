import type { LineChartPoint } from "@/types/dashboard";

interface LineChartProps {
  data: LineChartPoint[];
  color?: string;
  height?: number;
}

export function LineChart({ data, color = "#6366f1", height = 160 }: LineChartProps) {
  const padding = { top: 20, right: 20, bottom: 30, left: 10 };
  const width = 400;
  const chartHeight = height - padding.top - padding.bottom;
  const chartWidth = width - padding.left - padding.right;

  const values = data.map((d) => d.value);
  const min = Math.min(...values) * 0.9;
  const max = Math.max(...values) * 1.05;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.value - min) / (max - min)) * chartHeight;
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
        <circle key={p.label} cx={p.x} cy={p.y} r="3.5" fill="white" stroke={color} strokeWidth="2" />
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
            {lastPoint.value}%
          </text>
        </g>
      )}

      {data.map((d, i) => (
        <text
          key={d.label}
          x={padding.left + (i / (data.length - 1)) * chartWidth}
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
