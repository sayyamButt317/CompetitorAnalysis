"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_COMPANY } from "@/lib/app-brand";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getNavItems } from "@/lib/nav-items";

const trendLinks = [
  { href: "/trend", label: "Overview", match: (path: string) => path === "/trend" },
  {
    href: "/trend/discover",
    label: "Discover",
    match: (path: string) => path === "/trend/discover",
  },
  {
    href: "/trend/analytics",
    label: "Analytics",
    match: (path: string) => path === "/trend/analytics",
  },
  {
    href: "/trend/runs",
    label: "Saved Runs",
    match: (path: string) => path.startsWith("/trend/runs"),
  },
  {
    href: "/trend/hashtags",
    label: "Hashtags",
    match: (path: string) => path === "/trend/hashtags",
  },
  {
    href: "/trend/viral-posts",
    label: "Viral Posts",
    match: (path: string) => path === "/trend/viral-posts",
  },
  {
    href: "/trend/scores",
    label: "Scores",
    match: (path: string) => path === "/trend/scores",
  },
];

export function TrendSubNavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-slate-200/80 bg-white px-6 py-2 lg:px-8">
      {trendLinks.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

interface TrendPageShellProps {
  title: string;
  description?: string;
  activeId?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function TrendPageShell({
  title,
  description,
  activeId = "trends",
  children,
  action,
}: TrendPageShellProps) {
  return (
    <DashboardLayout
      navItems={getNavItems(activeId)}
      company={{ name: APP_COMPANY.name, logoInitials: APP_COMPANY.logoInitials }}
    >
      <header className="border-b border-slate-200/80 bg-white px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {description && <p className="mt-1 max-w-3xl text-sm text-slate-500">{description}</p>}
          </div>
          {action}
        </div>
      </header>

      <TrendSubNavBar />

      <div className="space-y-5 p-6 lg:p-8">{children}</div>
    </DashboardLayout>
  );
}

interface TrendLoadingStateProps {
  message?: string;
}

export function TrendLoadingState({ message = "Loading..." }: TrendLoadingStateProps) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        <p className="text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}

interface TrendErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function TrendErrorState({ message, onRetry }: TrendErrorStateProps) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
      <p className="text-sm text-red-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function formatTrendDate(value?: string): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDuration(seconds?: number): string {
  if (!seconds) return "—";
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

export function truncateText(text?: string, max = 120): string {
  if (!text) return "—";
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}
