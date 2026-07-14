"use client";
/**
 * TWIN AI — Main Dashboard
 * NASA Mission Control style dashboard with live data
 */
import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import { createSeries } from "@/lib/deterministic";

interface DashboardData {
  national: {
    avgTemperature: number;
    avgHumidity: number;
    avgAqi: number;
    totalRainfall: number;
    totalStates: number;
    totalDistricts: number;
    monitoringStations: number;
    satellitesActive: number;
    aiModelsRunning: number;
    predictionsToday: number;
    alertsActive: number;
  };
  recentAlerts: Array<{
    id: number;
    type: string;
    severity: string;
    title: string;
    state: string;
    createdAt: string;
  }>;
}

function MetricCard({ label, value, unit, icon, color, trend }: {
  label: string; value: string | number; unit?: string; icon: string; color: string; trend?: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
    green: "from-green-500/20 to-green-500/5 border-green-500/20 text-green-400",
    orange: "from-orange-500/20 to-orange-500/5 border-orange-500/20 text-orange-400",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
    red: "from-red-500/20 to-red-500/5 border-red-500/20 text-red-400",
    yellow: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 text-yellow-400",
  };

  return (
    <div className={`metric-card glass-card p-4 bg-gradient-to-br ${colorMap[color] || colorMap.cyan}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-xs px-1.5 py-0.5 rounded ${trend === "up" ? "bg-green-500/20 text-green-400" : trend === "down" ? "bg-red-500/20 text-red-400" : "bg-slate-500/20 text-slate-400"}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-mono">
        {value}<span className="text-sm text-slate-500 ml-1">{unit}</span>
      </div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <svg viewBox="0 0 120 40" className="w-full h-10">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,40 ${data.map((v, i) => `L${(i / (data.length - 1)) * 120},${40 - ((v - min) / range) * 35}`).join(" ")} L120,40 Z`}
        fill={`url(#grad-${color})`}
      />
      <polyline
        points={data.map((v, i) => `${(i / (data.length - 1)) * 120},${40 - ((v - min) / range) * 35}`).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}

function AlertBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${styles[severity] || styles.low}`}>
      {severity.toUpperCase()}
    </span>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (active) {
          setData(json);
        }
      } catch {
        // retry silently
      }
    };

    void loadDashboard();
    const interval = setInterval(() => {
      void loadDashboard();
    }, 30000);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      active = false;
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  const tempData = createSeries(24, 1.1, 25, 40, 1);
  const rainData = createSeries(24, 2.2, 0, 80, 1);
  const aqiData = createSeries(24, 3.3, 50, 300, 0);
  const humidData = createSeries(24, 4.4, 40, 90, 0);

  return (
    <div className="theme-shell grid-bg">
      <TopNav />

      <div className="pt-16 px-4 pb-8 max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold theme-title">Mission Control</h1>
            <p className="text-sm theme-subtitle">National Climate Intelligence Dashboard</p>
          </div>
          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <div className="text-xs theme-subtitle font-mono">
              {time.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
            <div className="text-sm text-cyan-400 font-mono font-bold">
              {time.toLocaleTimeString("en-IN")}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400">LIVE</span>
            </div>
          </div>
        </div>

        {/* System Status Bar */}
        <div className="glass-card p-3 mb-6 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-slate-400">System: <span className="text-green-400">Operational</span></span>
          </div>
          <div className="text-slate-600">|</div>
          <div className="text-slate-400">🛰 Satellites: <span className="text-cyan-400 font-mono">{data?.national.satellitesActive || 14}</span></div>
          <div className="text-slate-600">|</div>
          <div className="text-slate-400">🤖 AI Models: <span className="text-purple-400 font-mono">{data?.national.aiModelsRunning || 23}</span></div>
          <div className="text-slate-600">|</div>
          <div className="text-slate-400">📡 Stations: <span className="text-cyan-400 font-mono">{(data?.national.monitoringStations || 4562).toLocaleString()}</span></div>
          <div className="text-slate-600">|</div>
          <div className="text-slate-400">📊 Predictions Today: <span className="text-green-400 font-mono">{(data?.national.predictionsToday || 12847).toLocaleString()}</span></div>
          <div className="text-slate-600">|</div>
          <div className="text-slate-400">⚠️ Active Alerts: <span className="text-red-400 font-mono">{data?.national.alertsActive || 4}</span></div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <MetricCard icon="🌡" label="National Avg Temperature" value={data?.national.avgTemperature || 32.4} unit="°C" color="orange" trend="up" />
          <MetricCard icon="💧" label="Average Humidity" value={data?.national.avgHumidity || 67} unit="%" color="cyan" trend="stable" />
          <MetricCard icon="🌧" label="Total Rainfall" value={data?.national.totalRainfall || 245.6} unit="mm" color="blue" trend="up" />
          <MetricCard icon="🌫" label="Average AQI" value={data?.national.avgAqi || 156} unit="AQI" color="yellow" trend="down" />
          <MetricCard icon="🗺" label="States Monitored" value={28} color="green" />
          <MetricCard icon="📍" label="Districts Covered" value={766} color="purple" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-slate-400">Temperature (24h)</div>
              <div className="text-xs text-orange-400 font-mono">32.4°C</div>
            </div>
            <MiniChart data={tempData} color="#ff8800" />
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-slate-400">Rainfall (24h)</div>
              <div className="text-xs text-cyan-400 font-mono">18.2mm</div>
            </div>
            <MiniChart data={rainData} color="#00d4ff" />
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-slate-400">Air Quality (24h)</div>
              <div className="text-xs text-yellow-400 font-mono">156 AQI</div>
            </div>
            <MiniChart data={aqiData} color="#ffd700" />
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-slate-400">Humidity (24h)</div>
              <div className="text-xs text-green-400 font-mono">67%</div>
            </div>
            <MiniChart data={humidData} color="#00ff88" />
          </div>
        </div>

        {/* Bottom Grid: Alerts + Map + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Active Alerts */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300">⚠️ Active Alerts</h2>
              <span className="text-xs text-red-400 font-mono animate-pulse">{data?.recentAlerts?.length || 0} ACTIVE</span>
            </div>
            <div className="space-y-3">
              {(data?.recentAlerts || []).map((alert, i) => (
                <div key={i} className="p-3 rounded-lg bg-space-800/50 border border-space-700 hover:border-red-500/20 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-300">{alert.title}</span>
                    <AlertBadge severity={alert.severity} />
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2">
                    <span>📍 {alert.state}</span>
                    <span>•</span>
                    <span>{new Date(alert.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* India Map Placeholder with SVG */}
          <div className="glass-card p-5 relative overflow-hidden">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">🗺 National Overview</h2>
            <div className="aspect-square flex items-center justify-center relative">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* India outline simplified */}
                <ellipse cx="200" cy="180" rx="120" ry="150" fill="none" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />
                {/* State dots */}
                {[
                  { x: 200, y: 60, label: "J&K", c: "#00d4ff" },
                  { x: 170, y: 100, label: "PB", c: "#00ff88" },
                  { x: 210, y: 100, label: "UP", c: "#ff8800" },
                  { x: 250, y: 120, label: "BR", c: "#8b5cf6" },
                  { x: 140, y: 140, label: "RJ", c: "#ffd700" },
                  { x: 130, y: 180, label: "GJ", c: "#00d4ff" },
                  { x: 200, y: 160, label: "MP", c: "#00ff88" },
                  { x: 280, y: 140, label: "AS", c: "#ff006e" },
                  { x: 270, y: 170, label: "WB", c: "#ff8800" },
                  { x: 160, y: 210, label: "MH", c: "#8b5cf6" },
                  { x: 230, y: 200, label: "OD", c: "#00d4ff" },
                  { x: 210, y: 240, label: "TS", c: "#ffd700" },
                  { x: 180, y: 260, label: "KA", c: "#00ff88" },
                  { x: 210, y: 280, label: "AP", c: "#ff8800" },
                  { x: 240, y: 260, label: "TN", c: "#8b5cf6" },
                  { x: 170, y: 300, label: "KL", c: "#00d4ff" },
                ].map((s, i) => (
                  <g key={i}>
                    <circle cx={s.x} cy={s.y} r="6" fill={s.c} opacity="0.3" />
                    <circle cx={s.x} cy={s.y} r="3" fill={s.c} />
                    <text x={s.x + 10} y={s.y + 4} fill="#64748b" fontSize="9" fontFamily="monospace">{s.label}</text>
                  </g>
                ))}
              </svg>
              {/* Scan effect */}
              <div className="absolute inset-0 scan-effect" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold text-slate-300 mb-4">🚀 Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: "🌡", label: "Climate Monitor", href: "/climate" },
                  { icon: "🌾", label: "Crop Advisory", href: "/agriculture" },
                  { icon: "⚡", label: "Disaster Alert", href: "/disaster" },
                  { icon: "🔬", label: "Run Simulation", href: "/simulation" },
                  { icon: "🤖", label: "Ask Twin AI", href: "/twin-ai" },
                  { icon: "📊", label: "Analytics", href: "/analytics" },
                ].map((a, i) => (
                  <a key={i} href={a.href} className="p-3 rounded-lg bg-space-800/50 border border-space-700 hover:border-cyan-500/30 transition-all text-center group">
                    <div className="text-xl mb-1 group-hover:scale-110 transition-transform">{a.icon}</div>
                    <div className="text-[10px] text-slate-400 group-hover:text-cyan-400 transition-colors">{a.label}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* AI Insight */}
            <div className="glass-card p-5 border-l-2 border-l-cyan-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                <span className="text-xs font-semibold text-cyan-400">AI INSIGHT</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Western Disturbance approaching North India. Expected 40-60mm rainfall in Punjab,
                Haryana, and UP over next 72 hours. Recommend pre-positioning NDRF teams and
                issuing early warnings for low-lying areas. Crop harvest advisory issued for wheat
                belt regions.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] text-slate-600">Model: TWIN-AI v3.2</span>
                <span className="text-[10px] text-slate-600">•</span>
                <span className="text-[10px] text-green-500">Confidence: 87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
