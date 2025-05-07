import { db } from "@/drizzle/db";
import { NextResponse } from "next/server";

// This will handle the GET request to /api/users
export async function GET() {
  try {
    // Query the database
    const notifications = await db.query.notificationsTable.findMany({
        with: {
            users: true
        }
    });
    
    // Return the users as a JSON response
    return NextResponse.json(notifications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
