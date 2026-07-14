"use client";
/**
 * TWIN AI — Climate Monitoring Page
 * State-wise real-time climate data with visualizations
 */
import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import { INDIA_STATES } from "@/lib/india-data";

interface ClimateEntry {
  state: { id: number; name: string; code: string; lat: number; lng: number };
  climate: {
    temperature: number; humidity: number; rainfall: number; windSpeed: number;
    windDirection: string; pressure: number; aqi: number; uvIndex: number;
    visibility: number; cloudCover: number; condition: string;
  };
}

function aqiLabel(aqi: number) {
  if (aqi <= 50) return { label: "Good", color: "text-green-400 bg-green-500/10" };
  if (aqi <= 100) return { label: "Moderate", color: "text-yellow-400 bg-yellow-500/10" };
  if (aqi <= 200) return { label: "Poor", color: "text-orange-400 bg-orange-500/10" };
  if (aqi <= 300) return { label: "Very Poor", color: "text-red-400 bg-red-500/10" };
  return { label: "Severe", color: "text-red-500 bg-red-500/20" };
}

function conditionIcon(c: string) {
  const map: Record<string, string> = {
    Sunny: "☀️", "Partly Cloudy": "⛅", Cloudy: "☁️", Overcast: "🌥",
    "Light Rain": "🌦", "Heavy Rain": "🌧", Thunderstorm: "⛈", Haze: "🌫",
    Fog: "🌁", Clear: "🌙",
  };
  return map[c] || "🌤";
}

export default function ClimatePage() {
  const [data, setData] = useState<ClimateEntry[]>([]);
  const [selectedState, setSelectedState] = useState<ClimateEntry | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const res = await fetch("/api/climate");
        const json = await res.json();
        if (!ignore) {
          setData(json.data || []);
        }
      } catch {
        if (!ignore) {
          setData([]);
        }
      }
    };

    void loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const regions = ["all", "North", "South", "East", "West", "Central", "Northeast"];
  const filteredData = filter === "all"
    ? data
    : data.filter(d => {
      const s = INDIA_STATES.find(st => st.id === d.state.id);
      return s?.regionType === filter;
    });

  return (
    <div className="theme-shell grid-bg">
      <TopNav />
      <div className="pt-16 px-4 pb-8 max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold theme-title">🌡 Climate Monitor</h1>
            <p className="text-sm theme-subtitle">Real-time climate data across all Indian states</p>
          </div>
          <div className="flex items-center gap-2 mt-3 md:mt-0 flex-wrap">
            {regions.map(r => (
              <button key={r} onClick={() => setFilter(r)}
                className={`px-3 py-1.5 rounded-md text-xs transition-all ${filter === r ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : "text-slate-500 hover:text-slate-300 bg-space-800/50 border border-space-700"}`}>
                {r === "all" ? "All India" : r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* State List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredData.map((entry, i) => (
                <button key={i} onClick={() => setSelectedState(entry)}
                  className={`glass-card p-4 text-left transition-all ${selectedState?.state.id === entry.state.id ? "border-cyan-500/40 glow-blue" : ""}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{entry.state.name}</div>
                      <div className="text-[10px] text-slate-500">{entry.state.code}</div>
                    </div>
                    <div className="text-2xl">{conditionIcon(entry.climate.condition)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-orange-400 font-mono">{entry.climate.temperature}°</div>
                      <div className="text-[9px] text-slate-600">TEMP</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-cyan-400 font-mono">{entry.climate.humidity}%</div>
                      <div className="text-[9px] text-slate-600">HUMID</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-400 font-mono">{entry.climate.rainfall}</div>
                      <div className="text-[9px] text-slate-600">RAIN mm</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${aqiLabel(entry.climate.aqi).color}`}>
                      AQI {entry.climate.aqi} • {aqiLabel(entry.climate.aqi).label}
                    </span>
                    <span className="text-[10px] text-slate-600">{entry.climate.condition}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="space-y-4">
            {selectedState ? (
              <>
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-200">{selectedState.state.name}</h2>
                      <p className="text-xs text-slate-500">{selectedState.climate.condition}</p>
                    </div>
                    <span className="text-4xl">{conditionIcon(selectedState.climate.condition)}</span>
                  </div>

                  <div className="text-5xl font-bold text-orange-400 font-mono mb-4">
                    {selectedState.climate.temperature}<span className="text-xl">°C</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: "💧", label: "Humidity", value: `${selectedState.climate.humidity}%`, color: "text-cyan-400" },
                      { icon: "🌧", label: "Rainfall", value: `${selectedState.climate.rainfall} mm`, color: "text-blue-400" },
                      { icon: "💨", label: "Wind", value: `${selectedState.climate.windSpeed} km/h ${selectedState.climate.windDirection}`, color: "text-green-400" },
                      { icon: "📊", label: "Pressure", value: `${selectedState.climate.pressure} hPa`, color: "text-purple-400" },
                      { icon: "🌫", label: "AQI", value: `${selectedState.climate.aqi}`, color: "text-yellow-400" },
                      { icon: "☀️", label: "UV Index", value: `${selectedState.climate.uvIndex}`, color: "text-orange-400" },
                      { icon: "👁", label: "Visibility", value: `${selectedState.climate.visibility} km`, color: "text-slate-300" },
                      { icon: "☁️", label: "Cloud Cover", value: `${selectedState.climate.cloudCover}%`, color: "text-slate-400" },
                    ].map((item, i) => (
                      <div key={i} className="p-2 rounded-lg bg-space-800/50">
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <span>{item.icon}</span>{item.label}
                        </div>
                        <div className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5 border-l-2 border-l-cyan-500">
                  <div className="flex items-center gap-2 mb-2">
                    <span>🤖</span>
                    <span className="text-xs font-semibold text-cyan-400">AI ANALYSIS</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedState.climate.temperature > 38
                      ? `⚠️ Heatwave conditions detected in ${selectedState.state.name}. Temperature ${selectedState.climate.temperature}°C is significantly above normal. Advisory: Avoid outdoor work 12PM-4PM, increase water intake, and check on vulnerable populations.`
                      : selectedState.climate.rainfall > 30
                        ? `🌧 Above-normal rainfall recorded in ${selectedState.state.name}. ${selectedState.climate.rainfall}mm rainfall may cause waterlogging in low-lying areas. Agriculture advisory: Ensure proper drainage in crop fields.`
                        : `Current conditions in ${selectedState.state.name} are within normal parameters. Temperature ${selectedState.climate.temperature}°C with ${selectedState.climate.humidity}% humidity. No immediate advisories required.`
                    }
                  </p>
                </div>
              </>
            ) : (
              <div className="glass-card p-8 text-center">
                <div className="text-4xl mb-4">🌡</div>
                <p className="text-sm text-slate-400">Select a state to view detailed climate data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
