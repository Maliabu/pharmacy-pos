import { db } from "@/drizzle/db";
import { NextResponse } from "next/server";

// This will handle the GET request to /api/packaging
export async function GET() {
  try {
    // Query the database
    const receipt = await db.query.receipt.findMany({
        with: {
            user: true,
            receipts: {
                with: {
                    product: true
                }
            }
        },
        orderBy: (receipt, { desc }) => [desc(receipt.createdAt)],
    });
    
    // Return the users as a JSON response
    return NextResponse.json(receipt);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch receipts" }, { status: 500 });
  }
}
