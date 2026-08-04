import type { PlatformId, TrendTab } from "@/types/trends";
import { PlatformIcon } from "@/components/trend/PlatformIcon";

const tabs: { id: TrendTab; label: string; platform?: PlatformId }[] = [
  { id: "all", label: "All" },
  { id: "google", label: "Google", platform: "google" },
  { id: "reddit", label: "Reddit", platform: "reddit" },
  { id: "x", label: "X", platform: "x" },
  { id: "facebook", label: "Facebook", platform: "facebook" },
  { id: "linkedin", label: "LinkedIn", platform: "linkedin" },
  { id: "web", label: "Web", platform: "web" },
  { id: "tavily", label: "Tavily", platform: "tavily" },
  { id: "hashtags", label: "Hashtags" },
  { id: "topics", label: "Topics" },
  { id: "reels", label: "Reels" },
];

interface TrendToolbarProps {
  activeTab: TrendTab;
  search: string;
  onTabChange: (tab: TrendTab) => void;
  onSearchChange: (value: string) => void;
}

export function TrendToolbar({
  activeTab,
  search,
  onTabChange,
  onSearchChange,
}: TrendToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 lg:border-b-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.platform && (
              <span className="scale-75">
                <PlatformIcon platform={tab.platform} />
              </span>
            )}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative w-full lg:w-72">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search trends..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
    </div>
  );
}
