import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  try {
    console.log(`📡 tRPC request: ${req.method} ${req.url}`);
    
    return await fetchRequestHandler({
      endpoint: '/api/trpc',
      req,
      router: appRouter,
      createContext: () => createTRPCContext(),
      onError: ({ error, type, path, input, ctx, req }) => {
        console.error('❌ tRPC error:', {
          type,
          path,
          error: error.message,
          code: error.code,
        });
      },
    });
  } catch (error) {
    console.error('❌ tRPC handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

export { handler as GET, handler as POST };