/**
 * TWIN AI — Shared Types
 */

export interface StateData {
  id: number;
  name: string;
  code: string;
  capital: string;
  population: number;
  area: number;
  lat: number;
  lng: number;
  regionType: string;
}

export interface ClimateReading {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  aqi: number;
  uvIndex: number;
  visibility: number;
  cloudCover: number;
  condition: string;
}

export interface AlertData {
  id: number;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  state: string;
  district?: string;
  recommendations: string[];
  affectedPopulation: number;
  isActive: boolean;
  createdAt: string;
}

export interface CropData {
  id: number;
  name: string;
  category: string;
  season: string;
  sowingMonth: string;
  harvestMonth: string;
  waterRequirement: string;
  msp: number;
  yieldPerHectare: number;
}

export interface PredictionData {
  type: string;
  value: number;
  confidence: number;
  unit: string;
  trend: "up" | "down" | "stable";
  predictedFor: string;
}

export interface SimulationParams {
  type: string;
  rainChange?: number;
  tempChange?: number;
  cycloneCategory?: number;
  floodLevel?: number;
  stateId?: number;
  districtId?: number;
}

export interface SimulationResult {
  affectedVillages: number;
  affectedPopulation: number;
  cropDamage: number;
  economicLoss: number;
  roadClosures: number;
  hospitalImpact: number;
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type UserRole = "farmer" | "citizen" | "officer" | "researcher" | "admin";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
