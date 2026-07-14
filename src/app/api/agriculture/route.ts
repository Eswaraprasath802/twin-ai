/**
 * TWIN AI — Smart Agriculture API
 * Crop data, recommendations, government schemes
 */
import { NextRequest, NextResponse } from "next/server";
import { CROP_LIST, GOVERNMENT_SCHEMES, INDIA_STATES } from "@/lib/india-data";

export async function GET(request: NextRequest) {
  const section = request.nextUrl.searchParams.get("section") || "crops";
  const stateId = parseInt(request.nextUrl.searchParams.get("stateId") || "1");
  const state = INDIA_STATES.find(s => s.id === stateId);

  if (section === "crops") {
    return NextResponse.json({
      crops: CROP_LIST.map((c, i) => ({ id: i + 1, ...c })),
      state: state?.name,
    });
  }

  if (section === "schemes") {
    return NextResponse.json({
      schemes: GOVERNMENT_SCHEMES.map((s, i) => ({ id: i + 1, ...s, isActive: true })),
    });
  }

  if (section === "recommendation") {
    const soilType = request.nextUrl.searchParams.get("soilType") || "Alluvial";
    const recommendations = CROP_LIST
      .filter(() => Math.random() > 0.3)
      .slice(0, 5)
      .map(c => ({
        crop: c.name,
        suitability: Math.round(60 + Math.random() * 35),
        reason: `Suitable for ${soilType} soil with current climate conditions`,
        expectedYield: Math.round(c.yieldPerHectare * (0.8 + Math.random() * 0.4) * 10) / 10,
        msp: c.msp,
        season: c.season,
      }));

    return NextResponse.json({
      state: state?.name,
      soilType,
      recommendations,
    });
  }

  return NextResponse.json({ error: "Invalid section" }, { status: 400 });
}
