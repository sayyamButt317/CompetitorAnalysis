import type { ApiLinkedInEmployee, CompetitorAnalysisResponse } from "@/types/api";
import type {
  EmployeesPageData,
  EmployeeScope,
  LinkedInEmployeeRow,
} from "@/types/employees";
import { APP_COMPANY } from "@/lib/app-brand";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function sourceLabel(source?: string): string {
  if (!source) return "Unknown";
  if (source.includes("playwright")) return "Playwright";
  if (source.includes("tavily")) return "Tavily";
  return source
    .replace(/^linkedin_/i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function cleanDesignation(value?: string): string {
  if (!value) return "Title unavailable";
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed || trimmed.toLowerCase() === "self") return "Title unavailable";
  return trimmed.length > 160 ? `${trimmed.slice(0, 157)}…` : trimmed;
}

function mapEmployee(
  employee: ApiLinkedInEmployee,
  index: number,
  scope: EmployeeScope,
  companyName: string,
  companyUrl?: string | null,
): LinkedInEmployeeRow | null {
  const name = employee.name?.trim();
  if (!name) return null;

  const url = employee.linkedin_url?.trim() || undefined;
  const id = url || `${scope}-${companyName}-${name}-${index}`;

  return {
    id,
    name,
    designation: cleanDesignation(employee.designation),
    url,
    source: employee.source,
    sourceLabel: sourceLabel(employee.source),
    initials: initials(name),
    scope,
    companyName,
    companyUrl: companyUrl ?? undefined,
  };
}

function dedupeEmployees(rows: LinkedInEmployeeRow[]): LinkedInEmployeeRow[] {
  const seen = new Set<string>();
  const result: LinkedInEmployeeRow[] = [];

  for (const row of rows) {
    const key = (row.url || `${row.name}|${row.companyName}`).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(row);
  }

  return result;
}

export function mapApiResponseToEmployees(
  response: CompetitorAnalysisResponse,
): EmployeesPageData {
  const companyName =
    response.company_profile?.name ??
    response.company?.name ??
    response.company_analysis?.name ??
    response.analysis?.company?.name ??
    APP_COMPANY.name;

  const userLinkedIn = response.company_social_analysis?.user_linkedin;
  const companyLinkedInUrl =
    userLinkedIn?.linkedin_url ??
    response.company?.linkedin_url ??
    response.company_profile?.linkedin_url ??
    undefined;

  const companyEmployees = (userLinkedIn?.employees ?? [])
    .map((employee, index) =>
      mapEmployee(employee, index, "company", companyName, companyLinkedInUrl),
    )
    .filter((row): row is LinkedInEmployeeRow => Boolean(row));

  const competitorEmployees = (response.competitors ?? []).flatMap((competitor, cIndex) => {
    const competitorName = competitor.name ?? competitor.username ?? `Competitor ${cIndex + 1}`;
    return (competitor.employees ?? [])
      .map((employee, index) =>
        mapEmployee(
          employee,
          index,
          "competitor",
          competitorName,
          competitor.linkedin_url,
        ),
      )
      .filter((row): row is LinkedInEmployeeRow => Boolean(row));
  });

  const employees = dedupeEmployees([...companyEmployees, ...competitorEmployees]).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const companyCount = employees.filter((e) => e.scope === "company").length;
  const competitorCount = employees.filter((e) => e.scope === "competitor").length;
  const reportedEmployeeCount =
    userLinkedIn?.employee_count ??
    userLinkedIn?.analysis?.employee_count ??
    companyCount;

  const sources = Array.from(
    new Set(employees.map((e) => e.sourceLabel).filter(Boolean)),
  ).sort();

  const companies = Array.from(new Set(employees.map((e) => e.companyName))).sort((a, b) =>
    a.localeCompare(b),
  );

  return {
    company: {
      name: APP_COMPANY.name,
      logoInitials: APP_COMPANY.logoInitials,
      subtitle: `LinkedIn people intelligence for ${companyName}`,
    },
    companyName,
    companyLinkedInUrl: companyLinkedInUrl ?? undefined,
    reportedEmployeeCount,
    employees,
    sources,
    companies,
    lastUpdated:
      response.meta?.created_at ??
      response.meta?.timestamp ??
      new Date().toISOString(),
    stats: [
      {
        id: "total",
        label: "People Mapped",
        value: String(employees.length),
        subtitle: "Unique profiles",
        iconVariant: "competitors",
      },
      {
        id: "company",
        label: "Company Team",
        value: String(companyCount),
        subtitle: `Reported size ${reportedEmployeeCount}`,
        iconVariant: "posts",
      },
      {
        id: "competitors",
        label: "Competitor People",
        value: String(competitorCount),
        subtitle: `${companies.length - (companyCount > 0 ? 1 : 0)} companies`,
        iconVariant: "engagement",
      },
      {
        id: "sources",
        label: "Data Sources",
        value: String(sources.length || 1),
        subtitle: sources.join(" · ") || "LinkedIn",
        iconVariant: "calendar",
      },
    ],
  };
}
