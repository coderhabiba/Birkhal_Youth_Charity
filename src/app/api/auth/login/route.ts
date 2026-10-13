import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { getJwtSecret } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limiting: max 5 failed attempts per 15 minutes per IP
    const rateCheck = checkRateLimit(ip, 'admin_login', 5, 15 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `অনেকবার ভুল চেষ্টা করা হয়েছে। অনুগ্রহ করে ${Math.ceil(rateCheck.resetSeconds / 60)} মিনিট পর আবার চেষ্টা করুন। (Too many attempts. Locked for security.)`,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'ভুল ফরম্যাট' }, { status: 400 });
    }

    const { email, password } = body;

    // Strict string checks
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'ইমেইল বা পাসওয়ার্ডের ফরম্যাট সঠিক নয়।' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@birkhalyouth.org').trim().toLowerCase();
    const adminPass = process.env.ADMIN_PASS || 'admin123';

    if (trimmedEmail === adminEmail && password === adminPass) {
      // Create JWT token
      const secret = getJwtSecret();
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
      return NextResponse.json(
        {
          success: false,
          error: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।',
          remainingAttempts: rateCheck.remaining,
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'সার্ভার সমস্যা হয়েছে।' }, { status: 500 });
  }
}
