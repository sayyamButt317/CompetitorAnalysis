import type { OverviewDnaColumn } from "@/types/overview";

interface CompanyDnaGridProps {
  columns: OverviewDnaColumn[];
}

export function CompanyDnaGrid({ columns }: CompanyDnaGridProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Company DNA</h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => (
          <div key={column.id}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {column.title}
            </p>
            {column.items.length === 0 ? (
              <p className="text-xs text-slate-400">No data yet</p>
            ) : column.variant === "tags" ? (
              <div className="flex flex-wrap gap-1.5">
                {column.items.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {column.items.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {column.moreLabel && (
              <p className="mt-3 text-xs font-medium text-indigo-600">{column.moreLabel}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
