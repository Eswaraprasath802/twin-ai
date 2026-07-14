/**
 * TWIN AI — Smart Alert System API
 * Returns active alerts with AI-generated recommendations
 */
import { NextResponse } from "next/server";
import { generateAlerts } from "@/lib/india-data";

export async function GET() {
  const alerts = generateAlerts();
  return NextResponse.json({
    alerts,
    totalActive: alerts.length,
    timestamp: new Date().toISOString(),
  });
}
