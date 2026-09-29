import type { ComponentType, SVGProps } from "react";
import {
  BarChartIcon,
  BoxIcon,
  DashboardIcon,
  SettingsIcon,
  TagIcon,
} from "@/components/shell/icons";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isActive: (pathname: string) => boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Workspace",
    items: [
      {
        href: "/",
        label: "Dashboard",
        icon: DashboardIcon,
        isActive: (pathname) => pathname === "/",
      },
      {
        href: "/products",
        label: "Products",
        icon: BoxIcon,
        isActive: (pathname) =>
          pathname === "/products" ||
          (pathname.startsWith("/products/") &&
            !pathname.startsWith("/products/new")),
      },
      {
        href: "/categories",
        label: "Categories",
        icon: TagIcon,
        isActive: (pathname) => pathname.startsWith("/categories"),
      },
      {
        href: "/analytics",
        label: "Analytics",
        icon: BarChartIcon,
        isActive: (pathname) => pathname.startsWith("/analytics"),
      },
      {
        href: "/settings",
        label: "Settings",
        icon: SettingsIcon,
        isActive: (pathname) => pathname.startsWith("/settings"),
      },
    ],
  },
];

const PAGE_TITLES: Array<{ match: (pathname: string) => boolean; title: string }> =
  [
    { match: (p) => p === "/", title: "Dashboard" },
    { match: (p) => p.startsWith("/products/new"), title: "Add product" },
    { match: (p) => p.endsWith("/edit"), title: "Edit product" },
    {
      match: (p) => /^\/products\/[^/]+$/.test(p) && p !== "/products",
      title: "Product details",
    },
    { match: (p) => p.startsWith("/products"), title: "Products" },
    { match: (p) => p.startsWith("/categories"), title: "Categories" },
    { match: (p) => p.startsWith("/analytics"), title: "Analytics" },
    { match: (p) => p.startsWith("/settings"), title: "Settings" },
    { match: (p) => p.startsWith("/profile"), title: "Profile" },
  ];

export function pageTitle(pathname: string): string {
  return PAGE_TITLES.find((entry) => entry.match(pathname))?.title ?? "Dashboard";
}
