import type { ComponentType, SVGProps } from "react";
import {
  BoxIcon,
  HomeIcon,
  PlusIcon,
  TagIcon,
  UserIcon,
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
    title: "General",
    items: [
      {
        href: "/",
        label: "Overview",
        icon: HomeIcon,
        isActive: (pathname) => pathname === "/",
      },
    ],
  },
  {
    title: "Catalogue",
    items: [
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
        href: "/products/new",
        label: "Add product",
        icon: PlusIcon,
        isActive: (pathname) => pathname.startsWith("/products/new"),
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        href: "/profile",
        label: "Profile",
        icon: UserIcon,
        isActive: (pathname) => pathname.startsWith("/profile"),
      },
    ],
  },
];

export const PAGE_TITLES: Array<{ match: (pathname: string) => boolean; title: string }> = [
  { match: (p) => p === "/", title: "Overview" },
  { match: (p) => p.startsWith("/products/new"), title: "Add product" },
  { match: (p) => p.endsWith("/edit"), title: "Edit product" },
  { match: (p) => /^\/products\/[^/]+$/.test(p) && p !== "/products", title: "Product details" },
  { match: (p) => p.startsWith("/products"), title: "Products" },
  { match: (p) => p.startsWith("/categories"), title: "Categories" },
  { match: (p) => p.startsWith("/profile"), title: "Profile" },
];

export function pageTitle(pathname: string): string {
  return PAGE_TITLES.find((entry) => entry.match(pathname))?.title ?? "Dashboard";
}
