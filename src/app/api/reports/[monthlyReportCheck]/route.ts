// pages/api/users/[userId].ts

import { db } from '@/drizzle/db';
import { monthlyReport } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// API route handler for GET requests
export async function GET(request: Request, { params }: { params: { monthDate: string, month: string } }) {
  const { monthDate, month } = await params; // Get the userId from the URL
    // Query the database for the user by `userId`
    const reportCheck = await db
      .query
      .monthlyReport
      .findMany({
        where: eq(monthlyReport.monthDate, monthDate) && eq(monthlyReport.month, month)
      })

      if (!reportCheck) {
        return NextResponse.json({ message: 'reports not found' }, { status: 404 });
      }
      return NextResponse.json(reportCheck);
}
