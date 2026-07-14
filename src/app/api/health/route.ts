import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  try {
    if (db) {
      await db.execute(sql`SELECT 1`);
    }

    return NextResponse.json({
      status: "healthy",
      service: "TWIN AI",
      timestamp: new Date().toISOString(),
      database: db ? "connected" : "not configured",
    });
  } catch {
    return NextResponse.json({ status: "unhealthy" }, { status: 500 });
  }
}
