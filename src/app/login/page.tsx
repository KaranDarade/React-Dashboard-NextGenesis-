"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SparklesIcon } from "@/components/shell/icons";
import { login } from "@/lib/api/auth";
import { setSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await login(username.trim(), password);
      setSession(data.accessToken, {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
      });
      router.replace("/");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Login failed. Please try again.",
      );
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setUsername("emilys");
    setPassword("emilyspass");
    setError(null);
  };

  const fieldClass =
    "w-full rounded-xl border border-white/60 bg-white/55 px-3 py-2.5 text-sm text-ink-900 shadow-sm outline-none backdrop-blur transition placeholder:text-ink-500/60 focus:border-indigo-300 focus:bg-white/80 focus:ring-2 focus:ring-indigo-200";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-strong chart-rise w-full max-w-sm rounded-3xl p-7">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-white shadow-[0_14px_28px_-12px_rgba(79,70,229,0.9)]">
            <SparklesIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-ink-900">
              NextGenesis
            </h1>
            <p className="text-xs text-ink-500">Product control centre</p>
          </div>
        </div>

        <p className="mt-5 text-sm text-ink-500">
          Sign in to explore live catalogue analytics.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-5 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-500">
              Username
            </span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className={fieldClass}
              placeholder="emilys"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-500">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className={fieldClass}
              placeholder="emilyspass"
            />
          </label>

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-rose-200/70 bg-rose-50/80 px-3 py-2 text-sm text-rose-700"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_14px_30px_-14px_rgba(79,70,229,0.95)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <button
          type="button"
          onClick={fillDemo}
          className="mt-4 w-full text-center text-xs font-medium text-indigo-600 transition hover:text-indigo-700 hover:underline"
        >
          Use demo credentials (emilys / emilyspass)
        </button>
      </div>
    </main>
  );
}
