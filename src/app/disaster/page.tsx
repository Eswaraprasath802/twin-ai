"use client";
/**
 * TWIN AI — Disaster Management Center
 * Real-time alerts, risk monitoring, AI predictions
 */
import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";

interface Alert {
  id: number; type: string; severity: string; title: string;
  description: string; state: string; recommendations: string[];
  affectedPopulation: number; isActive: boolean; createdAt: string;
}

function typeIcon(type: string) {
  const map: Record<string, string> = {
    cyclone: "🌀", flood: "🌊", drought: "☀️", heatwave: "🔥",
    heavy_rain: "🌧", forest_fire: "🔥", earthquake: "📳", thunderstorm: "⛈",
  };
  return map[type] || "⚠️";
}

function severityStyle(sev: string) {
  const map: Record<string, string> = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/10",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30 shadow-orange-500/10",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return map[sev] || "";
}

export default function DisasterPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let ignore = false;

    const loadAlerts = async () => {
      try {
        const res = await fetch("/api/alerts");
        const json = await res.json();
        if (ignore) return;

        const nextAlerts = json.alerts || [];
        setAlerts(nextAlerts);
        setSelectedAlert(current => current ?? nextAlerts[0] ?? null);
      } catch {
        if (!ignore) {
          setAlerts([]);
          setSelectedAlert(null);
        }
      }
    };

    void loadAlerts();
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = filter === "all" ? alerts : alerts.filter(a => a.severity === filter);

  return (
    <div className="theme-shell grid-bg">
      <TopNav />
      <div className="pt-16 px-4 pb-8 max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold theme-title">⚡ Disaster Management Center</h1>
            <p className="text-sm theme-subtitle">Real-time disaster monitoring, alerts & AI recommendations</p>
          </div>
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            {["all", "critical", "high", "medium", "low"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs transition-all capitalize ${filter === f ? "bg-red-500/15 text-red-400 border border-red-500/30" : "text-slate-500 bg-space-800/50 border border-space-700"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Active Alerts", value: alerts.length, icon: "⚠️", color: "text-red-400" },
            { label: "Critical", value: alerts.filter(a => a.severity === "critical").length, icon: "🔴", color: "text-red-500" },
            { label: "High", value: alerts.filter(a => a.severity === "high").length, icon: "🟠", color: "text-orange-400" },
            { label: "States Affected", value: new Set(alerts.map(a => a.state)).size, icon: "🗺", color: "text-cyan-400" },
            { label: "Population at Risk", value: `${Math.round(alerts.reduce((s, a) => s + a.affectedPopulation, 0) / 1000000)}M`, icon: "👥", color: "text-yellow-400" },
          ].map((s, i) => (
            <div key={i} className="glass-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <span>{s.icon}</span>
                <span className="text-[10px] text-slate-500">{s.label}</span>
              </div>
              <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Alert List */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-300 mb-2">Active Alerts</h2>
            {filtered.map(alert => (
              <button key={alert.id} onClick={() => setSelectedAlert(alert)}
                className={`w-full text-left glass-card p-4 transition-all ${selectedAlert?.id === alert.id ? "border-red-500/40 glow-blue" : ""}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{typeIcon(alert.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-200 truncate">{alert.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full border shrink-0 ${severityStyle(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">📍 {alert.state}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      👥 {(alert.affectedPopulation / 1000000).toFixed(1)}M affected
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selectedAlert ? (
              <div className="space-y-4">
                <div className={`glass-card p-6 border-l-4 ${selectedAlert.severity === "critical" ? "border-l-red-500" : "border-l-orange-500"}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{typeIcon(selectedAlert.type)}</span>
                      <div>
                        <h2 className="text-lg font-bold text-slate-200">{selectedAlert.title}</h2>
                        <p className="text-xs text-slate-500">📍 {selectedAlert.state} • {new Date(selectedAlert.createdAt).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${severityStyle(selectedAlert.severity)}`}>
                      {selectedAlert.severity.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">{selectedAlert.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-space-800/50">
                      <div className="text-xs text-slate-500">Affected Population</div>
                      <div className="text-xl font-bold text-red-400 font-mono">
                        {(selectedAlert.affectedPopulation / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-space-800/50">
                      <div className="text-xs text-slate-500">Alert Status</div>
                      <div className="text-xl font-bold text-orange-400">ACTIVE</div>
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🤖</span>
                    <h3 className="text-sm font-semibold text-green-400">AI Smart Recommendations</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedAlert.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-space-800/30 border border-green-500/10">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs text-green-400 font-bold shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-xs text-slate-300 leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">📞 Emergency Contacts</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {[
                      { label: "NDRF", number: "011-26701700" },
                      { label: "Disaster Helpline", number: "1078" },
                      { label: "Police", number: "100" },
                      { label: "Ambulance", number: "108" },
                    ].map((c, i) => (
                      <div key={i} className="p-2 rounded-lg bg-space-800/50 text-center">
                        <div className="text-slate-500">{c.label}</div>
                        <div className="text-cyan-400 font-mono font-bold">{c.number}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-8 text-center">
                <div className="text-4xl mb-4">⚡</div>
                <p className="text-sm text-slate-400">Select an alert to view details and recommendations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
