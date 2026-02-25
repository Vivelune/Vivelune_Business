// src/app/api/openai/models/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's OpenAI credential
    const credential = await prisma.credential.findFirst({
      where: {
        userId,
        type: 'OPENAI',
      },
    });

    if (!credential) {
      return NextResponse.json({ error: 'No OpenAI credential found' }, { status: 404 });
    }

    // Fetch models from OpenAI
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${decrypt(credential.value)}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models from OpenAI');
    }

    const data = await response.json();
    
    // Filter to chat models only (optional)
    const chatModels = data.data.filter((model: any) => 
      model.id.includes('gpt') || 
      model.id.includes('o1') || 
      model.id.includes('o3')
    );

    return NextResponse.json({ models: chatModels });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}