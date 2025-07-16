import { NextRequest, NextResponse } from 'next/server';

// Simple middleware that only checks for token existence, not validity
export function authMiddleware(request: NextRequest) {
  // Paths that don't require authentication
  const publicPaths = [
    '/',
    '/auth/login',
    '/api/auth/login',
    '/certificate',
    '/api/public',
  ];

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith('/api/auth/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/certificate/') ||
    request.nextUrl.pathname.startsWith('/api/public/')
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value;

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists, but we don't verify it here to avoid Edge Runtime issues
  // The actual API routes will verify the token
  return NextResponse.next();
}