import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@birkhalyouth.org';
    const adminPass = process.env.ADMIN_PASS || 'admin123';

    if (email === adminEmail && password === adminPass) {
      // Create JWT token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretjwtkeybirkhal2026');
      const token = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
