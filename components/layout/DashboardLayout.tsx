import type { ReactNode } from "react";
import type { NavItem } from "@/types/dashboard";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  company: { name: string; logoInitials: string };
}

export function DashboardLayout({ children, navItems, company }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar items={navItems} company={company} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
