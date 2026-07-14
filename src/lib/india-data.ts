/**
 * TWIN AI — India States & Districts Reference Data
 * Comprehensive geospatial and demographic data
 */

export const INDIA_STATES = [
  { id: 1, name: "Andhra Pradesh", code: "AP", capital: "Amaravati", lat: 15.9129, lng: 79.74, population: 49577103, area: 162968, regionType: "South" },
  { id: 2, name: "Arunachal Pradesh", code: "AR", capital: "Itanagar", lat: 28.218, lng: 94.7278, population: 1383727, area: 83743, regionType: "Northeast" },
  { id: 3, name: "Assam", code: "AS", capital: "Dispur", lat: 26.2006, lng: 92.9376, population: 31205576, area: 78438, regionType: "Northeast" },
  { id: 4, name: "Bihar", code: "BR", capital: "Patna", lat: 25.0961, lng: 85.3131, population: 104099452, area: 94163, regionType: "East" },
  { id: 5, name: "Chhattisgarh", code: "CG", capital: "Raipur", lat: 21.2787, lng: 81.8661, population: 25545198, area: 135192, regionType: "Central" },
  { id: 6, name: "Goa", code: "GA", capital: "Panaji", lat: 15.2993, lng: 74.124, population: 1458545, area: 3702, regionType: "West" },
  { id: 7, name: "Gujarat", code: "GJ", capital: "Gandhinagar", lat: 22.2587, lng: 71.1924, population: 60439692, area: 196024, regionType: "West" },
  { id: 8, name: "Haryana", code: "HR", capital: "Chandigarh", lat: 29.0588, lng: 76.0856, population: 25351462, area: 44212, regionType: "North" },
  { id: 9, name: "Himachal Pradesh", code: "HP", capital: "Shimla", lat: 31.1048, lng: 77.1734, population: 6864602, area: 55673, regionType: "North" },
  { id: 10, name: "Jharkhand", code: "JH", capital: "Ranchi", lat: 23.6102, lng: 85.2799, population: 32988134, area: 79716, regionType: "East" },
  { id: 11, name: "Karnataka", code: "KA", capital: "Bengaluru", lat: 15.3173, lng: 75.7139, population: 61095297, area: 191791, regionType: "South" },
  { id: 12, name: "Kerala", code: "KL", capital: "Thiruvananthapuram", lat: 10.8505, lng: 76.2711, population: 33406061, area: 38863, regionType: "South" },
  { id: 13, name: "Madhya Pradesh", code: "MP", capital: "Bhopal", lat: 22.9734, lng: 78.6569, population: 72626809, area: 308252, regionType: "Central" },
  { id: 14, name: "Maharashtra", code: "MH", capital: "Mumbai", lat: 19.7515, lng: 75.7139, population: 112374333, area: 307713, regionType: "West" },
  { id: 15, name: "Manipur", code: "MN", capital: "Imphal", lat: 24.6637, lng: 93.9063, population: 2855794, area: 22327, regionType: "Northeast" },
  { id: 16, name: "Meghalaya", code: "ML", capital: "Shillong", lat: 25.467, lng: 91.3662, population: 2966889, area: 22429, regionType: "Northeast" },
  { id: 17, name: "Mizoram", code: "MZ", capital: "Aizawl", lat: 23.1645, lng: 92.9376, population: 1097206, area: 21081, regionType: "Northeast" },
  { id: 18, name: "Nagaland", code: "NL", capital: "Kohima", lat: 26.1584, lng: 94.5624, population: 1978502, area: 16579, regionType: "Northeast" },
  { id: 19, name: "Odisha", code: "OD", capital: "Bhubaneswar", lat: 20.9517, lng: 85.0985, population: 41974218, area: 155707, regionType: "East" },
  { id: 20, name: "Punjab", code: "PB", capital: "Chandigarh", lat: 31.1471, lng: 75.3412, population: 27743338, area: 50362, regionType: "North" },
  { id: 21, name: "Rajasthan", code: "RJ", capital: "Jaipur", lat: 27.0238, lng: 74.2179, population: 68548437, area: 342239, regionType: "West" },
  { id: 22, name: "Sikkim", code: "SK", capital: "Gangtok", lat: 27.533, lng: 88.5122, population: 610577, area: 7096, regionType: "Northeast" },
  { id: 23, name: "Tamil Nadu", code: "TN", capital: "Chennai", lat: 11.1271, lng: 78.6569, population: 72147030, area: 130058, regionType: "South" },
  { id: 24, name: "Telangana", code: "TS", capital: "Hyderabad", lat: 18.1124, lng: 79.0193, population: 35003674, area: 112077, regionType: "South" },
  { id: 25, name: "Tripura", code: "TR", capital: "Agartala", lat: 23.9408, lng: 91.9882, population: 3673917, area: 10486, regionType: "Northeast" },
  { id: 26, name: "Uttar Pradesh", code: "UP", capital: "Lucknow", lat: 26.8467, lng: 80.9462, population: 199812341, area: 240928, regionType: "North" },
  { id: 27, name: "Uttarakhand", code: "UK", capital: "Dehradun", lat: 30.0668, lng: 79.0193, population: 10086292, area: 53483, regionType: "North" },
  { id: 28, name: "West Bengal", code: "WB", capital: "Kolkata", lat: 22.9868, lng: 87.855, population: 91276115, area: 88752, regionType: "East" },
];

