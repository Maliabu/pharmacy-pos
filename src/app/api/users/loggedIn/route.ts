import { db } from "@/drizzle/db";
import { usersTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// This will handle the GET request to /api/users
export async function GET() {
  try {
    // Query the database
    const users = await db.query.usersTable.findMany({
        where: eq(usersTable.isLoggedIn, true)
    });
    
    // Return the users as a JSON response
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

