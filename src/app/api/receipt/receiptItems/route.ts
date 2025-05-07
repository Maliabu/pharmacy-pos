// pages/api/users/[userId].ts

import { db } from '@/drizzle/db';
import { NextResponse } from 'next/server';

// API route handler for GET requests
export async function GET() {
    const receipts = await db
      .query
      .receiptTable
      .findMany({
        with:{
          receipt: true,
          product: true
        }
      })

      if (!receipts) {
        return NextResponse.json({ message: 'receipt items not found' }, { status: 404 });
      }
      return NextResponse.json(receipts);
}
