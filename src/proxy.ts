import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define public API routes that any visitor can access without an admin token
function isPublicApiRoute(pathname: string, method: string): boolean {
  // Auth endpoints
  if (pathname === '/api/auth/login' || pathname === '/api/auth/logout' || pathname === '/api/auth/status') {
    return true;
  }

  // Public asset/image serving
  if (pathname.startsWith('/api/uploads/')) {
    return true;
  }

  // Public submissions
  if (method === 'POST') {
    if (
      pathname === '/api/donations' || // Public donation submission
      pathname === '/api/contact' ||   // Public contact form
      pathname === '/api/members' ||   // Public membership application
      pathname === '/api/reviews'      // Public testimonial submission
    ) {
      return true;
    }
  }

  // Public GET endpoints
  if (method === 'GET') {
    if (
      pathname === '/api/settings' ||
      pathname === '/api/events' ||
      pathname.startsWith('/api/events/') ||
      pathname === '/api/committee' ||
      pathname === '/api/media' ||
      pathname === '/api/reviews' ||
      pathname === '/api/roles' ||
      pathname === '/api/pages' ||
      pathname.startsWith('/api/pages/')
    ) {
      return true;
    }
  }

  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // Extract admin token from cookies or authorization header
  const token =
    request.cookies.get('admin_token')?.value ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  let isValidAdmin = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'supersecretjwtkeybirkhal2026'
      );
      const { payload } = await jwtVerify(token, secret);
      if (payload.role === 'admin') {
        isValidAdmin = true;
      }
    } catch {
      isValidAdmin = false;
    }
  }

  // 1. Protect Dashboard Routes
  if (pathname.startsWith('/dashboard')) {
    if (!isValidAdmin) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      if (token) {
        response.cookies.delete('admin_token');
      }
      return response;
    }
    return NextResponse.next();
  }

  // 2. Prevent already logged-in admin from seeing login page
  if (pathname === '/login') {
    if (isValidAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 3. Protect Admin API Routes from unauthorized access
  if (pathname.startsWith('/api/')) {
    if (!isPublicApiRoute(pathname, method)) {
      if (!isValidAdmin) {
        return NextResponse.json(
          {
            error: 'অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে প্রথমে অ্যাডমিন প্যানেলে লগইন করুন।',
            code: 'UNAUTHORIZED_ACCESS',
          },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/api/:path*',
  ],
};
