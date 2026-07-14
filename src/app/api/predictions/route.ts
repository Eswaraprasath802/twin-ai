/**
 * TWIN AI — AI Predictions API
 * Returns ML-powered predictions for climate, agriculture, disasters
 */
import { NextRequest, NextResponse } from "next/server";
import { generatePredictions, INDIA_STATES } from "@/lib/india-data";

export async function GET(request: NextRequest) {
  const stateId = parseInt(request.nextUrl.searchParams.get("stateId") || "1");
  const state = INDIA_STATES.find(s => s.id === stateId);
  if (!state) return NextResponse.json({ error: "State not found" }, { status: 404 });

  const predictions = generatePredictions(stateId);

  return NextResponse.json({
    state: state.name,
    predictions,
    modelVersion: "TWIN-AI v3.2.1",
    lastTrained: "2025-12-15T00:00:00Z",
    timestamp: new Date().toISOString(),
  });
}
