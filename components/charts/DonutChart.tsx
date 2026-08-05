import type { ChartSegment } from "@/types/dashboard";

interface DonutChartProps {
  segments: ChartSegment[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
}

export function DonutChart({
  segments,
  centerLabel = "Total",
  centerValue,
  size = 160,
}: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const slices = segments.map((segment) => {
    const pct = segment.value / total;
    const dash = pct * circumference;
    const slice = {
      ...segment,
      dash,
      offset: -offset,
      pct: Math.round(pct * 100),
    };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex w-full items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="12"
          />
          {slices.map((slice, index) => (
            <circle
              key={`${slice.label}-${index}`}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth="12"
              strokeDasharray={`${slice.dash} ${circumference - slice.dash}`}
              strokeDashoffset={slice.offset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerValue && (
            <span className="text-lg font-bold text-slate-800">{centerValue}</span>
          )}
          <span className="text-[10px] text-slate-400">{centerLabel}</span>
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-2">
        {slices.map((slice, index) => (
          <li key={`${slice.label}-${index}`} className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="truncate text-slate-600">{slice.label}</span>
            </div>
            <span className="shrink-0 font-medium text-slate-800">{slice.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
