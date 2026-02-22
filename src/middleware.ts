import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/sso-callback(.*)',
  '/api/webhooks/(.*)',
  '/api/trpc/(.*)', // TRPC handles auth internally
  '/api/(.*)', // All API routes are public (they handle auth internally)
  '/api/stripe/webhook',
  '/contact',
  '/workflows', // Fixed: added leading slash
  '/privacy',
  '/terms',
  '/agreement',
]);

export default clerkMiddleware(async (auth, request) => {
  // Log for debugging (remove in production)
  console.log('🛡️ Middleware:', {
    path: request.nextUrl.pathname,
    isPublic: isPublicRoute(request),
    method: request.method,
  });

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};