"use client";
/**
 * TWIN AI — Citizen Portal
 * Public-facing weather, alerts, shelters, safe routes, hospitals
 */
import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import { INDIA_STATES } from "@/lib/india-data";

interface Alert {
  id: number; type: string; severity: string; title: string;
  description: string; state: string; recommendations: string[];
}

export default function CitizenPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedState, setSelectedState] = useState(1);

  useEffect(() => {
    let ignore = false;

    const loadAlerts = async () => {
      try {
        const res = await fetch("/api/alerts");
        const json = await res.json();
        if (!ignore) {
          setAlerts(json.alerts || []);
        }
      } catch {
        if (!ignore) {
          setAlerts([]);
        }
      }
    };

    void loadAlerts();
    return () => {
      ignore = true;
    };
  }, []);

  const state = INDIA_STATES.find(s => s.id === selectedState);

  return (
    <div className="theme-shell grid-bg">
      <TopNav />
      <div className="pt-16 px-4 pb-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold theme-title mb-2">👤 Citizen Portal</h1>
          <p className="text-sm theme-subtitle">Your personal climate safety & information hub</p>
          <div className="mt-3">
            <select value={selectedState} onChange={e => setSelectedState(parseInt(e.target.value))}
              className="px-4 py-2 rounded-lg text-sm bg-space-800 border border-space-700 text-slate-300 outline-none">
              {INDIA_STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Current Weather */}
        <div className="glass-card p-6 mb-4 text-center">
          <div className="text-5xl mb-2">⛅</div>
          <div className="text-4xl font-bold text-orange-400 font-mono">32°C</div>
          <div className="text-sm text-slate-400 mt-1">Partly Cloudy • {state?.capital}</div>
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { icon: "💧", label: "Humidity", value: "67%" },
              { icon: "💨", label: "Wind", value: "12 km/h" },
              { icon: "🌧", label: "Rain", value: "20% chance" },
              { icon: "🌫", label: "AQI", value: "142" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <span className="text-lg">{item.icon}</span>
                <div className="text-xs text-slate-300 font-mono">{item.value}</div>
                <div className="text-[9px] text-slate-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        {alerts.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Active Alerts in Your Area
            </h2>
            <div className="space-y-2">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className={`glass-card p-4 border-l-4 ${alert.severity === "critical" ? "border-l-red-500" : "border-l-orange-500"}`}>
                  <div className="text-sm font-semibold text-slate-200">{alert.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{alert.description}</div>
                  <div className="text-[10px] text-slate-500 mt-2">📍 {alert.state}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {[
            { icon: "🏥", label: "Nearby Hospitals", desc: "Find emergency medical facilities", items: ["District Hospital - 2.3 km", "PHC Center - 1.1 km", "AIIMS - 8.5 km"] },
            { icon: "🏠", label: "Emergency Shelters", desc: "Nearest evacuation centers", items: ["Govt. School, Block A - 1.5 km", "Community Hall - 2.1 km", "Stadium Shelter - 3.8 km"] },
            { icon: "🛣", label: "Safe Routes", desc: "AI-recommended safe travel routes", items: ["NH-44 via bypass - Clear", "State Highway 12 - Open", "District Road 7 - Avoid (waterlogged)"] },
            { icon: "💧", label: "Water Sources", desc: "Clean water availability", items: ["Municipal Supply - Normal", "Tanker Point A - Active", "Borewell #12 - Operational"] },
            { icon: "📢", label: "Announcements", desc: "Government advisories", items: ["Schools closed due to heavy rain", "Free ration distribution at Block Office", "Vaccination drive at PHC"] },
            { icon: "📞", label: "Emergency Numbers", desc: "Quick dial helplines", items: ["Police: 100", "Ambulance: 108", "Disaster: 1078", "Women: 1091"] },
          ].map((service, i) => (
            <div key={i} className="glass-card p-4">
              <div className="text-2xl mb-2">{service.icon}</div>
              <div className="text-sm font-semibold text-slate-200 mb-1">{service.label}</div>
              <div className="text-[10px] text-slate-500 mb-3">{service.desc}</div>
              <div className="space-y-1">
                {service.items.map((item, j) => (
                  <div key={j} className="text-[10px] text-slate-400 p-1.5 rounded bg-space-800/50">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Safety Tip */}
        <div className="glass-card p-5 border-l-2 border-l-cyan-500">
          <div className="flex items-center gap-2 mb-2">
            <span>🤖</span>
            <span className="text-xs font-semibold text-cyan-400">AI SAFETY TIP</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Based on current weather patterns, we recommend carrying an umbrella today. The temperature is expected
            to rise to 36°C by afternoon — stay hydrated and avoid prolonged outdoor exposure between 12 PM and 4 PM.
            Air quality is in the &quot;Poor&quot; category — consider wearing a mask outdoors.
          </p>
        </div>
      </div>
    </div>
  );
}
