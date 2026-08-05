import { Avatar } from "@/components/ui/Avatar";
import type { LinkedInEmployeeRow } from "@/types/employees";

interface EmployeeCardProps {
  employee: LinkedInEmployeeRow;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-colors hover:border-sky-200 hover:bg-sky-50/20">
      <div className="mb-3 flex items-start gap-3">
        <Avatar name={employee.name} size="md" />
        <div className="min-w-0 flex-1">
          {employee.url ? (
            <a
              href={employee.url}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-sm font-semibold text-slate-900 hover:text-indigo-600"
            >
              {employee.name}
            </a>
          ) : (
            <p className="truncate text-sm font-semibold text-slate-900">{employee.name}</p>
          )}
          <p className="mt-1 truncate text-xs font-medium text-slate-700">
            {employee.companyName}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {employee.designation}
          </p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            employee.scope === "company"
              ? "bg-indigo-50 text-indigo-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {employee.scope === "company" ? "Company" : "Competitor"}
        </span>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
          {employee.sourceLabel}
        </span>
      </div>

      {employee.url && (
        <a
          href={employee.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-xs font-medium text-sky-700 hover:text-sky-800"
        >
          View LinkedIn →
        </a>
      )}
    </article>
  );
}
