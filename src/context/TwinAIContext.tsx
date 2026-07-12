// Twin AI — App-wide context: selected state + live weather/AQI/alerts
// Centralizes data fetching so every screen shares the same live snapshot.

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { INDIAN_STATES, IndianState } from "@/data/states";
import { fetchWeather, fetchAirQuality, WeatherSnapshot, DailyForecastDay, AirQualitySnapshot } from "@/api/weather";
import { evaluateRisks, RiskAlert } from "@/engine/alertEngine";

interface TwinAIContextValue {
  selectedState: IndianState;
  setSelectedState: (s: IndianState) => void;
  current: WeatherSnapshot | null;
  daily: DailyForecastDay[];
  aqi: AirQualitySnapshot | null;
  alerts: RiskAlert[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const TwinAIContext = createContext<TwinAIContextValue | undefined>(undefined);

export const TwinAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedState, setSelectedState] = useState<IndianState>(
    INDIAN_STATES.find((s) => s.id === "TN") ?? INDIAN_STATES[0]
  );
  const [current, setCurrent] = useState<WeatherSnapshot | null>(null);
  const [daily, setDaily] = useState<DailyForecastDay[]>([]);
  const [aqi, setAqi] = useState<AirQualitySnapshot | null>(null);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [weatherData, aqiData] = await Promise.all([
          fetchWeather(selectedState.lat, selectedState.lon),
          fetchAirQuality(selectedState.lat, selectedState.lon).catch(() => null),
        ]);
        if (cancelled) return;
        setCurrent(weatherData.current);
        setDaily(weatherData.daily);
        setAqi(aqiData);
        setAlerts(evaluateRisks(weatherData.current, weatherData.daily, aqiData ?? undefined));
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load live data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedState, tick]);

  return (
    <TwinAIContext.Provider
      value={{ selectedState, setSelectedState, current, daily, aqi, alerts, loading, error, refresh }}
    >
      {children}
    </TwinAIContext.Provider>
  );
};

export function useTwinAI(): TwinAIContextValue {
  const ctx = useContext(TwinAIContext);
  if (!ctx) throw new Error("useTwinAI must be used within TwinAIProvider");
  return ctx;
}
