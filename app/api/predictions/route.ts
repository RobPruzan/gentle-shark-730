import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.execute(`
      SELECT 
        p.*,
        COALESCE(SUM(CASE WHEN v.vote_type = 'up' THEN 1 ELSE 0 END), 0) as upvotes,
        COALESCE(SUM(CASE WHEN v.vote_type = 'down' THEN 1 ELSE 0 END), 0) as downvotes,
        COUNT(v.id) as total_votes
      FROM predictions p
      LEFT JOIN votes v ON p.id = v.prediction_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, question, prediction_value } = await request.json();
    
    if (!username || !question || prediction_value === undefined) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    await db.execute(
      'INSERT INTO predictions (username, question, prediction_value) VALUES (?, ?, ?)',
      [username, question, prediction_value]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating prediction:', error);
    return NextResponse.json({ error: 'Failed to create prediction' }, { status: 500 });
  }
}
