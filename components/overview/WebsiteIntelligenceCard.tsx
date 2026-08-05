import type { OverviewWebsiteSection } from "@/types/overview";

interface WebsiteIntelligenceCardProps {
  data: OverviewWebsiteSection;
}

export function WebsiteIntelligenceCard({ data }: WebsiteIntelligenceCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Website Intelligence</h3>
          <p className="text-xs text-slate-400">
            {data.available ? "Derived from crawl & search signals" : "Limited website data"}
          </p>
        </div>
        <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
          Web
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <MiniStat label="Pages" value={data.pagesLabel} />
        <MiniStat label="Blog Posts" value={data.blogLabel} />
        <MiniStat label="Services" value={data.servicesLabel} />
        <MiniStat label="CTA Score" value={data.ctaLabel} />
      </div>

      {data.topPages.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">Top Pages</p>
          <div className="space-y-2">
            {data.topPages.map((page) => (
              <div key={page.path}>
                <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                  <span className="truncate text-slate-600">{page.path}</span>
                  <span className="font-medium text-slate-400">{page.value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${Math.max(page.value, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.technologies.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">Technologies Detected</p>
          <div className="flex flex-wrap gap-1.5">
            {data.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500">SEO Snapshot</p>
        <div className="grid grid-cols-2 gap-3">
          {data.seoMetrics.map((metric) => (
            <div key={metric.label} className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 p-3">
              <ScoreRing score={metric.score} />
              <p className="mt-2 text-sm font-semibold text-slate-800">{metric.value}</p>
              <p className="text-[10px] text-slate-400">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      {data.seoKeywords.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">SEO Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {data.seoKeywords.slice(0, 12).map((keyword) => (
              <span
                key={keyword}
                className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.url && (
        <a
          href={data.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-[11px] font-medium text-emerald-700 hover:text-emerald-800"
        >
          Open website →
        </a>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Number.isFinite(score) ? Math.min(Math.max(score, 0), 100) : 0;
  const dash = (safeScore / 100) * circumference;

  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 -rotate-90">
      <circle cx="24" cy="24" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="4" />
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke="#10b981"
        strokeWidth="4"
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
      />
    </svg>
  );
}
