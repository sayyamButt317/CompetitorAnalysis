interface HashtagSparklineProps {
  values: number[];
  color?: string;
}

export function HashtagSparkline({
  values,
  color = "#6366f1",
}: HashtagSparklineProps) {
  if (values.length === 0) {
    return <div className="h-8 w-20 rounded bg-slate-100" />;
  }

  const width = 80;
  const height = 32;
  const padding = 2;
  const max = Math.max(...values, 1);
  const min = 0;

  const points = values.map((value, index) => {
    const x =
      padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
    const y =
      height -
      padding -
      ((value - min) / Math.max(max - min, 1)) * (height - padding * 2);
    return `${x},${y}`;
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point}`).join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
