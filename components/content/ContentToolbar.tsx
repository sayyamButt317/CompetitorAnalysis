import type { ContentTab } from "@/types/content";

const tabs: { id: ContentTab; label: string }[] = [
  { id: "all", label: "All Posts" },
  { id: "reel", label: "Reels" },
  { id: "image", label: "Images" },
  { id: "carousel", label: "Carousels" },
  { id: "top", label: "Top Performing" },
];

interface ContentToolbarProps {
  activeTab: ContentTab;
  search: string;
  viewMode: "grid" | "list";
  onTabChange: (tab: ContentTab) => void;
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function ContentToolbar({
  activeTab,
  search,
  viewMode,
  onTabChange,
  onSearchChange,
  onViewModeChange,
}: ContentToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 lg:border-b-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 lg:w-80">
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
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by caption, hashtag or username..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex rounded-lg border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`rounded-md p-2 transition-colors ${
              viewMode === "grid"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
            aria-label="Grid view"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`rounded-md p-2 transition-colors ${
              viewMode === "list"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
            aria-label="List view"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
