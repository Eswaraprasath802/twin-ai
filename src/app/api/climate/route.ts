/**
 * TWIN AI — Climate Data API
 * Returns real-time climate readings for states
 */
import { NextRequest, NextResponse } from "next/server";
import { INDIA_STATES, generateClimateData } from "@/lib/india-data";

export async function GET(request: NextRequest) {
  const stateId = request.nextUrl.searchParams.get("stateId");

  if (stateId) {
    const data = generateClimateData(parseInt(stateId));
    if (!data) return NextResponse.json({ error: "State not found" }, { status: 404 });
    const state = INDIA_STATES.find(s => s.id === parseInt(stateId));
    return NextResponse.json({ state, climate: data });
  }

  // Return climate for all states
  const allData = INDIA_STATES.map(state => ({
    state,
    climate: generateClimateData(state.id),
  }));

  return NextResponse.json({ data: allData, timestamp: new Date().toISOString() });
}
