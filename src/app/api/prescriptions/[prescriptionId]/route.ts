// pages/api/users/[userId].ts

import { db } from '@/drizzle/db';
import { prescriptionsTable} from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// API route handler for GET requests
export async function GET(request: Request, { params }: { params: { prescriptionId: string } }) {
  const { prescriptionId } = await params; // Get the userId from the URL
    // Query the database for the user by `userId`
    const prescriptions = await db
      .query
      .prescriptionsTable
      .findMany({
        where: eq(prescriptionsTable.id, parseInt(prescriptionId))
      })

      if (!prescriptions) {
        return NextResponse.json({ message: 'prescriptions not found' }, { status: 404 });
      }
      return NextResponse.json(prescriptions);
}
