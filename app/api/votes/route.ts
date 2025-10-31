import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { prediction_id, username, vote_type } = await request.json();
    
    if (!prediction_id || !username || !vote_type) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    // Delete existing vote if any
    await db.execute(
      'DELETE FROM votes WHERE prediction_id = ? AND username = ?',
      [prediction_id, username]
    );

    // Insert new vote
    await db.execute(
      'INSERT INTO votes (prediction_id, username, vote_type) VALUES (?, ?, ?)',
      [prediction_id, username, vote_type]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating vote:', error);
    return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 });
  }
}
