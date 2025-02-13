import { db } from "@/drizzle/db";
import { NextResponse } from "next/server";

// This will handle the GET request to /api/packaging
export async function GET() {
  try {
    // Query the database
    const packaging = await db.query.packagingTable.findMany();
    
    // Return the users as a JSON response
    return NextResponse.json(packaging);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch packaging" }, { status: 500 });
  }
}
