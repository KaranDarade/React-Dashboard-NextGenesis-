/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { LogOutIcon, RefreshIcon } from "@/components/shell/icons";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProfile } from "@/hooks/useProfile";
import { useStoredUser } from "@/hooks/useStoredUser";
import { clearSession } from "@/lib/auth";
import { cn } from "@/lib/format";
import { useDashboardActivity } from "@/store/DashboardDataContext";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/50 p-3">
      <p className="text-[11px] uppercase tracking-wide text-ink-500">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium text-ink-900">{value}</p>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const stored = useStoredUser();
  const { user, loading, error, retry } = useProfile();
  const { log } = useDashboardActivity();

  const profile = user ?? stored;

  const handleLogout = () => {
    log({ action: "Signed out", actor: profile?.firstName ?? "You" });
    clearSession();
    router.replace("/login");
  };

  return (
    <div className="flex flex-col gap-5">
      <GlassCard className="p-5">
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">
          Profile
        </h2>
        <p className="mt-0.5 text-sm text-ink-500">
          Your DummyJSON account, verified against the live session.
        </p>
      </GlassCard>

      {loading && !profile ? (
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-2 h-3 w-56" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        </GlassCard>
      ) : error && !profile ? (
        <ErrorState message={error} onRetry={retry} />
      ) : profile ? (
        <GlassCard className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {profile.image ? (
              <img
                src={profile.image}
                alt=""
                className="h-16 w-16 rounded-2xl object-cover ring-1 ring-white/70"
              />
            ) : (
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xl font-semibold text-white">
                {profile.firstName?.[0]}
                {profile.lastName?.[0]}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xl font-semibold tracking-tight text-ink-900">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="truncate text-sm text-ink-500">
                @{profile.username} · {profile.email}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={retry}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/55 px-3.5 py-2 text-sm font-medium text-ink-700 transition hover:bg-white/80 disabled:opacity-60"
              >
                <RefreshIcon
                  className={cn("h-4 w-4", loading && "animate-spin")}
                />
                Recheck
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
              >
                <LogOutIcon className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="User ID" value={String(profile.id)} />
            <Field label="Username" value={profile.username} />
            <Field label="Gender" value={profile.gender} />
            <Field label="Email" value={profile.email} />
          </div>

          {error ? (
            <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Showing cached details: {error}
            </p>
          ) : null}
        </GlassCard>
      ) : (
        <EmptySession />
      )}
    </div>
  );
}

function EmptySession() {
  return (
    <GlassCard className="p-6 text-sm text-ink-500">
      No session found. Please sign in again.
    </GlassCard>
  );
}
