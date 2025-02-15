import { db } from "@/drizzle/db";
import { NextResponse } from "next/server";

// This will handle the GET request to /api/packaging
export async function GET() {
  try {
    // Query the database
    const invoice = await db.query.invoiceTable.findMany({
        with: {
            user: true
        }
    });
    
    // Return the users as a JSON response
    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
