// pages/api/users/[userId].ts

import { db } from '@/drizzle/db';
import { NextResponse } from 'next/server';

// API route handler for GET requests
export async function GET() {
    const invoiceItems = await db
    .query
    .invoiceItemsTable
    .findMany({
      with:{
        product: true
      }
    })

      if (!invoiceItems) {
        return NextResponse.json({ message: 'invoices not found' }, { status: 404 });
      }
      return NextResponse.json(invoiceItems);
}