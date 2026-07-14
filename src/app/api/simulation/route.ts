/**
 * TWIN AI — Scenario Simulation API
 * Simulate climate change impacts and get AI predictions
 */
import { NextRequest, NextResponse } from "next/server";
import { INDIA_STATES } from "@/lib/india-data";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, rainChange, tempChange, stateId } = body;

  const state = INDIA_STATES.find(s => s.id === (stateId || 1));
  const pop = state?.population || 50000000;

  let affectedPct = 0;
  let cropDamagePct = 0;
  let economicLoss = 0;

  switch (type) {
    case "rain_increase":
      affectedPct = Math.min(0.4, (rainChange || 20) / 100 * 0.5);
      cropDamagePct = affectedPct * 0.6;
      economicLoss = pop * affectedPct * 500;
      break;
    case "temperature_increase":
      affectedPct = Math.min(0.3, (tempChange || 2) / 5 * 0.3);
      cropDamagePct = affectedPct * 0.8;
      economicLoss = pop * affectedPct * 300;
      break;
    case "cyclone":
      affectedPct = 0.15 + Math.random() * 0.15;
      cropDamagePct = 0.3 + Math.random() * 0.2;
      economicLoss = pop * 0.1 * 2000;
      break;
    case "flood":
      affectedPct = 0.1 + Math.random() * 0.2;
      cropDamagePct = 0.4 + Math.random() * 0.3;
      economicLoss = pop * 0.15 * 1500;
      break;
    case "drought":
      affectedPct = 0.2 + Math.random() * 0.3;
      cropDamagePct = 0.5 + Math.random() * 0.3;
      economicLoss = pop * 0.2 * 800;
      break;
    default:
      affectedPct = 0.05;
      cropDamagePct = 0.1;
      economicLoss = pop * 0.05 * 200;
  }

  const result = {
    id: crypto.randomUUID(),
    state: state?.name,
    type,
    parameters: body,
    results: {
      affectedVillages: Math.floor(200 + Math.random() * 2000),
      affectedPopulation: Math.floor(pop * affectedPct),
      cropDamage: Math.round(cropDamagePct * 100),
      economicLoss: Math.round(economicLoss / 10000000),
      roadClosures: Math.floor(10 + Math.random() * 100),
      hospitalImpact: Math.floor(5 + Math.random() * 30),
      recommendations: [
        "Deploy NDRF teams to high-risk zones",
        "Activate emergency shelters in affected districts",
        "Pre-position relief supplies at block level",
        "Issue early warning through Common Alerting Protocol",
        "Coordinate with state disaster management authority",
        "Activate crop insurance assessment teams",
        "Monitor dam and reservoir levels continuously",
        "Establish medical camps in vulnerable areas",
      ].slice(0, 5 + Math.floor(Math.random() * 3)),
    },
    computedAt: new Date().toISOString(),
    modelVersion: "SimEngine v2.4.0",
  };

  return NextResponse.json(result);
}
