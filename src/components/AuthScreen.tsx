"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Database,
  Globe2,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
  ShieldCheck,
} from "lucide-react";

type AuthMode = "login" | "signup";

type AuthScreenProps = {
  mode: AuthMode;
};

type FormState = {
  name: string;
  email: string;
  password: string;
};

const COPY: Record<
  AuthMode,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    switchLabel: string;
    switchHref: string;
    switchText: string;
    bulletPoints: Array<{ icon: string; title: string; description: string }>;
  }
> = {
  login: {
    eyebrow: "Secure mission access",
    title: "Welcome back to TWIN AI",
    subtitle:
      "Continue monitoring climate data, alerts, simulations, and AI recommendations from your saved account.",
    cta: "Sign in to continue",
    switchLabel: "New here?",
    switchHref: "/signup",
    switchText: "Create an account",
    bulletPoints: [
      {
        icon: "🛰",
        title: "Live dashboards",
        description: "Return to climate, agriculture, and disaster panels with one click.",
      },
      {
        icon: "🔐",
        title: "HTTP-only sessions",
        description: "Your login is stored in a secure cookie, not in local storage.",
      },
      {
        icon: "🌍",
        title: "MongoDB-backed profiles",
        description: "Account data lives in MongoDB and is ready for expansion.",
      },
    ],
  },
  signup: {
    eyebrow: "Create your mission account",
    title: "Join the TWIN AI platform",
    subtitle:
      "Register to save your identity, future preferences, and session state across the platform.",
    cta: "Create account",
    switchLabel: "Already have an account?",
    switchHref: "/login",
    switchText: "Sign in instead",
    bulletPoints: [
      {
        icon: "🛡",
        title: "Password hashing",
        description: "Passwords are hashed with bcrypt before they ever reach the database.",
      },
      {
        icon: "🧬",
        title: "Session tokens",
        description: "JWTs keep the backend stateless while still supporting secure auth.",
      },
      {
        icon: "🌐",
        title: "Platform ready",
        description: "The auth layer works alongside the existing Next.js and Flask surfaces.",
      },
    ],
  },
};

function splitFullName(fullName: string) {
  return fullName.trim().replace(/\s+/g, " ");
}

export default function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const copy = COPY[mode];
  const redirectTo = searchParams.get("next") || "/dashboard";

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload =
      mode === "signup"
        ? {
            name: splitFullName(form.name),
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }
        : {
            email: form.email.trim().toLowerCase(),
            password: form.password,
          };

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string; user?: { name?: string } };

      if (!response.ok) {
        setError(data.error || "Unable to complete the request.");
        return;
      }

      setSuccess(
        mode === "login"
          ? `Welcome back${data.user?.name ? `, ${data.user.name}` : ""}.`
          : `Account created${data.user?.name ? ` for ${data.user.name}` : ""}.`,
      );

      router.refresh();
      router.push(redirectTo);
    } catch {
      setError("Network error. Check that MongoDB and the app are running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="theme-shell relative overflow-hidden grid-bg">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 h-80 w-[38rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="glass-panel relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5" />
            <div className="relative">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white shadow-lg shadow-cyan-500/20">
                  T
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.35em] text-cyan-400">TWIN AI</div>
                  <div className="text-sm text-slate-500">Digital twin intelligence for India</div>
                </div>
              </Link>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-xs text-cyan-300">
                <Database className="h-3.5 w-3.5" />
                MongoDB-backed authentication
              </div>

              <div className="mt-6 max-w-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{copy.eyebrow}</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-[color:var(--app-fg)] sm:text-4xl">
                  {copy.title}
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-6 text-[color:var(--app-muted)]">
                  {copy.subtitle}
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {copy.bulletPoints.map(item => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 shadow-[0_8px_32px_rgba(2,6,23,0.25)]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-lg">
                      {item.icon}
                    </div>
                    <h2 className="mt-3 text-sm font-semibold text-slate-100">{item.title}</h2>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  bcrypt password hashing
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <Globe2 className="h-3.5 w-3.5 text-cyan-400" />
                  Session-ready for web and mobile
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                  Built for the TWIN AI mission
                </span>
              </div>
            </div>
          </section>

          <section className="glass-panel relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-950/70 to-cyan-950/40" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Secure access</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-100">{copy.cta}</h2>
                </div>
                <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                  {mode === "login" ? "Returning user" : "New account"}
                </div>
              </div>

              <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                {mode === "signup" && (
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">Full name</span>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        value={form.name}
                        onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
                        type="text"
                        autoComplete="name"
                        placeholder="Aarav Sharma"
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/55 py-3.5 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
                        required
                      />
                    </div>
                  </label>
                )}

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Email address</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      value={form.email}
                      onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/55 py-3.5 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Password</span>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      value={form.password}
                      onChange={event => setForm(current => ({ ...current, password: event.target.value }))}
                      type="password"
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      placeholder={mode === "signup" ? "Create a strong password" : "Enter your password"}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/55 py-3.5 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
                      minLength={8}
                      required
                    />
                  </div>
                </label>

                {error && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Processing..." : copy.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  <div>
                    <p className="font-medium text-slate-100">Session security</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Login sets a secure HTTP-only cookie, and user records are saved in MongoDB.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-slate-400">
                {copy.switchLabel}{" "}
                <Link href={copy.switchHref} className="font-medium text-cyan-300 hover:text-cyan-200">
                  {copy.switchText}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
