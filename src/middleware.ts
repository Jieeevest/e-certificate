import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from './lib/auth/authMiddleware';

export function middleware(request: NextRequest) {
  return authMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (to avoid Edge Runtime issues with Node.js modules)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};