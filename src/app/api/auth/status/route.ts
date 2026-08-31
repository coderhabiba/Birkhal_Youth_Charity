import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ isLoggedIn: false });
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretjwtkeybirkhal2026');
    await jwtVerify(token, secret);
    return NextResponse.json({ isLoggedIn: true });
  } catch (err) {
    return NextResponse.json({ isLoggedIn: false });
  }
}