export const CLIMATE_CONDITIONS = [
  "Sunny", "Partly Cloudy", "Cloudy", "Overcast", "Light Rain",
  "Heavy Rain", "Thunderstorm", "Haze", "Fog", "Clear",
];

export const ALERT_TYPES = [
  "cyclone", "flood", "drought", "heatwave", "coldwave",
  "thunderstorm", "heavy_rain", "forest_fire", "earthquake", "tsunami",
];

export const CROP_LIST = [
  { name: "Rice", category: "Cereal", season: "Kharif", sowingMonth: "June", harvestMonth: "November", waterRequirement: "High", msp: 2183, yieldPerHectare: 2.5 },
  { name: "Wheat", category: "Cereal", season: "Rabi", sowingMonth: "November", harvestMonth: "April", waterRequirement: "Medium", msp: 2275, yieldPerHectare: 3.5 },
  { name: "Cotton", category: "Cash Crop", season: "Kharif", sowingMonth: "April", harvestMonth: "December", waterRequirement: "Medium", msp: 6620, yieldPerHectare: 0.5 },
  { name: "Sugarcane", category: "Cash Crop", season: "Annual", sowingMonth: "February", harvestMonth: "January", waterRequirement: "High", msp: 315, yieldPerHectare: 70 },
  { name: "Maize", category: "Cereal", season: "Kharif", sowingMonth: "June", harvestMonth: "October", waterRequirement: "Medium", msp: 2090, yieldPerHectare: 3.0 },
  { name: "Groundnut", category: "Oilseed", season: "Kharif", sowingMonth: "June", harvestMonth: "October", waterRequirement: "Low", msp: 6377, yieldPerHectare: 1.8 },
  { name: "Soybean", category: "Oilseed", season: "Kharif", sowingMonth: "June", harvestMonth: "October", waterRequirement: "Medium", msp: 4600, yieldPerHectare: 1.2 },
  { name: "Mustard", category: "Oilseed", season: "Rabi", sowingMonth: "October", harvestMonth: "March", waterRequirement: "Low", msp: 5650, yieldPerHectare: 1.3 },
  { name: "Potato", category: "Vegetable", season: "Rabi", sowingMonth: "October", harvestMonth: "February", waterRequirement: "Medium", msp: 0, yieldPerHectare: 22 },
  { name: "Tomato", category: "Vegetable", season: "All", sowingMonth: "Variable", harvestMonth: "Variable", waterRequirement: "Medium", msp: 0, yieldPerHectare: 25 },
  { name: "Onion", category: "Vegetable", season: "Rabi", sowingMonth: "November", harvestMonth: "April", waterRequirement: "Low", msp: 0, yieldPerHectare: 17 },
  { name: "Tea", category: "Plantation", season: "Annual", sowingMonth: "Year-round", harvestMonth: "Year-round", waterRequirement: "High", msp: 0, yieldPerHectare: 2.0 },
];

export const GOVERNMENT_SCHEMES = [
  { name: "PM-KISAN", ministry: "Agriculture", category: "Income Support", description: "₹6,000 per year direct income support to farmer families", eligibility: "All land-holding farmer families", benefits: "₹6,000/year in 3 installments" },
  { name: "PMFBY", ministry: "Agriculture", category: "Crop Insurance", description: "Pradhan Mantri Fasal Bima Yojana - Comprehensive crop insurance", eligibility: "All farmers growing notified crops", benefits: "Full insured sum on crop loss" },
  { name: "PM-KUSUM", ministry: "MNRE", category: "Solar Energy", description: "Solar pumps and grid-connected solar for farmers", eligibility: "Farmers with agricultural land", benefits: "60% subsidy on solar pumps" },
  { name: "Soil Health Card", ministry: "Agriculture", category: "Soil Testing", description: "Free soil testing and nutrient recommendations", eligibility: "All farmers", benefits: "Free soil analysis report" },
  { name: "MGNREGA", ministry: "Rural Development", category: "Employment", description: "100 days guaranteed employment in rural areas", eligibility: "Rural households", benefits: "100 days employment at minimum wage" },
  { name: "NDRF", ministry: "Home Affairs", category: "Disaster Relief", description: "National Disaster Response Fund for disaster relief", eligibility: "Disaster affected individuals", benefits: "Financial assistance for disaster relief" },
];

