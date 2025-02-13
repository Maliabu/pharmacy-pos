import { db } from "@/drizzle/db";
import { NextResponse } from "next/server";

// This will handle the GET request to /api/users
export async function GET() {
  try {
    // Query the database
    const vendors = await db.query.vendorTable.findMany();
    
    // Return the users as a JSON response
    return NextResponse.json(vendors);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}
