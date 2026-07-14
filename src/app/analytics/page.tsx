"use client";
/**
 * TWIN AI — Analytics Dashboard
 * Comprehensive data analytics with charts and AI insights
 */
import { useState } from "react";
import TopNav from "@/components/TopNav";
import { INDIA_STATES } from "@/lib/india-data";
import { createSeries } from "@/lib/deterministic";

function BarChart({ data, labels, color, height = 120 }: { data: number[]; labels: string[]; color: string; height?: number }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="text-[8px] text-slate-500 font-mono">{v}</div>
          <div className="w-full rounded-t" style={{
            height: `${(v / max) * (height - 30)}px`,
            background: `linear-gradient(to top, ${color}33, ${color}88)`,
            border: `1px solid ${color}44`,
          }} />
          <div className="text-[8px] text-slate-600 truncate w-full text-center">{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ value, maxVal, color, label, size = 100 }: { value: number; maxVal: number; color: string; label: string; size?: number }) {
  const pct = (value / maxVal) * 100;
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000" />
      </svg>
      <div className="text-center -mt-16">
        <div className="text-lg font-bold font-mono" style={{ color }}>{Math.round(pct)}%</div>
      </div>
      <div className="text-[10px] text-slate-500 mt-4">{label}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30d");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const periodSeed = period === "7d" ? 1 : period === "30d" ? 2 : period === "90d" ? 3 : period === "1y" ? 4 : 5;
  const tempData = createSeries(months.length, periodSeed + 0.1, 22, 40, 0);
  const rainData = createSeries(months.length, periodSeed + 0.7, 0, 300, 0);
  const aqiData = createSeries(months.length, periodSeed + 1.3, 50, 300, 0);
  const resilienceScores = createSeries(8, periodSeed + 2.1, 80, 96, 0);

  return (
    <div className="min-h-screen bg-space-950 grid-bg">
      <TopNav />
      <div className="pt-16 px-4 pb-8 max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-200">📊 Analytics Center</h1>
            <p className="text-sm text-slate-500">Comprehensive climate and agricultural data analytics</p>
          </div>
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            {["7d", "30d", "90d", "1y", "5y"].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs transition-all ${period === p ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : "text-slate-500 bg-space-800/50 border border-space-700"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Data Points Analyzed", value: "2.4M", icon: "📈", color: "text-cyan-400" },
            { label: "AI Models Active", value: "23", icon: "🤖", color: "text-purple-400" },
            { label: "Prediction Accuracy", value: "89.2%", icon: "🎯", color: "text-green-400" },
            { label: "Reports Generated", value: "1,247", icon: "📄", color: "text-orange-400" },
          ].map((c, i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>{c.icon}</span>
                <span className="text-[10px] text-slate-500">{c.label}</span>
              </div>
              <div className={`text-2xl font-bold font-mono ${c.color}`}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">🌡 Monthly Temperature</h3>
            <BarChart data={tempData} labels={months} color="#ff8800" />
          </div>
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">🌧 Monthly Rainfall (mm)</h3>
            <BarChart data={rainData} labels={months} color="#00d4ff" />
          </div>
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">🌫 Monthly AQI</h3>
            <BarChart data={aqiData} labels={months} color="#ffd700" />
          </div>
        </div>

        {/* Donut Charts + State Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">National Indicators</h3>
            <div className="grid grid-cols-4 gap-4">
              <DonutChart value={78} maxVal={100} color="#00d4ff" label="Water Level" size={80} />
              <DonutChart value={67} maxVal={100} color="#00ff88" label="Crop Health" size={80} />
              <DonutChart value={45} maxVal={100} color="#ff8800" label="Forest Cover" size={80} />
              <DonutChart value={82} maxVal={100} color="#8b5cf6" label="Soil Health" size={80} />
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Top States by Climate Resilience</h3>
            <div className="space-y-2">
              {INDIA_STATES.slice(0, 8).map((state, i) => {
                const score = resilienceScores[i];
                return (
                  <div key={state.id} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-4 font-mono">#{i + 1}</span>
                    <span className="text-xs text-slate-300 w-28 truncate">{state.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-space-800 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-green-500"
                        style={{ width: `${score}%` }} />
                    </div>
                    <span className="text-xs text-cyan-400 font-mono w-10">{score}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
