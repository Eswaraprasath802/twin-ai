"use client";
/**
 * TWIN AI — Government Dashboard
 * Collector, Agriculture, Water Resources, Disaster Management dashboards
 */
import { useState } from "react";
import TopNav from "@/components/TopNav";
import { INDIA_STATES } from "@/lib/india-data";
import { createSeries } from "@/lib/deterministic";

function MiniChart({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return (
    <svg viewBox={`0 0 120 ${height}`} className="w-full" style={{ height }}>
      <polyline
        points={data.map((v, i) => `${(i / (data.length - 1)) * 120},${height - ((v - min) / range) * (height - 5)}`).join(" ")}
        fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export default function GovernmentPage() {
  const [selectedState, setSelectedState] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  const state = INDIA_STATES.find(s => s.id === selectedState);

  const tabs = [
    { key: "overview", label: "📊 Overview" },
    { key: "agriculture", label: "🌾 Agriculture" },
    { key: "water", label: "💧 Water Resources" },
    { key: "disaster", label: "⚡ Disaster Mgmt" },
    { key: "climate", label: "🌡 Climate Score" },
    { key: "resources", label: "📦 Resources" },
  ];

  const climateScore = 67 + ((selectedState * 7) % 20);
  const riskLevel = climateScore > 80 ? "Low" : climateScore > 60 ? "Moderate" : "High";
  const temperatureTrend = createSeries(30, selectedState + 1.1, 25, 40, 0);
  const rainfallTrend = createSeries(30, selectedState + 2.2, 0, 60, 0);
  const aqiTrend = createSeries(30, selectedState + 3.3, 50, 250, 0);
  const cultivationTrend = createSeries(12, selectedState + 4.4, 30, 100, 0);
  const waterTrend = createSeries(30, selectedState + 5.5, 40, 90, 0);

  return (
    <div className="min-h-screen bg-space-950 grid-bg">
      <TopNav />
      <div className="pt-16 px-4 pb-8 max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-200">🏛 Government Dashboard</h1>
            <p className="text-sm text-slate-500">District Collector & Department Intelligence Platform</p>
          </div>
          <div className="flex items-center gap-3 mt-3 md:mt-0">
            <span className="text-xs text-slate-500">Role: <span className="text-cyan-400">District Collector</span></span>
            <select value={selectedState} onChange={e => setSelectedState(parseInt(e.target.value))}
              className="px-3 py-1.5 rounded-md text-xs bg-space-800 border border-space-700 text-slate-300 outline-none">
              {INDIA_STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                ${activeTab === t.key ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : "text-slate-500 bg-space-800/50 border border-space-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { icon: "🌡", label: "Climate Score", value: `${climateScore}/100`, color: "text-cyan-400" },
                { icon: "⚡", label: "Risk Level", value: riskLevel, color: riskLevel === "Low" ? "text-green-400" : riskLevel === "Moderate" ? "text-yellow-400" : "text-red-400" },
                { icon: "🌾", label: "Crop Health", value: "Good", color: "text-green-400" },
                { icon: "💧", label: "Water Level", value: "72%", color: "text-blue-400" },
                { icon: "🏥", label: "Health Index", value: "78/100", color: "text-purple-400" },
                { icon: "📊", label: "AI Predictions", value: "847", color: "text-orange-400" },
              ].map((kpi, i) => (
                <div key={i} className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{kpi.icon}</span>
                    <span className="text-[10px] text-slate-500">{kpi.label}</span>
                  </div>
                  <div className={`text-xl font-bold font-mono ${kpi.color}`}>{kpi.value}</div>
                </div>
              ))}
            </div>

            {/* State Info + Decision Support */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass-card p-5">
                <h2 className="text-sm font-semibold text-slate-300 mb-4">📍 {state?.name} Overview</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Capital", value: state?.capital },
                    { label: "Population", value: `${((state?.population || 0) / 10000000).toFixed(1)}Cr` },
                    { label: "Area", value: `${((state?.area || 0)).toLocaleString()} km²` },
                    { label: "Region", value: state?.regionType },
                    { label: "Coordinates", value: `${state?.lat}°N, ${state?.lng}°E` },
                    { label: "Districts", value: "30+" },
                  ].map((item, i) => (
                    <div key={i} className="p-2 rounded-lg bg-space-800/30">
                      <div className="text-[10px] text-slate-500">{item.label}</div>
                      <div className="text-xs text-slate-300 font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-5 border-l-2 border-l-cyan-500">
                <div className="flex items-center gap-2 mb-3">
                  <span>🤖</span>
                  <h2 className="text-sm font-semibold text-cyan-400">AI Decision Recommendations</h2>
                </div>
                <div className="space-y-2">
                  {[
                    "📊 Allocate additional 15% water resources to southern districts facing deficit",
                    "🌾 Issue advisory for early wheat sowing based on favorable weather forecast",
                    "⚠️ Pre-position SDRF teams in flood-prone blocks for monsoon readiness",
                    "🏥 Increase medical supplies in rural PHCs for anticipated heatwave",
                    "💧 Review groundwater extraction permits - levels declining in 3 districts",
                  ].map((rec, i) => (
                    <div key={i} className="p-2 rounded-lg bg-space-800/30 text-xs text-slate-400 leading-relaxed">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trend Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4">
                <div className="text-xs text-slate-400 mb-2">Temperature Trend (30 days)</div>
                <MiniChart data={temperatureTrend} color="#ff8800" />
              </div>
              <div className="glass-card p-4">
                <div className="text-xs text-slate-400 mb-2">Rainfall Trend (30 days)</div>
                <MiniChart data={rainfallTrend} color="#00d4ff" />
              </div>
              <div className="glass-card p-4">
                <div className="text-xs text-slate-400 mb-2">AQI Trend (30 days)</div>
                <MiniChart data={aqiTrend} color="#ffd700" />
              </div>
            </div>
          </div>
        )}

        {/* Other tabs - simplified for space */}
        {activeTab === "agriculture" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Crop Production", value: "24.5M tons", trend: "+3.2%", icon: "🌾" },
              { title: "Area Under Cultivation", value: "18.7M hectares", trend: "+1.1%", icon: "🗺" },
              { title: "Irrigation Coverage", value: "62%", trend: "+5%", icon: "💧" },
              { title: "MSP Procurement", value: "₹4,200 Cr", trend: "+12%", icon: "💰" },
              { title: "Soil Health Cards", value: "8.4M issued", trend: "+18%", icon: "🧪" },
              { title: "Organic Farming", value: "1.2M hectares", trend: "+22%", icon: "🌱" },
            ].map((card, i) => (
              <div key={i} className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{card.icon}</span>
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">{card.trend}</span>
                </div>
                <div className="text-xl font-bold text-slate-200 font-mono">{card.value}</div>
                <div className="text-xs text-slate-500 mt-1">{card.title}</div>
                <MiniChart data={cultivationTrend} color="#00ff88" height={30} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "water" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Reservoir Levels", value: "78%", status: "Normal", icon: "🏞" },
              { title: "Groundwater Index", value: "6.2m depth", status: "Moderate", icon: "💧" },
              { title: "River Flow", value: "Normal", status: "Monitored", icon: "🌊" },
              { title: "Rainfall Deficit", value: "-8%", status: "Watch", icon: "🌧" },
            ].map((card, i) => (
              <div key={i} className="glass-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{card.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{card.title}</div>
                    <div className="text-[10px] text-slate-500">Status: <span className="text-cyan-400">{card.status}</span></div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-cyan-400 font-mono">{card.value}</div>
                <MiniChart data={waterTrend} color="#00d4ff" height={30} />
              </div>
            ))}
          </div>
        )}

        {(activeTab === "disaster" || activeTab === "climate" || activeTab === "resources") && (
          <div className="glass-card p-8 text-center">
            <div className="text-4xl mb-4">{activeTab === "disaster" ? "⚡" : activeTab === "climate" ? "🌡" : "📦"}</div>
            <h2 className="text-lg font-bold text-slate-300 mb-2">
              {activeTab === "disaster" ? "Disaster Management Dashboard" : activeTab === "climate" ? "Climate Score Analysis" : "Resource Allocation"}
            </h2>
            <p className="text-sm text-slate-500">
              Visit the dedicated <a href={activeTab === "disaster" ? "/disaster" : activeTab === "climate" ? "/climate" : "/analytics"} className="text-cyan-400 hover:underline">
                {activeTab === "disaster" ? "Disaster Center" : activeTab === "climate" ? "Climate Monitor" : "Analytics"}</a> for detailed analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
