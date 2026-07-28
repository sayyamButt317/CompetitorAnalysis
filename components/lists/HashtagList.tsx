import type { HashtagItem } from "@/types/dashboard";

interface HashtagListProps {
  items: HashtagItem[];
}

export function HashtagList({ items }: HashtagListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.tag}>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-600">{item.tag}</span>
            <span className="text-xs text-slate-400">{item.count}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${(item.count / item.maxCount) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
