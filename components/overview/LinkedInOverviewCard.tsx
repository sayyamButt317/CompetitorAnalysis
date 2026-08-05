import Link from "next/link";
import type { OverviewLinkedInSection } from "@/types/overview";

interface LinkedInOverviewCardProps {
  data: OverviewLinkedInSection;
}

export function LinkedInOverviewCard({ data }: LinkedInOverviewCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">LinkedIn Overview</h3>
          <p className="text-xs text-slate-400">Company presence & hiring signals</p>
        </div>
        {data.url ? (
          <a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-sky-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-700"
          >
            LinkedIn
          </a>
        ) : (
          <span className="rounded-lg bg-sky-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
            LinkedIn
          </span>
        )}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <MiniStat label="Employees" value={String(data.employeeCount)} />
        <MiniStat label="Posts" value={String(data.postCount)} />
        <MiniStat label="Hiring" value={data.isHiring ? "Yes" : "No"} />
        <MiniStat label="Thought Leadership" value={data.thoughtLeadershipLabel} />
        <MiniStat label="Open roles" value={String(data.openRoles)} />
        <MiniStat label="Avg post length" value={String(data.avgPostLength ?? "—")} />
      </div>

      {data.positioningFocus.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {data.positioningFocus.map((item) => (
            <span
              key={item}
              className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {data.businessSignals.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">Business Signals</p>
          <div className="flex flex-wrap gap-1.5">
            {data.businessSignals.map((signal) => (
              <span
                key={signal}
                className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.themes.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">Content Themes</p>
          <div className="space-y-2">
            {data.themes.slice(0, 5).map((theme) => (
              <div key={theme.theme}>
                <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                  <span className="truncate text-slate-600">{theme.theme}</span>
                  <span className="font-medium text-slate-500">{theme.share}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{ width: `${Math.max(theme.share, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.samplePosts.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">Recent LinkedIn Posts</p>
          <ul className="space-y-2">
            {data.samplePosts.slice(0, 3).map((post, index) => (
              <li key={`${post.text.slice(0, 24)}-${index}`} className="rounded-xl bg-slate-50 p-2.5">
                <p className="line-clamp-3 text-xs leading-relaxed text-slate-600">{post.text}</p>
                {post.url && (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-[11px] font-medium text-sky-700"
                  >
                    View post →
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.employees.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500">Top Employees</p>
            <Link
              href="/employees"
              className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all →
            </Link>
          </div>
          <ul className="space-y-2.5">
            {data.employees.map((employee, index) => (
              <li key={`${employee.name}-${index}`} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[11px] font-semibold text-sky-700">
                  {employee.initials}
                </div>
                <div className="min-w-0 flex-1">
                  {employee.url ? (
                    <a
                      href={employee.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-sm font-medium text-slate-800 hover:text-indigo-600"
                    >
                      {employee.name}
                    </a>
                  ) : (
                    <p className="truncate text-sm font-medium text-slate-800">{employee.name}</p>
                  )}
                  <p className="truncate text-[11px] text-slate-400">{employee.designation}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.jobOpenings.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">Job Openings</p>
          <ul className="space-y-2">
            {data.jobOpenings.map((job, index) => (
              <li key={`${job.title}-${index}`} className="rounded-xl bg-slate-50 px-3 py-2">
                {job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-sky-700 hover:text-sky-800"
                  >
                    {job.title}
                  </a>
                ) : (
                  <p className="text-xs font-semibold text-slate-800">{job.title}</p>
                )}
                {job.location && <p className="text-[11px] text-slate-500">{job.location}</p>}
                {job.snippet && (
                  <p className="mt-1 line-clamp-2 text-[11px] text-slate-500">{job.snippet}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.warnings.length > 0 && (
        <ul className="mt-4 space-y-1">
          {data.warnings.map((warning) => (
            <li key={warning} className="text-[11px] text-amber-700">
              {warning}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
