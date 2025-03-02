import { db } from "@/drizzle/db";
import { NextResponse } from "next/server";

// This will handle the GET request to /api/packaging
export async function GET() {
  try {
    // Query the database
    const monthlyReports = await db.query.monthlyReport.findMany();
    
    // Return the users as a JSON response
    return NextResponse.json(monthlyReports);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch monthly reports" }, { status: 500 });
  }
}
