"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StoreFlowMark } from "@/components/shell/icons";
import { login } from "@/lib/api/auth";
import { setSession } from "@/lib/auth";

const HIGHLIGHTS = [
  "Live catalogue analytics from the DummyJSON API",
  "Search, filter, sort and paginate 190+ real products",
  "Add, edit and delete with instant local updates",
];

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
    "focus-brand w-full rounded-xl border border-line bg-white/[0.04] px-3 py-2.5 text-sm text-fg outline-none transition placeholder:text-fg-4 hover:border-line-strong focus:border-brand/50 focus:bg-white/[0.06]";

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden border-r border-line p-10 lg:flex">
        <div className="flex items-center gap-3">
          <StoreFlowMark className="h-10 w-10" />
          <span className="text-lg font-semibold tracking-tight text-fg">
            StoreFlow
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-fg">
            Product management,
            <br />
            without the clutter.
          </h1>
          <ul className="mt-6 flex flex-col gap-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-fg-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-fg-4">
          Demo data from DummyJSON. Prices shown in INR as demonstration values.
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <StoreFlowMark className="h-10 w-10" />
            <span className="text-lg font-semibold tracking-tight text-fg">
              StoreFlow
            </span>
          </div>

          <div className="glass-strong pop rounded-3xl p-7">
            <h2 className="text-xl font-semibold tracking-tight text-fg">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-fg-3">
              Sign in to manage your product catalog.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-6 flex flex-col gap-4"
            >
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-fg-2">Username</span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  className={fieldClass}
                  placeholder="emilys"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-fg-2">Password</span>
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
                  className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="focus-brand mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-darker transition hover:bg-brand-bright disabled:opacity-60"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <button
              type="button"
              onClick={fillDemo}
              className="mt-4 w-full text-center text-xs font-medium text-brand transition hover:text-brand-bright hover:underline"
            >
              Use demo credentials (emilys / emilyspass)
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
