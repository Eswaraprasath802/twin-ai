"use client";
/**
 * TWIN AI — Scenario Simulation Engine
 * Simulate climate scenarios and predict impacts
 */
import { useState } from "react";
import TopNav from "@/components/TopNav";
import { INDIA_STATES } from "@/lib/india-data";

interface SimResult {
  id: string;
  state: string;
  type: string;
  results: {
    affectedVillages: number;
    affectedPopulation: number;
    cropDamage: number;
    economicLoss: number;
    roadClosures: number;
    hospitalImpact: number;
    recommendations: string[];
  };
  computedAt: string;
}

const SCENARIOS = [
  { type: "rain_increase", label: "🌧 Rainfall Increase", desc: "Simulate increased rainfall and predict flooding, crop damage", paramLabel: "Increase %", paramKey: "rainChange", min: 5, max: 100, default: 20 },
  { type: "temperature_increase", label: "🌡 Temperature Rise", desc: "Simulate temperature increase and predict heatwave impacts", paramLabel: "Increase °C", paramKey: "tempChange", min: 0.5, max: 6, default: 2 },
  { type: "cyclone", label: "🌀 Cyclone Simulation", desc: "Simulate cyclone landfall and predict coastal damage", paramLabel: "Category", paramKey: "cycloneCategory", min: 1, max: 5, default: 3 },
  { type: "flood", label: "🌊 Flood Simulation", desc: "Simulate river flooding and predict affected areas", paramLabel: "Severity", paramKey: "floodLevel", min: 1, max: 5, default: 3 },
  { type: "drought", label: "☀️ Drought Simulation", desc: "Simulate drought conditions and predict crop loss", paramLabel: "Severity", paramKey: "droughtLevel", min: 1, max: 5, default: 3 },
];

export default function SimulationPage() {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [stateId, setStateId] = useState(1);
  const [paramValue, setParamValue] = useState(20);
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedScenario.type,
          stateId,
          [selectedScenario.paramKey]: paramValue,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      // handle error silently
    }
    setLoading(false);
  };

  return (
    <div className="theme-shell grid-bg">
      <TopNav />
      <div className="pt-16 px-4 pb-8 max-w-[1920px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold theme-title">🔬 Scenario Simulation Engine</h1>
          <p className="text-sm theme-subtitle">Simulate climate scenarios and predict impacts using AI models</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            {/* Scenario Selection */}
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold text-slate-300 mb-3">Select Scenario</h2>
              <div className="space-y-2">
                {SCENARIOS.map(s => (
                  <button key={s.type} onClick={() => { setSelectedScenario(s); setParamValue(s.default); }}
                    className={`w-full text-left p-3 rounded-lg text-xs transition-all ${selectedScenario.type === s.type
                      ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                      : "bg-space-800/30 border border-space-700 text-slate-400 hover:text-slate-300"}`}>
                    <div className="font-semibold">{s.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Parameters */}
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold text-slate-300 mb-3">Parameters</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">State</label>
                  <select value={stateId} onChange={e => setStateId(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-md text-xs bg-space-800 border border-space-700 text-slate-300 outline-none">
                    {INDIA_STATES.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {selectedScenario.paramLabel}: <span className="text-cyan-400 font-mono">{paramValue}</span>
                  </label>
                  <input type="range" min={selectedScenario.min} max={selectedScenario.max}
                    step={selectedScenario.max <= 6 ? 0.5 : 5}
                    value={paramValue} onChange={e => setParamValue(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500" />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>{selectedScenario.min}</span>
                    <span>{selectedScenario.max}</span>
                  </div>
                </div>

                <button onClick={runSimulation} disabled={loading}
                  className="w-full btn-cyber py-3 text-sm font-semibold disabled:opacity-50">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                      Computing...
                    </span>
                  ) : "▶ Run Simulation"}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-4 fade-in-up">
                {/* Impact Summary */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-200">Simulation Results</h2>
                      <p className="text-xs text-slate-500">{result.state} • {selectedScenario.label} • Computed at {new Date(result.computedAt).toLocaleTimeString()}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      HIGH IMPACT
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "Affected Villages", value: result.results.affectedVillages.toLocaleString(), icon: "🏘", color: "text-red-400" },
                      { label: "Affected Population", value: `${(result.results.affectedPopulation / 1000000).toFixed(1)}M`, icon: "👥", color: "text-orange-400" },
                      { label: "Crop Damage", value: `${result.results.cropDamage}%`, icon: "🌾", color: "text-yellow-400" },
                      { label: "Economic Loss", value: `₹${result.results.economicLoss.toLocaleString()}Cr`, icon: "💰", color: "text-red-500" },
                      { label: "Road Closures", value: result.results.roadClosures.toString(), icon: "🛣", color: "text-orange-400" },
                      { label: "Hospital Impact", value: result.results.hospitalImpact.toString(), icon: "🏥", color: "text-cyan-400" },
                    ].map((m, i) => (
                      <div key={i} className="p-4 rounded-xl bg-space-800/50 border border-space-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{m.icon}</span>
                          <span className="text-[10px] text-slate-500">{m.label}</span>
                        </div>
                        <div className={`text-2xl font-bold font-mono ${m.color}`}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Impact Bar */}
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Impact Assessment</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Population Impact", pct: Math.min(100, (result.results.affectedPopulation / 10000000) * 100), color: "from-red-500 to-orange-500" },
                      { label: "Agricultural Impact", pct: result.results.cropDamage, color: "from-yellow-500 to-orange-500" },
                      { label: "Infrastructure Impact", pct: Math.min(100, result.results.roadClosures), color: "from-orange-500 to-red-500" },
                      { label: "Healthcare Impact", pct: Math.min(100, result.results.hospitalImpact * 3), color: "from-cyan-500 to-blue-500" },
                    ].map((bar, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">{bar.label}</span>
                          <span className="text-slate-500 font-mono">{Math.round(bar.pct)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-space-800 overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${bar.color} transition-all duration-1000`}
                            style={{ width: `${bar.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🤖</span>
                    <h3 className="text-sm font-semibold text-green-400">AI Recommendations</h3>
                  </div>
                  <div className="space-y-2">
                    {result.results.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] text-green-400 font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <span className="text-xs text-slate-300">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-16 text-center">
                <div className="text-6xl mb-4">🔬</div>
                <h2 className="text-lg font-bold text-slate-300 mb-2">Simulation Engine Ready</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Select a scenario, configure parameters, and run the simulation to predict climate impacts on population, agriculture, and infrastructure.
                </p>
                <div className="mt-6 text-xs text-slate-600">
                  Engine: SimEngine v2.4.0 • Models: LSTM + XGBoost + Random Forest
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
