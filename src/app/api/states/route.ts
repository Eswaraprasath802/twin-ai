/**
 * TWIN AI — States & Districts API
 */
import { NextResponse } from "next/server";
import { INDIA_STATES } from "@/lib/india-data";

export async function GET() {
  return NextResponse.json({ states: INDIA_STATES });
}
