// Twin AI — Live weather + air quality client
// Uses Open-Meteo (free, no API key) for weather and air quality.
// This is real, live data — not mocked.

export interface WeatherSnapshot {
  temperatureC: number;
  apparentTemperatureC: number;
  humidityPct: number;
  precipitationMm: number;
  precipitationProbabilityPct: number;
  windSpeedKmh: number;
  weatherCode: number;
  isDay: boolean;
  updatedAt: string;
}

export interface DailyForecastDay {
  date: string;
  maxTempC: number;
  minTempC: number;
  precipitationSumMm: number;
  precipitationProbabilityMaxPct: number;
  weatherCode: number;
}

export interface AirQualitySnapshot {
  aqi: number; // US AQI
  pm2_5: number;
  pm10: number;
}

const WEATHER_BASE = "https://api.open-meteo.com/v1/forecast";
const AQI_BASE = "https://air-quality-api.open-meteo.com/v1/air-quality";

export async function fetchWeather(lat: number, lon: number): Promise<{
  current: WeatherSnapshot;
  daily: DailyForecastDay[];
}> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,is_day",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code",
    hourly: "precipitation_probability",
    timezone: "Asia/Kolkata",
    forecast_days: "7",
  });

  const res = await fetch(`${WEATHER_BASE}?${params.toString()}`);
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
  const data = await res.json();

  const nowHourIdx = 0;
  const current: WeatherSnapshot = {
    temperatureC: data.current.temperature_2m,
    apparentTemperatureC: data.current.apparent_temperature,
    humidityPct: data.current.relative_humidity_2m,
    precipitationMm: data.current.precipitation,
    precipitationProbabilityPct: data.hourly?.precipitation_probability?.[nowHourIdx] ?? 0,
    windSpeedKmh: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    updatedAt: data.current.time,
  };

  const daily: DailyForecastDay[] = data.daily.time.map((date: string, i: number) => ({
    date,
    maxTempC: data.daily.temperature_2m_max[i],
    minTempC: data.daily.temperature_2m_min[i],
    precipitationSumMm: data.daily.precipitation_sum[i],
    precipitationProbabilityMaxPct: data.daily.precipitation_probability_max[i],
    weatherCode: data.daily.weather_code[i],
  }));

  return { current, daily };
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualitySnapshot> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "us_aqi,pm2_5,pm10",
    timezone: "Asia/Kolkata",
  });

  const res = await fetch(`${AQI_BASE}?${params.toString()}`);
  if (!res.ok) throw new Error(`AQI fetch failed: ${res.status}`);
  const data = await res.json();

  return {
    aqi: Math.round(data.current.us_aqi ?? 0),
    pm2_5: data.current.pm2_5 ?? 0,
    pm10: data.current.pm10 ?? 0,
  };
}

// Maps Open-Meteo WMO weather codes to human labels + icon name.
export function describeWeatherCode(code: number): { label: string; icon: string } {
  const map: Record<number, { label: string; icon: string }> = {
    0: { label: "Clear sky", icon: "sunny" },
    1: { label: "Mainly clear", icon: "partly-sunny" },
    2: { label: "Partly cloudy", icon: "partly-sunny" },
    3: { label: "Overcast", icon: "cloudy" },
    45: { label: "Fog", icon: "cloudy" },
    48: { label: "Depositing rime fog", icon: "cloudy" },
    51: { label: "Light drizzle", icon: "rainy" },
    53: { label: "Moderate drizzle", icon: "rainy" },
    55: { label: "Dense drizzle", icon: "rainy" },
    61: { label: "Slight rain", icon: "rainy" },
    63: { label: "Moderate rain", icon: "rainy" },
    65: { label: "Heavy rain", icon: "thunderstorm" },
    71: { label: "Slight snow", icon: "snow" },
    80: { label: "Rain showers", icon: "rainy" },
    81: { label: "Moderate showers", icon: "rainy" },
    82: { label: "Violent showers", icon: "thunderstorm" },
    95: { label: "Thunderstorm", icon: "thunderstorm" },
    96: { label: "Thunderstorm with hail", icon: "thunderstorm" },
    99: { label: "Severe thunderstorm with hail", icon: "thunderstorm" },
  };
  return map[code] ?? { label: "Unknown", icon: "help-circle" };
}