/** Generate realistic random climate data for a state */
export function generateClimateData(stateId: number) {
  const state = INDIA_STATES.find(s => s.id === stateId);
  if (!state) return null;

  const latFactor = (state.lat - 8) / 30; // 0 to 1, south to north
  const baseTemp = 35 - latFactor * 15 + (Math.random() * 6 - 3);
  const baseHumidity = 50 + (state.regionType === "South" || state.regionType === "Northeast" ? 20 : 0) + (Math.random() * 20 - 10);
  const baseRainfall = Math.random() * 50 * (state.regionType === "Northeast" ? 3 : 1);

  return {
    temperature: Math.round(baseTemp * 10) / 10,
    humidity: Math.min(100, Math.max(20, Math.round(baseHumidity))),
    rainfall: Math.round(baseRainfall * 10) / 10,
    windSpeed: Math.round((5 + Math.random() * 25) * 10) / 10,
    windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
    pressure: Math.round((1005 + Math.random() * 20) * 10) / 10,
    aqi: Math.floor(50 + Math.random() * 300),
    uvIndex: Math.round((3 + Math.random() * 8) * 10) / 10,
    visibility: Math.round((5 + Math.random() * 10) * 10) / 10,
    cloudCover: Math.floor(Math.random() * 100),
    condition: CLIMATE_CONDITIONS[Math.floor(Math.random() * CLIMATE_CONDITIONS.length)],
  };
}

/** Generate AI predictions */
export function generatePredictions(stateId: number) {
  const types = [
    { type: "rainfall", unit: "mm", base: 50, variance: 100 },
    { type: "temperature", unit: "°C", base: 30, variance: 10 },
    { type: "humidity", unit: "%", base: 60, variance: 30 },
    { type: "aqi", unit: "AQI", base: 150, variance: 200 },
    { type: "flood_risk", unit: "%", base: 20, variance: 50 },
    { type: "drought_risk", unit: "%", base: 15, variance: 40 },
    { type: "cyclone_risk", unit: "%", base: 10, variance: 30 },
    { type: "heatwave_risk", unit: "%", base: 25, variance: 50 },
    { type: "crop_yield", unit: "ton/ha", base: 3, variance: 2 },
    { type: "groundwater", unit: "m", base: 8, variance: 5 },
  ];

  return types.map(t => ({
    type: t.type,
    value: Math.round((t.base + Math.random() * t.variance) * 10) / 10,
    confidence: Math.round((70 + Math.random() * 25) * 10) / 10,
    unit: t.unit,
    trend: (["up", "down", "stable"] as const)[Math.floor(Math.random() * 3)],
    predictedFor: new Date(Date.now() + 86400000).toISOString(),
  }));
}

/** Generate active alerts */
export function generateAlerts() {
  const alertTemplates = [
    { type: "heavy_rain", severity: "high" as const, title: "Heavy Rainfall Warning", description: "IMD predicts 150-200mm rainfall in next 48 hours", recommendations: ["Harvest mature crops immediately", "Stop fertilizer application", "Clear drainage channels", "Move livestock to elevated areas", "Store seeds in waterproof containers", "Avoid travel in flood-prone areas"] },
    { type: "cyclone", severity: "critical" as const, title: "Cyclonic Storm Alert", description: "Deep depression intensifying into cyclonic storm, expected landfall in 72 hours", recommendations: ["Evacuate coastal villages", "Secure loose structures", "Stock emergency supplies", "Move boats to safe harbor", "Contact NDRF helpline: 011-26701700", "Follow evacuation routes"] },
    { type: "heatwave", severity: "high" as const, title: "Severe Heatwave Warning", description: "Temperature expected to reach 45°C+ for next 5 days", recommendations: ["Avoid outdoor work 12PM-4PM", "Increase water intake", "Use ORS solution", "Keep livestock hydrated", "Apply mulching to crops", "Visit nearest cooling center"] },
    { type: "flood", severity: "critical" as const, title: "Flood Warning - River Basin", description: "Water levels rising above danger mark, flooding expected in low-lying areas", recommendations: ["Evacuate low-lying areas", "Move to higher ground", "Keep emergency kit ready", "Do not cross flooded bridges", "Boil drinking water", "Contact district helpline"] },
    { type: "drought", severity: "medium" as const, title: "Drought Advisory", description: "Below-normal rainfall predicted, water conservation measures recommended", recommendations: ["Switch to drought-resistant crops", "Implement drip irrigation", "Reduce non-essential water use", "Harvest rainwater", "Apply for drought relief fund", "Contact agriculture officer"] },
    { type: "forest_fire", severity: "high" as const, title: "Forest Fire Risk Alert", description: "High temperature and low humidity increasing fire risk in forest areas", recommendations: ["Report any fire sighting to 1800-11-1363", "Create firebreaks around settlements", "Keep water reserves ready", "Avoid burning crop residue", "Stay away from fire-prone forest areas"] },
  ];

  return alertTemplates.map((t, i) => ({
    ...t,
    id: i + 1,
    state: INDIA_STATES[Math.floor(Math.random() * INDIA_STATES.length)].name,
    affectedPopulation: Math.floor(100000 + Math.random() * 5000000),
    isActive: true,
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
  }));
}
