import type { BarChartItem } from "@/types/dashboard";

interface BarChartProps {
  data: BarChartItem[];
  color?: string;
}

export function BarChart({ data, color = "#6366f1" }: BarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-xs text-slate-400">No chart data</div>
    );
  }

  const values = data.map((d) => d.value).filter((value) => Number.isFinite(value));
  const max = Math.max(...values, 1);

  return (
    <div className="flex h-40 w-full items-end justify-between gap-2 px-1">
      {data.map((item) => {
        const heightPct = Number.isFinite(item.value) ? (item.value / max) * 100 : 0;
        return (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-32 w-full items-end justify-center">
              <div
                className="w-full max-w-8 rounded-t-md transition-all"
                style={{
                  height: `${Math.max(heightPct, 0)}%`,
                  backgroundColor: color,
                  opacity: 0.85,
                }}
              />
            </div>
            <span className="text-[10px] font-medium text-slate-500">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
