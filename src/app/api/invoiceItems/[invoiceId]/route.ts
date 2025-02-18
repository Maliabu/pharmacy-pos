// pages/api/users/[userId].ts

import { db } from '@/drizzle/db';
import { invoiceItemsTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// API route handler for GET requests
export async function GET(request: Request, { params }: { params: { invoiceId: string } }) {
  const { invoiceId } = await params; // Get the userId from the URL
    // Query the database for the user by `userId`
    const invoiceItems = await db
    .query
    .invoiceItemsTable
    .findMany({
      where: eq(invoiceItemsTable.invoice, parseInt(invoiceId)),
      with:{
        product: true
      }
    })

      if (!invoiceItems) {
        return NextResponse.json({ message: 'invoices not found' }, { status: 404 });
      }
      return NextResponse.json(invoiceItems);
}