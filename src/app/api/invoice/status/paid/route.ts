import { db } from "@/drizzle/db";
import { invoiceTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// This will handle the GET request to /api/packaging
export async function GET() {
  try {
    // Query the database
    const stock = await db.query.invoiceTable.findMany({
        where: eq(invoiceTable.invoiceStatus, "paid"),
        with: {
          invoiceItems: true
        }
    });
    
    // Return the users as a JSON response
    return NextResponse.json(stock);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 });
  }
}
