import { Button } from "@/components/ui/Button";

interface TrendHeaderProps {
  lastUpdated: string;
  sourceCount: number;
  onExport: () => void;
  onRefresh?: () => void;
}

export function TrendHeader({ lastUpdated, sourceCount, onExport, onRefresh }: TrendHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/80 bg-white px-6 py-5 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Trending Intelligence</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Global hashtags, topics, reel formats, and Google search trends from {sourceCount} sources
            including Reddit, X, Facebook, and LinkedIn.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            {lastUpdated}
          </div>

          {onRefresh && (
            <Button variant="outline" onClick={onRefresh}>
              Refresh
            </Button>
          )}

          <Button
            variant="primary"
            onClick={onExport}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            }
          >
            Export
          </Button>
        </div>
      </div>
    </header>
  );
}
