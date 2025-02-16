// pages/api/users/[userId].ts

import { db } from '@/drizzle/db';
import { invoiceTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// API route handler for GET requests
export async function GET(request: Request, { params }: { params: { invoiceId: string } }) {
  const { invoiceId } = await params; // Get the userId from the URL
    // Query the database for the user by `userId`
    const invoices = await db
      .query
      .invoiceTable
      .findMany({
        where: eq(invoiceTable.id, parseInt(invoiceId)),
        with:{
          invoiceItems: true
        }
      })

      if (!invoices) {
        return NextResponse.json({ message: 'invoices not found' }, { status: 404 });
      }
      return NextResponse.json(invoices);
}
