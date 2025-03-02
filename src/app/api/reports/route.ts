import { db } from "@/drizzle/db";
import { reportTable } from "@/drizzle/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

// This will handle the GET request to /api/packaging
export async function GET() {
  try {
    // Query the database
    const reportSetting = await db.query.reportTable.findMany({
        orderBy: [desc(reportTable.id)],
        limit: 1,
    });
    
    // Return the users as a JSON response
    return NextResponse.json(reportSetting);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch report settings" }, { status: 500 });
  }
}
