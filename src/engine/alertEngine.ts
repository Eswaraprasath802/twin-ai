// Twin AI — Smart Alert Engine
// Rule-based risk detection over live weather/AQI data, with actionable recommendations.
// NOTE: This is deterministic/rule-based, not a trained ML model. Thresholds are based on
// IMD (India Meteorological Department) general guidance bands. Swap in a real model later
// by replacing evaluateRisks() with an API call.

import { WeatherSnapshot, DailyForecastDay, AirQualitySnapshot } from "@/api/weather";

export type RiskLevel = "low" | "moderate" | "high" | "severe";

export interface RiskAlert {
  id: string;
  title: string;
  level: RiskLevel;
  summary: string;
  recommendations: string[];
}

const LEVEL_RANK: Record<RiskLevel, number> = { low: 0, moderate: 1, high: 2, severe: 3 };

export function evaluateRisks(
  current: WeatherSnapshot,
  daily: DailyForecastDay[],
  aqi?: AirQualitySnapshot
): RiskAlert[] {
  const alerts: RiskAlert[] = [];
  const today = daily[0];
  const tomorrow = daily[1];

  // --- Heavy rain / flood risk ---
  const rainToday = today?.precipitationSumMm ?? 0;
  const rainProb = today?.precipitationProbabilityMaxPct ?? 0;
  if (rainToday >= 115 || (rainToday >= 65 && rainProb >= 70)) {
    alerts.push({
      id: "flood-risk",
      title: rainToday >= 115 ? "Heavy to Very Heavy Rainfall Expected" : "Heavy Rainfall Expected",
      level: rainToday >= 115 ? "severe" : "high",
      summary: `Forecast rainfall today: ~${Math.round(rainToday)}mm with ${Math.round(
        rainProb
      )}% probability. Localized flooding is possible in low-lying areas.`,
      recommendations: [
        "Harvest ready crops before rainfall if possible",
        "Pause fertilizer and pesticide application",
        "Clear and open field drainage channels",
        "Move livestock to higher, sheltered ground",
        "Store seeds and grain in waterproof storage",
        "Avoid travel through low-lying roads and river crossings",
      ],
    });
  }

  // --- Heatwave risk ---
  const maxTemp = today?.maxTempC ?? current.temperatureC;
  if (maxTemp >= 45) {
    alerts.push({
      id: "heatwave-severe",
      title: "Severe Heatwave Conditions",
      level: "severe",
      summary: `Peak temperature expected to reach ${Math.round(maxTemp)}°C.`,
      recommendations: [
        "Avoid outdoor work between 12 PM \u2013 4 PM",
        "Increase irrigation frequency for standing crops",
        "Provide extra water and shade for livestock",
        "Stay hydrated and watch for heat exhaustion symptoms",
        "Check on elderly and vulnerable neighbors",
      ],
    });
  } else if (maxTemp >= 40) {
    alerts.push({
      id: "heatwave-moderate",
      title: "Heatwave Watch",
      level: "high",
      summary: `Peak temperature expected to reach ${Math.round(maxTemp)}°C, above seasonal norms.`,
      recommendations: [
        "Schedule irrigation for early morning or evening",
        "Limit strenuous outdoor activity during peak afternoon heat",
        "Ensure adequate drinking water access",
      ],
    });
  }

  // --- Air quality risk ---
  if (aqi) {
    if (aqi.aqi >= 200) {
      alerts.push({
        id: "aqi-severe",
        title: "Very Poor Air Quality",
        level: aqi.aqi >= 300 ? "severe" : "high",
        summary: `Current AQI is ${aqi.aqi} (PM2.5: ${aqi.pm2_5.toFixed(1)} \u00b5g/m\u00b3).`,
        recommendations: [
          "Avoid prolonged outdoor exertion, especially for children and elderly",
          "Use N95 masks outdoors if necessary",
          "Keep windows closed during peak pollution hours",
          "Sensitive groups should use air purifiers indoors if available",
        ],
      });
    } else if (aqi.aqi >= 100) {
      alerts.push({
        id: "aqi-moderate",
        title: "Moderate Air Quality",
        level: "moderate",
        summary: `Current AQI is ${aqi.aqi}. Sensitive groups may experience mild effects.`,
        recommendations: [
          "Sensitive individuals should limit prolonged outdoor exertion",
        ],
      });
    }
  }

  // --- Strong wind / storm risk ---
  if (current.windSpeedKmh >= 62) {
    alerts.push({
      id: "storm-wind",
      title: "Strong Wind / Storm Conditions",
      level: current.windSpeedKmh >= 89 ? "severe" : "high",
      summary: `Sustained wind speed near ${Math.round(current.windSpeedKmh)} km/h.`,
      recommendations: [
        "Secure loose structures, greenhouse covers, and equipment",
        "Avoid sheltering under trees or weak structures",
        "Move boats and fishing equipment to safety",
        "Monitor official cyclone/storm bulletins",
      ],
    });
  }

  // --- Thunderstorm code direct flag ---
  if ([95, 96, 99].includes(current.weatherCode)) {
    alerts.push({
      id: "thunderstorm-now",
      title: "Thunderstorm Active",
      level: "high",
      summary: "Thunderstorm activity detected in the current conditions.",
      recommendations: [
        "Stay indoors and away from open fields",
        "Avoid using wired electrical equipment",
        "Unplug sensitive electronics",
      ],
    });
  }

  return alerts.sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level]);
}

export function riskLevelColor(level: RiskLevel): string {
  switch (level) {
    case "severe":
      return "#FF5C6C";
    case "high":
      return "#FF8A4B";
    case "moderate":
      return "#FFC24B";
    default:
      return "#3DDC97";
  }
}
