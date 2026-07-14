"use client";
/**
 * TWIN AI — Premium Top Navigation Bar
 * NASA Mission Control style with glassmorphism
 */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel rounded-none border-t-0 border-x-0"
         style={{ borderBottom: "1px solid rgba(0,212,255,0.12)" }}>
      <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/20">
            T
          </div>
          <span className="text-base font-bold tracking-wide hidden sm:block">
            <span className="text-cyan-400">TWIN</span>
            <span className="text-slate-400 ml-1">AI</span>
          </span>
          <span className="hidden lg:flex items-center text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5 ml-1">
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
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                  ${isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
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
            <span className="px-2 py-1 rounded bg-space-800 border border-space-700">
              🛰 14 Satellites
            </span>
            <span className="px-2 py-1 rounded bg-space-800 border border-space-700">
              🤖 23 AI Models
            </span>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-cyan-400 transition-colors"
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
        <div className="md:hidden border-t border-space-700 bg-space-900/95 backdrop-blur-xl">
          <div className="p-3 grid grid-cols-3 gap-2">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-2 py-3 rounded-lg text-center text-xs font-medium transition-all
                    ${isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-slate-400 hover:text-slate-200 bg-space-800/50"
                    }`}
                >
                  <div className="text-lg mb-1">{item.icon}</div>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
