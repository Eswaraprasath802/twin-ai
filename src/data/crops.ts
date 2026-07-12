// Twin AI — Crop reference dataset
// Static agronomic reference data (general Indian agriculture guidance).
// Used to power crop recommendation logic without needing a trained ML model.

export type Season = "Kharif" | "Rabi" | "Zaid";

export interface CropInfo {
  id: string;
  name: string;
  seasons: Season[];
  idealTempC: [number, number];
  minRainfallMm: number;
  maxRainfallMm: number;
  soilTypes: string[];
  sowingWindow: string;
  harvestWindow: string;
  notes: string;
}

export const CROPS: CropInfo[] = [
  {
    id: "rice",
    name: "Rice (Paddy)",
    seasons: ["Kharif"],
    idealTempC: [20, 37],
    minRainfallMm: 1000,
    maxRainfallMm: 2500,
    soilTypes: ["Clayey", "Alluvial"],
    sowingWindow: "June \u2013 July",
    harvestWindow: "October \u2013 November",
    notes: "Needs standing water; suited to high-rainfall or well-irrigated regions.",
  },
  {
    id: "wheat",
    name: "Wheat",
    seasons: ["Rabi"],
    idealTempC: [10, 25],
    minRainfallMm: 300,
    maxRainfallMm: 900,
    soilTypes: ["Loamy", "Alluvial", "Clayey"],
    sowingWindow: "October \u2013 December",
    harvestWindow: "March \u2013 April",
    notes: "Cool climate crop; needs 4\u20136 irrigations depending on rainfall.",
  },
  {
    id: "cotton",
    name: "Cotton",
    seasons: ["Kharif"],
    idealTempC: [21, 35],
    minRainfallMm: 500,
    maxRainfallMm: 1000,
    soilTypes: ["Black (Regur)", "Alluvial"],
    sowingWindow: "April \u2013 May (irrigated) / June (rainfed)",
    harvestWindow: "October \u2013 January",
    notes: "Sensitive to waterlogging; requires well-drained black soil ideally.",
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    seasons: ["Kharif", "Zaid"],
    idealTempC: [21, 38],
    minRainfallMm: 750,
    maxRainfallMm: 1500,
    soilTypes: ["Loamy", "Alluvial", "Clayey"],
    sowingWindow: "February \u2013 March / September \u2013 October",
    harvestWindow: "10\u201312 months after sowing",
    notes: "High water requirement; needs consistent irrigation.",
  },
  {
    id: "maize",
    name: "Maize",
    seasons: ["Kharif", "Rabi", "Zaid"],
    idealTempC: [18, 32],
    minRainfallMm: 500,
    maxRainfallMm: 1000,
    soilTypes: ["Loamy", "Alluvial", "Red"],
    sowingWindow: "June \u2013 July (Kharif) / October \u2013 November (Rabi)",
    harvestWindow: "90\u2013120 days after sowing",
    notes: "Versatile crop, tolerant to a range of soil types.",
  },
  {
    id: "groundnut",
    name: "Groundnut",
    seasons: ["Kharif", "Zaid"],
    idealTempC: [20, 30],
    minRainfallMm: 500,
    maxRainfallMm: 1000,
    soilTypes: ["Sandy Loam", "Red", "Black"],
    sowingWindow: "June \u2013 July",
    harvestWindow: "October \u2013 November",
    notes: "Requires well-drained sandy loam soils.",
  },
  {
    id: "millets",
    name: "Millets (Bajra/Jowar)",
    seasons: ["Kharif"],
    idealTempC: [25, 35],
    minRainfallMm: 300,
    maxRainfallMm: 600,
    soilTypes: ["Sandy", "Red", "Black"],
    sowingWindow: "June \u2013 July",
    harvestWindow: "September \u2013 October",
    notes: "Highly drought tolerant; suited to low-rainfall, dry regions.",
  },
  {
    id: "pulses",
    name: "Pulses (Tur/Moong/Chana)",
    seasons: ["Kharif", "Rabi"],
    idealTempC: [20, 30],
    minRainfallMm: 400,
    maxRainfallMm: 750,
    soilTypes: ["Loamy", "Black", "Red"],
    sowingWindow: "June \u2013 July (Kharif) / October (Rabi)",
    harvestWindow: "90\u2013150 days after sowing",
    notes: "Nitrogen-fixing; good for crop rotation and soil health.",
  },
];

export function recommendCrops(annualRainfallMm: number, avgTempC: number, season: Season): CropInfo[] {
  return CROPS.filter(
    (c) =>
      c.seasons.includes(season) &&
      avgTempC >= c.idealTempC[0] &&
      avgTempC <= c.idealTempC[1] &&
      annualRainfallMm >= c.minRainfallMm * 0.6 // allow some irrigation buffer
  );
}
