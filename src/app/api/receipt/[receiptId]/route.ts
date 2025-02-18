// pages/api/users/[userId].ts

import { db } from '@/drizzle/db';
import { receipt } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// API route handler for GET requests
export async function GET(request: Request, { params }: { params: { receiptId: string } }) {
  const { receiptId } = await params; // Get the userId from the URL
    // Query the database for the user by `userId`
    const receipts = await db
      .query
      .receipt
      .findMany({
        where: eq(receipt.id, parseInt(receiptId)),
        with:{
          receipts: true,
          user: true
        }
      })

      if (!receipts) {
        return NextResponse.json({ message: 'receipts not found' }, { status: 404 });
      }
      return NextResponse.json(receipts);
}
