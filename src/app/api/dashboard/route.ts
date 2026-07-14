/**
 * TWIN AI — Dashboard Summary API
 * Returns aggregated stats for the main dashboard
 */
import { NextResponse } from "next/server";
import { INDIA_STATES, generateClimateData, generateAlerts } from "@/lib/india-data";

export async function GET() {
  const alerts = generateAlerts();
  const nationalClimate = {
    avgTemperature: Math.round((INDIA_STATES.reduce((sum, s) => sum + (generateClimateData(s.id)?.temperature || 30), 0) / INDIA_STATES.length) * 10) / 10,
    avgHumidity: Math.round(INDIA_STATES.reduce((sum, s) => sum + (generateClimateData(s.id)?.humidity || 60), 0) / INDIA_STATES.length),
    avgAqi: Math.round(INDIA_STATES.reduce((sum, s) => sum + (generateClimateData(s.id)?.aqi || 100), 0) / INDIA_STATES.length),
    totalRainfall: Math.round(INDIA_STATES.reduce((sum, s) => sum + (generateClimateData(s.id)?.rainfall || 10), 0) * 10) / 10,
  };

  return NextResponse.json({
    national: {
      ...nationalClimate,
      totalStates: 28,
      totalDistricts: 766,
      monitoringStations: 4562,
      satellitesActive: 14,
      aiModelsRunning: 23,
      predictionsToday: 12847,
      alertsActive: alerts.filter(a => a.severity === "critical" || a.severity === "high").length,
    },
    recentAlerts: alerts.slice(0, 4),
    timestamp: new Date().toISOString(),
  });
}
