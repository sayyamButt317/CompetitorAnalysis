import type { NavItem } from "@/types/dashboard";

const baseNavItems: Omit<NavItem, "active">[] = [
  { id: "overview", label: "Overview", href: "/" },
  { id: "competitors", label: "Competitors", href: "/competitors" },
  { id: "content", label: "Content", href: "/content" },
  { id: "hashtags", label: "Hashtags", href: "/hashtag" },
  { id: "trends", label: "Trends", href: "/trend" },
];

export function getNavItems(activeId: string): NavItem[] {
  return baseNavItems.map((item) => ({
    ...item,
    active: item.id === activeId,
  }));
}

export const navItems = getNavItems("overview");
