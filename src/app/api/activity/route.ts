import { db } from "@/drizzle/db";
import { activityTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// This will handle the GET request to /api/packaging
export async function GET() {
  try {
    // Query the database
    const activities = await db.query.activityTable.findMany({
        with:{
            users: true
        }
    });
    
    // Return the users as a JSON response
    return NextResponse.json(activities);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
