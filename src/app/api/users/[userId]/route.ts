// pages/api/users/[userId].ts

import { db } from '@/drizzle/db';
import { usersTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// API route handler for GET requests
export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = await params; // Get the userId from the URL
    // Query the database for the user by `userId`
    const user = await db
      .query
      .usersTable
      .findMany({
        where: eq(usersTable.id, parseInt(userId))
      })

      if (!user) {
        return NextResponse.json({ message: 'user not found' }, { status: 404 });
      }
      return NextResponse.json(user);
}
