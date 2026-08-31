import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  // Protect /dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretjwtkeybirkhal2026');
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      // Token is invalid or expired
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // Prevent logged in admins from seeing the login page
  if (request.nextUrl.pathname === '/login') {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretjwtkeybirkhal2026');
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (err) {
        // Ignore if invalid
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
