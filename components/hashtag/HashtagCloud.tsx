import type { HashtagCloudItem } from "@/types/hashtag";

const sizeClasses: Record<HashtagCloudItem["size"], string> = {
  xl: "text-2xl font-bold",
  lg: "text-xl font-semibold",
  md: "text-base font-semibold",
  sm: "text-sm font-medium",
  xs: "text-xs font-medium",
};

const colorClasses = [
  "text-indigo-600",
  "text-violet-600",
  "text-emerald-600",
  "text-blue-600",
  "text-amber-600",
  "text-rose-600",
  "text-sky-600",
  "text-purple-600",
];

interface HashtagCloudProps {
  tags: HashtagCloudItem[];
}

export function HashtagCloud({ tags }: HashtagCloudProps) {
  return (
    <div className="flex min-h-[220px] flex-wrap items-center justify-center gap-x-3 gap-y-2 p-2 text-center">
      {tags.map((item, index) => (
        <span
          key={item.tag}
          className={`inline-block transition-opacity hover:opacity-80 ${sizeClasses[item.size]} ${colorClasses[index % colorClasses.length]}`}
        >
          {item.displayTag}
        </span>
      ))}
    </div>
  );
}
