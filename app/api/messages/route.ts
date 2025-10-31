import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.execute(
      'SELECT * FROM messages ORDER BY created_at DESC LIMIT 50'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, content } = await request.json();
    
    if (!username || !content) {
      return NextResponse.json({ error: 'Username and content required' }, { status: 400 });
    }

    await db.execute(
      'INSERT INTO messages (username, content) VALUES (?, ?)',
      [username, content]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
