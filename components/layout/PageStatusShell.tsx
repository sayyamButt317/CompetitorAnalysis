import type { ReactNode } from "react";
import { APP_COMPANY } from "@/lib/app-brand";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getNavItems } from "@/lib/nav-items";

const defaultCompany = {
  name: APP_COMPANY.name,
  logoInitials: APP_COMPANY.logoInitials,
};

interface PageStatusShellProps {
  activeId: string;
  children: ReactNode;
  company?: { name: string; logoInitials: string };
}

export function PageStatusShell({
  activeId,
  children,
  company = defaultCompany,
}: PageStatusShellProps) {
  return (
    <DashboardLayout navItems={getNavItems(activeId)} company={company}>
      <div className="flex min-h-full items-center justify-center p-6">{children}</div>
    </DashboardLayout>
  );
}
