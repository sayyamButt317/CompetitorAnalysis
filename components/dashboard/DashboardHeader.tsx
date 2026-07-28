import { Button } from "@/components/ui/Button";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
}

export function DashboardHeader({ title, subtitle, lastUpdated }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/80 bg-white px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600"
            aria-label="More info"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </button>
        </div>
        <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex flex-col items-start gap-3 sm:items-end">
        <p className="text-xs text-slate-400">Last updated: {lastUpdated}</p>
        <div className="flex gap-2">
          <Button variant="outline">Export PDF</Button>
          <Button
            variant="primary"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            }
          >
            Download CSV
          </Button>
        </div>
      </div>
    </header>
  );
}
