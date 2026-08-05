import type { StatMetric } from "@/types/dashboard";

export type EmployeeScope = "company" | "competitor";

export interface LinkedInEmployeeRow {
  id: string;
  name: string;
  designation: string;
  url?: string;
  source?: string;
  sourceLabel: string;
  initials: string;
  scope: EmployeeScope;
  companyName: string;
  companyUrl?: string;
}

export interface EmployeesPageData {
  company: {
    name: string;
    logoInitials: string;
    subtitle: string;
  };
  companyName: string;
  companyLinkedInUrl?: string;
  reportedEmployeeCount: number;
  employees: LinkedInEmployeeRow[];
  stats: StatMetric[];
  sources: string[];
  companies: string[];
  lastUpdated: string;
}
