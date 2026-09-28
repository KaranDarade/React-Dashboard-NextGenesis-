"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStoredUser } from "@/hooks/useStoredUser";
import { clearSession } from "@/lib/auth";

export function Header() {
  const router = useRouter();
  const user = useStoredUser();
  const [leaving, setLeaving] = useState(false);

  const handleLogout = () => {
    if (leaving) return;
    setLeaving(true);
    clearSession();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-base font-semibold text-slate-900"
          >
            NextGenesis <span className="text-indigo-600">Admin</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-slate-600 sm:flex">
            <Link href="/products" className="transition hover:text-indigo-600">
              Products
            </Link>
            <Link
              href="/products/new"
              className="transition hover:text-indigo-600"
            >
              Add product
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <span className="hidden text-sm text-slate-600 sm:inline">
              {user.firstName} {user.lastName}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            disabled={leaving}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {leaving ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}
