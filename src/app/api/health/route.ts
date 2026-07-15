import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    const mongoConfigured = Boolean(process.env.MONGODB_URI);

    if (mongoConfigured) {
      const { db } = await connectToDatabase();
      await db.command({ ping: 1 });
    }

    return NextResponse.json({
      status: "healthy",
      service: "TWIN AI",
      timestamp: new Date().toISOString(),
      database: mongoConfigured ? "connected" : "not configured",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
