import type { NavItem } from "@/types/dashboard";

const baseNavItems: Omit<NavItem, "active">[] = [
  { id: "overview", label: "Overview", href: "/overview" },
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "competitors", label: "Competitors", href: "/competitors" },
  { id: "employees", label: "Employees", href: "/employees" },
  { id: "content", label: "Content", href: "/content" },
  { id: "hashtags", label: "Hashtags", href: "/hashtag" },
  { id: "trends", label: "Global Trends", href: "/trend" },
  { id: "trend-discover", label: "Niche Trends", href: "/trend/discover" },
];

export function getNavItems(activeId: string): NavItem[] {
  return baseNavItems.map((item) => ({
    ...item,
    active: item.id === activeId,
  }));
}

export const navItems = getNavItems("overview");
