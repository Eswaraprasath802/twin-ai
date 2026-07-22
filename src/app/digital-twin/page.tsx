"use client";

import { useState } from "react";
import TopNav from "@/components/TopNav";
import IndiaGlobe from "@/components/IndiaGlobe";

const LAYER_DETAILS = [
  { id: "terrain", icon: "⛰", label: "Terrain", description: "Elevation and relief contours", color: "text-emerald-300" },
  { id: "buildings", icon: "🏙", label: "Buildings", description: "Live city activity beacons", color: "text-cyan-300" },
  { id: "weather", icon: "🌦", label: "Weather", description: "Animated rainfall and heat cells", color: "text-blue-300" },
] as const;

export default function DigitalTwinPage() {
  const [layers, setLayers] = useState({ terrain: true, buildings: true, weather: true });

  return (
    <div className="theme-shell grid-bg min-h-screen">
      <TopNav />

      <main className="pt-20 px-4 pb-10 max-w-6xl mx-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-500/5 text-[11px] text-cyan-300 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE DIGITAL TWIN
            </div>
            <h1 className="text-3xl font-bold theme-title">3D India Digital Twin</h1>
            <p className="theme-subtitle text-sm mt-1">A rotating India-centered globe with terrain, city buildings, and weather visualization.</p>
          </div>
          <div className="glass-card px-4 py-3 text-xs text-slate-400 flex items-center gap-4">
            <span>🛰 14 satellite feeds</span>
            <span className="text-cyan-300">● Synced now</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)] gap-5">
          <section className="glass-card relative overflow-hidden min-h-[520px] flex items-center justify-center p-3 md:p-6">
            <div className="absolute top-4 left-4 text-[10px] text-slate-400 font-mono tracking-wider">ORBITAL VIEW / INDIA CENTERED</div>
            <IndiaGlobe className="digital-twin-globe" layers={layers} />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 text-[10px]">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-cyan-200">Cyan · precipitation</span>
              <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-2.5 py-1 text-orange-200">Amber · heat intensity</span>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-200">Green · terrain</span>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-200">Visualization layers</h2>
                <span className="text-[10px] text-emerald-300">{Object.values(layers).filter(Boolean).length}/3 active</span>
              </div>
              <div className="space-y-2">
                {LAYER_DETAILS.map(layer => {
                  const enabled = layers[layer.id];
                  return (
                    <button
                      key={layer.id}
                      type="button"
                      aria-pressed={enabled}
                      onClick={() => setLayers(current => ({ ...current, [layer.id]: !current[layer.id] }))}
                      className={`w-full text-left rounded-lg border p-3 transition-all ${enabled ? "border-cyan-400/25 bg-cyan-500/10" : "border-slate-700/70 bg-slate-900/20 opacity-65"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{layer.icon}</span>
                        <span className="flex-1">
                          <span className={`block text-xs font-semibold ${layer.color}`}>{layer.label}</span>
                          <span className="block text-[10px] text-slate-500 mt-0.5">{layer.description}</span>
                        </span>
                        <span className={`relative h-5 w-9 rounded-full transition-colors ${enabled ? "bg-cyan-500" : "bg-slate-700"}`}>
                          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${enabled ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="glass-card p-5">
              <h2 className="text-sm font-semibold text-slate-200 mb-4">Live observations</h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-3"><span className="text-slate-500">Monitored cities</span><span className="text-cyan-300 font-mono">12 active</span></div>
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-3"><span className="text-slate-500">Weather cells</span><span className="text-blue-300 font-mono">5 tracking</span></div>
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-3"><span className="text-slate-500">Terrain model</span><span className="text-emerald-300 font-mono">30 m mesh</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500">Render status</span><span className="text-emerald-300 font-mono">● online</span></div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
