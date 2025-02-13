import { db } from "@/drizzle/db";
import { NextResponse } from "next/server";

// This will handle the GET request to /api/users
export async function GET() {
  try {
    // Query the database
    const bills = await db.query.Bills.findMany({
        with: {
            currency: true
        }
    });
    
    // Return the users as a JSON response
    return NextResponse.json(bills);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bills" }, { status: 500 });
  }
}
