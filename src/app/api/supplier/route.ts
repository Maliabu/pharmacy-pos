import { db } from "@/drizzle/db";
import { NextResponse } from "next/server";

// This will handle the GET request to /api/users
export async function GET() {
  try {
    // Query the database
    const suppliers = await db.query.supplierTable.findMany();
    
    // Return the users as a JSON response
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }
}
