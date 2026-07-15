"use client";
/**
 * TWIN AI — Premium Top Navigation Bar
 * NASA Mission Control style with glassmorphism
 */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "◆" },
  { label: "Climate", href: "/climate", icon: "🌡" },
  { label: "Agriculture", href: "/agriculture", icon: "🌾" },
  { label: "Disaster", href: "/disaster", icon: "⚡" },
  { label: "Government", href: "/government", icon: "🏛" },
  { label: "Analytics", href: "/analytics", icon: "📊" },
  { label: "Twin AI", href: "/twin-ai", icon: "🤖" },
  { label: "Simulation", href: "/simulation", icon: "🔬" },
  { label: "Citizen", href: "/citizen", icon: "👤" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel rounded-none border-t-0 border-x-0"
         style={{ borderBottom: "1px solid var(--app-nav-border)" }}>
      <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/20">
            T
          </div>
          <span className="text-base font-bold tracking-wide hidden sm:block">
            <span className="text-cyan-400">TWIN</span>
            <span className="theme-title ml-1">AI</span>
          </span>
          <span className="hidden lg:flex items-center text-[10px] theme-nav-chip rounded px-1.5 py-0.5 ml-1">
            LIVE
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-1 animate-pulse" />
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`theme-nav-link px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                  ${isActive
                    ? "theme-nav-link-active bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "border border-transparent"
                  }`}
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500">
            <span className="px-2 py-1 rounded theme-nav-chip">
              🛰 14 Satellites
            </span>
            <span className="px-2 py-1 rounded theme-nav-chip">
              🤖 23 AI Models
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/login"
              className="theme-nav-toggle inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-all hover:border-cyan-400/40"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-md border border-cyan-500/25 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-all hover:bg-cyan-500/15"
            >
              Sign Up
            </Link>
          </div>

          <button
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onClick={toggleTheme}
            className="theme-nav-toggle inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all"
          >
            {theme === "dark" ? <SunMedium className="h-3.5 w-3.5" /> : <MoonStar className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
          </button>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md theme-nav-toggle transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen
                ? <path d="M6 6l12 12M6 18L18 6" />
                : <path d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden theme-nav-menu">
          <div className="p-3 grid grid-cols-3 gap-2">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`theme-nav-link px-2 py-3 rounded-lg text-center text-xs font-medium transition-all
                    ${isActive
                      ? "theme-nav-link-active bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "border border-transparent"
                    }`}
                >
                  <div className="text-lg mb-1">{item.icon}</div>
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="theme-nav-toggle inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition-all"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
