import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmployeesDirectory } from "@/components/employees/EmployeesDirectory";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCardGrid } from "@/components/ui/StatCard";
import { getNavItems } from "@/lib/nav-items";
import type { EmployeesPageData } from "@/types/employees";

interface EmployeesViewProps {
  data: EmployeesPageData;
  onRefresh?: () => void;
}

export function EmployeesView({ data, onRefresh }: EmployeesViewProps) {
  return (
    <DashboardLayout navItems={getNavItems("employees")} company={data.company}>
      <DashboardHeader
        title="LinkedIn Employees"
        subtitle={data.company.subtitle}
        lastUpdated={data.lastUpdated}
      />

      <div className="space-y-5 p-6 lg:p-8">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">{data.companyName}</h2>
              <p className="mt-1 text-xs text-slate-500">
                {data.reportedEmployeeCount} employees reported on LinkedIn ·{" "}
                {data.employees.length} profiles mapped from crawl + search sources
              </p>
            </div>
            {data.companyLinkedInUrl && (
              <a
                href={data.companyLinkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100"
              >
                Company LinkedIn →
              </a>
            )}
          </div>
        </div>

        <StatCardGrid metrics={data.stats} />
        <EmployeesDirectory
          employees={data.employees}
          sources={data.sources}
          companies={data.companies}
        />

        {onRefresh && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Refresh data
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
