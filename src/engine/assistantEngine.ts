// Twin AI — Assistant response engine
// Answers natural-language questions using live weather/AQI/alert/crop data.
// This is a template/intent-matching engine, not a hosted LLM (no backend yet).
// Swap generateAnswer() for a real API call to your LLM backend when ready.

import { WeatherSnapshot, DailyForecastDay, AirQualitySnapshot, describeWeatherCode } from "@/api/weather";
import { RiskAlert } from "./alertEngine";
import { recommendCrops, Season } from "@/data/crops";

export interface AssistantContext {
  stateName: string;
  current: WeatherSnapshot;
  daily: DailyForecastDay[];
  aqi?: AirQualitySnapshot;
  alerts: RiskAlert[];
}

function currentSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 9) return "Kharif";
  if (month >= 10 || month <= 2) return "Rabi";
  return "Zaid";
}

export function generateAnswer(question: string, ctx: AssistantContext): string {
  const q = question.toLowerCase();
  const { current, daily, aqi, alerts, stateName } = ctx;
  const tomorrow = daily[1];

  // Rain tomorrow
  if (/rain.*(tomorrow|tonight|today)|will it rain/.test(q)) {
    const target = /tomorrow/.test(q) ? tomorrow : daily[0];
    const prob = target?.precipitationProbabilityMaxPct ?? 0;
    const mm = target?.precipitationSumMm ?? 0;
    if (prob >= 60) {
      return `Yes, there's a ${Math.round(prob)}% chance of rain in ${stateName}, with about ${Math.round(
        mm
      )}mm expected. ${mm >= 65 ? "This could be heavy \u2014 consider protecting crops and avoiding low-lying routes." : "Keep an umbrella handy."}`;
    }
    if (prob >= 30) {
      return `There's a moderate chance (${Math.round(prob)}%) of light rain in ${stateName}. Not expected to be significant.`;
    }
    return `Rain is unlikely in ${stateName} \u2014 only a ${Math.round(prob)}% chance currently forecast.`;
  }

  // Flood probability
  if (/flood/.test(q)) {
    const floodAlert = alerts.find((a) => a.id === "flood-risk");
    if (floodAlert) {
      return `${floodAlert.title} in ${stateName}. ${floodAlert.summary} Recommended: ${floodAlert.recommendations
        .slice(0, 3)
        .join("; ")}.`;
    }
    return `No significant flood risk is currently indicated for ${stateName} based on today's forecast.`;
  }

  // Crop suitability — "can I grow X here"
  const cropMatch = q.match(/grow\s+([a-z\s]+?)(\s+here|\?|$)/);
  if (cropMatch) {
    const cropQuery = cropMatch[1].trim();
    const season = currentSeason();
    const avgTemp = (current.temperatureC + (daily[0]?.maxTempC ?? current.temperatureC)) / 2;
    // rough annual rainfall estimate from 7-day forecast, scaled — clearly an estimate
    const weeklyRain = daily.reduce((s, d) => s + d.precipitationSumMm, 0);
    const estAnnualRain = weeklyRain * 12; // very rough seasonal proxy, flagged as estimate
    const suitable = recommendCrops(estAnnualRain, avgTemp, season);
    const match = suitable.find((c) => c.name.toLowerCase().includes(cropQuery));
    if (match) {
      return `${match.name} looks suitable for ${stateName} in the current ${season} season \u2014 ideal temperature range is ${match.idealTempC[0]}\u2013${match.idealTempC[1]}\u00b0C, which fits current conditions. Sowing window: ${match.sowingWindow}. Note: this is a general estimate, not a soil-tested recommendation \u2014 confirm with a local soil test.`;
    }
    return `Based on current temperature and season (${season}) in ${stateName}, ${cropQuery} isn't among the best-fit options right now. Try asking "what crop should I grow?" for suitable alternatives.`;
  }

  // What crop should I grow
  if (/what crop|which crop|crop.*(recommend|suggest)/.test(q)) {
    const season = currentSeason();
    const avgTemp = (current.temperatureC + (daily[0]?.maxTempC ?? current.temperatureC)) / 2;
    const weeklyRain = daily.reduce((s, d) => s + d.precipitationSumMm, 0);
    const estAnnualRain = weeklyRain * 12;
    const suitable = recommendCrops(estAnnualRain, avgTemp, season);
    if (suitable.length === 0) {
      return `For the current ${season} season in ${stateName}, conditions are outside the typical range for our reference crop list. Consult your local agriculture office for tailored advice.`;
    }
    return `For the ${season} season in ${stateName}, suitable crops include: ${suitable
      .slice(0, 4)
      .map((c) => c.name)
      .join(", ")}. This is a general estimate based on temperature and rainfall trends \u2014 a local soil test will refine this further.`;
  }

  // Fertilizer advice
  if (/fertilizer/.test(q)) {
    const rainSoon = daily[0]?.precipitationProbabilityMaxPct ?? 0;
    if (rainSoon >= 60) {
      return `Rain is likely in ${stateName} soon (${Math.round(
        rainSoon
      )}% chance) \u2014 it's best to hold off on fertilizer application, as heavy rain can wash nutrients away before they're absorbed. Wait until after the rain clears.`;
    }
    return `Conditions in ${stateName} look stable for fertilizer application. Apply during cooler parts of the day (early morning/evening) and follow recommended dosage for your crop stage.`;
  }

  // Heavy rainfall — what should I do
  if (/heavy rain.*(do|should)|what.*do.*rain/.test(q)) {
    const floodAlert = alerts.find((a) => a.id === "flood-risk");
    if (floodAlert) {
      return `${floodAlert.recommendations.join(". ")}.`;
    }
    return `No heavy rain is currently forecast for ${stateName}, but general precautions: keep drainage clear, and monitor official IMD bulletins for updates.`;
  }

  // Current weather / general
  if (/weather|temperature|hot|cold|humid/.test(q)) {
    const desc = describeWeatherCode(current.weatherCode);
    return `Right now in ${stateName}: ${current.temperatureC.toFixed(1)}\u00b0C (feels like ${current.apparentTemperatureC.toFixed(
      1
    )}\u00b0C), ${desc.label.toLowerCase()}, humidity ${current.humidityPct}%, wind ${current.windSpeedKmh.toFixed(
      0
    )} km/h.${aqi ? ` Air quality index: ${aqi.aqi}.` : ""}`;
  }

  // Air quality
  if (/aqi|air quality|pollution/.test(q)) {
    if (!aqi) return "Air quality data isn't available for this location right now.";
    const band = aqi.aqi >= 300 ? "hazardous" : aqi.aqi >= 200 ? "very poor" : aqi.aqi >= 100 ? "moderate" : "good";
    return `Current AQI in ${stateName} is ${aqi.aqi} (${band}), with PM2.5 at ${aqi.pm2_5.toFixed(1)} \u00b5g/m\u00b3.`;
  }

  // Fallback
  return `I can help with weather, rainfall, flood risk, crop suitability, fertilizer timing, and air quality for ${stateName}. Try asking things like "Will it rain tomorrow?" or "What crop should I grow?"`;
}
