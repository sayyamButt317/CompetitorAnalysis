"use client";

import { useMemo, useState } from "react";
import { EmployeeCard } from "@/components/employees/EmployeeCard";
import type { EmployeeScope, LinkedInEmployeeRow } from "@/types/employees";

type ScopeFilter = "all" | EmployeeScope;

interface EmployeesDirectoryProps {
  employees: LinkedInEmployeeRow[];
  sources: string[];
  companies: string[];
}

export function EmployeesDirectory({
  employees,
  sources,
  companies,
}: EmployeesDirectoryProps) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [source, setSource] = useState("all");
  const [company, setCompany] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((employee) => {
      if (scope !== "all" && employee.scope !== scope) return false;
      if (source !== "all" && employee.sourceLabel !== source) return false;
      if (company !== "all" && employee.companyName !== company) return false;
      if (!q) return true;
      return (
        employee.name.toLowerCase().includes(q) ||
        employee.designation.toLowerCase().includes(q) ||
        employee.companyName.toLowerCase().includes(q)
      );
    });
  }, [employees, query, scope, source, company]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "all", label: "All" },
              { id: "company", label: "Company" },
              { id: "competitor", label: "Competitors" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setScope(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                scope === tab.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, title, company…"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-indigo-200 placeholder:text-slate-400 focus:ring-2 sm:w-64"
          />
          <select
            value={source}
            onChange={(event) => setSource(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">All sources</option>
            {sources.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="max-w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 sm:max-w-[220px]"
          >
            <option value="all">All companies</option>
            {companies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Showing {filtered.length} of {employees.length} people
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium text-slate-800">No employees match these filters</p>
          <p className="mt-1 text-sm text-slate-500">Try clearing search or switching tabs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      )}
    </div>
  );
}
