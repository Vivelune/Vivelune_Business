import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    return NextResponse.json({
      authenticated: !!userId,
      userId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Auth check failed', details: String(error) },
      { status: 500 }
    );
  }
}