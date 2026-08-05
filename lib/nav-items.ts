import type { NavItem } from "@/types/dashboard";

const baseNavItems: Omit<NavItem, "active">[] = [
  { id: "overview", label: "Overview", href: "/dashboard" },
  { id: "competitors", label: "Competitors", href: "/competitors" },
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
