"use client";

import { useCallback, useEffect, useState } from "react";
import { EmployeesView } from "@/components/employees/EmployeesView";
import { PageStatusShell } from "@/components/layout/PageStatusShell";
import { mapApiResponseToEmployees } from "@/lib/map-api-to-employees";
import { fetchCompetitorAnalysisResults } from "@/routes/route";
import type { EmployeesPageData } from "@/types/employees";

export function EmployeesPageClient() {
  const [data, setData] = useState<EmployeesPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchCompetitorAnalysisResults();
      const mapped = mapApiResponseToEmployees(response);

      if (!mapped.employees.length && !mapped.reportedEmployeeCount) {
        throw new Error("No LinkedIn employees found in the latest analysis");
      }

      setData(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  if (loading) {
    return (
      <PageStatusShell activeId="employees">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading LinkedIn employees...</p>
        </div>
      </PageStatusShell>
    );
  }

  if (error || !data) {
    return (
      <PageStatusShell activeId="employees">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-red-600">{error ?? "Failed to load employees"}</p>
          <button
            type="button"
            onClick={() => void loadEmployees()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </PageStatusShell>
    );
  }

  return <EmployeesView data={data} onRefresh={() => void loadEmployees()} />;
}
