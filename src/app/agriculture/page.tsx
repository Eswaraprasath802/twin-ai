"use client";
/**
 * TWIN AI — Smart Agriculture Dashboard
 * Crops, recommendations, government schemes, market intelligence
 */
import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import { INDIA_STATES } from "@/lib/india-data";

interface Crop {
  id: number; name: string; category: string; season: string;
  sowingMonth: string; harvestMonth: string; waterRequirement: string; msp: number; yieldPerHectare: number;
}

interface Scheme {
  id: number; name: string; ministry: string; category: string;
  description: string; eligibility: string; benefits: string;
}

interface Recommendation {
  crop: string; suitability: number; reason: string;
  expectedYield: number; msp: number; season: string;
}

export default function AgriculturePage() {
  const [tab, setTab] = useState<"crops" | "recommend" | "schemes" | "calendar">("crops");
  const [crops, setCrops] = useState<Crop[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedState, setSelectedState] = useState(1);
  const [soilType, setSoilType] = useState("Alluvial");

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const [cropsRes, schemesRes, recommendationsRes] = await Promise.all([
          fetch(`/api/agriculture?section=crops&stateId=${selectedState}`),
          fetch("/api/agriculture?section=schemes"),
          fetch(`/api/agriculture?section=recommendation&stateId=${selectedState}&soilType=${soilType}`),
        ]);

        const [cropsJson, schemesJson, recommendationsJson] = await Promise.all([
          cropsRes.json(),
          schemesRes.json(),
          recommendationsRes.json(),
        ]);

        if (ignore) return;

        setCrops(cropsJson.crops || []);
        setSchemes(schemesJson.schemes || []);
        setRecommendations(recommendationsJson.recommendations || []);
      } catch {
        if (!ignore) {
          setCrops([]);
          setSchemes([]);
          setRecommendations([]);
        }
      }
    };

    void loadData();
    return () => {
      ignore = true;
    };
  }, [selectedState, soilType]);

  const tabs = [
    { key: "crops", label: "🌾 Crops Database", },
    { key: "recommend", label: "🤖 AI Recommendations" },
    { key: "schemes", label: "🏛 Government Schemes" },
    { key: "calendar", label: "📅 Crop Calendar" },
  ] as const;

  const soilTypes = ["Alluvial", "Black Cotton", "Red", "Laterite", "Desert Sandy", "Mountain", "Peaty"];

  return (
    <div className="theme-shell grid-bg">
      <TopNav />
      <div className="pt-16 px-4 pb-8 max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold theme-title">🌾 Smart Agriculture</h1>
            <p className="text-sm theme-subtitle">AI-powered crop advisory and agricultural intelligence</p>
          </div>
          <div className="flex items-center gap-3 mt-3 md:mt-0">
            <select value={selectedState} onChange={e => setSelectedState(parseInt(e.target.value))}
              className="px-3 py-1.5 rounded-md text-xs bg-space-800 border border-space-700 text-slate-300 focus:border-cyan-500/30 outline-none">
              {INDIA_STATES.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                ${tab === t.key ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : "text-slate-500 bg-space-800/50 border border-space-700 hover:text-slate-300"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Crops Database */}
        {tab === "crops" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {crops.map(crop => (
              <div key={crop.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-200">{crop.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${crop.season === "Kharif" ? "bg-green-500/10 text-green-400" : crop.season === "Rabi" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"}`}>
                    {crop.season}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Category</span>
                    <span className="text-slate-300">{crop.category}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Sowing</span>
                    <span className="text-green-400">{crop.sowingMonth}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Harvest</span>
                    <span className="text-orange-400">{crop.harvestMonth}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Water Need</span>
                    <span className={crop.waterRequirement === "High" ? "text-red-400" : crop.waterRequirement === "Medium" ? "text-yellow-400" : "text-green-400"}>
                      {crop.waterRequirement}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Yield</span>
                    <span className="text-cyan-400 font-mono">{crop.yieldPerHectare} ton/ha</span>
                  </div>
                  {crop.msp > 0 && (
                    <div className="flex justify-between text-slate-400 pt-1 border-t border-space-700">
                      <span>MSP</span>
                      <span className="text-yellow-400 font-mono font-bold">₹{crop.msp.toLocaleString()}/q</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Recommendations */}
        {tab === "recommend" && (
          <div>
            <div className="glass-card p-4 mb-4 flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-400">Soil Type:</span>
              {soilTypes.map(s => (
                <button key={s} onClick={() => setSoilType(s)}
                  className={`px-3 py-1 rounded text-xs transition-all ${soilType === s ? "bg-green-500/15 text-green-400 border border-green-500/30" : "text-slate-500 bg-space-800/50 border border-space-700"}`}>
                  {s}
                </button>
              ))}
            </div>

            <div className="glass-card p-5 mb-4 border-l-2 border-l-green-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                <span className="text-xs font-semibold text-green-400">AI CROP RECOMMENDATION ENGINE</span>
              </div>
              <p className="text-xs text-slate-400">
                Analysis based on {soilType} soil, current climate conditions in {INDIA_STATES.find(s => s.id === selectedState)?.name},
                market demand forecasts, and historical yield data. Powered by XGBoost + Random Forest ensemble.
              </p>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="glass-card p-4 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center text-lg font-bold text-green-400">
                      #{i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{rec.crop}</div>
                      <div className="text-[10px] text-slate-500">{rec.season} • {rec.reason}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{rec.suitability}%</div>
                      <div className="text-[9px] text-slate-600">SUITABILITY</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-cyan-400 font-mono">{rec.expectedYield}</div>
                      <div className="text-[9px] text-slate-600">YIELD ton/ha</div>
                    </div>
                    {rec.msp > 0 && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400 font-mono">₹{rec.msp.toLocaleString()}</div>
                        <div className="text-[9px] text-slate-600">MSP/quintal</div>
                      </div>
                    )}
                    <div className="w-20 h-2 rounded-full bg-space-800 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-cyan-500" style={{ width: `${rec.suitability}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Government Schemes */}
        {tab === "schemes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemes.map(scheme => (
              <div key={scheme.id} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🏛</span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">{scheme.name}</h3>
                    <span className="text-[10px] text-cyan-400">{scheme.ministry}</span>
                  </div>
                </div>
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 mb-3">{scheme.category}</span>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">{scheme.description}</p>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500">Eligibility: </span>
                    <span className="text-slate-300">{scheme.eligibility}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Benefits: </span>
                    <span className="text-green-400">{scheme.benefits}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Crop Calendar */}
        {tab === "calendar" && (
          <div className="glass-card p-5 overflow-x-auto">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">📅 Annual Crop Calendar</h2>
            <div className="min-w-[800px]">
              <div className="grid grid-cols-13 gap-0 text-[10px] text-slate-500 mb-2">
                <div className="font-semibold text-slate-400 px-2">Crop</div>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                  <div key={m} className="text-center">{m}</div>
                ))}
              </div>
              {crops.slice(0, 10).map(crop => {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const sowIdx = months.findIndex(m => crop.sowingMonth.startsWith(m.substring(0, 3)));
                const harIdx = months.findIndex(m => crop.harvestMonth.startsWith(m.substring(0, 3)));

                return (
                  <div key={crop.id} className="grid grid-cols-13 gap-0 mb-1 items-center">
                    <div className="text-xs text-slate-300 px-2 font-medium">{crop.name}</div>
                    {months.map((_, mi) => {
                      const inRange = sowIdx >= 0 && harIdx >= 0 &&
                        (sowIdx <= harIdx ? mi >= sowIdx && mi <= harIdx : mi >= sowIdx || mi <= harIdx);
                      const isSow = mi === sowIdx;
                      const isHarvest = mi === harIdx;
                      return (
                        <div key={mi} className="flex justify-center">
                          <div className={`w-full h-5 rounded-sm ${inRange
                            ? isSow ? "bg-green-500/40 border border-green-500/50"
                              : isHarvest ? "bg-orange-500/40 border border-orange-500/50"
                                : "bg-cyan-500/15 border border-cyan-500/10"
                            : "bg-space-800/30"}`} />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <div className="flex gap-4 mt-4 text-[10px] text-slate-500">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-green-500/40 border border-green-500/50" /> Sowing</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-cyan-500/15 border border-cyan-500/10" /> Growing</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-orange-500/40 border border-orange-500/50" /> Harvest</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
