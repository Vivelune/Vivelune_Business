// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/api/webhooks/(.*)',
  '/api/(.*)',
  '/contact',
  '/privacy',
  '/terms',
]);

export default clerkMiddleware(async (auth, request) => {
  // Pass the whole request object to isPublicRoute
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|.*\\..*|/$).*)',
    '/(api|trpc)(.*)',
  ],
};