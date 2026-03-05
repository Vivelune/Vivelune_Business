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
  "/welcome",
  "/case-studies/roastandrecover",  
  "/docs",
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