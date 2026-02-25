// src/app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.NODE_ENV === "development" 
    ? process.env.DATABASE_URL_DEVELOPMENT 
    : process.env.DATABASE_URL;

  // Mask the password for security
  const maskedUrl = dbUrl?.replace(/:[^:@]*@/, ':****@');

  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: maskedUrl || 'not set',
    databaseUrlDev: process.env.DATABASE_URL_DEVELOPMENT ? '***set***' : 'not set',
    databaseUrlProd: process.env.DATABASE_URL ? '***set***' : 'not set',
  });
}