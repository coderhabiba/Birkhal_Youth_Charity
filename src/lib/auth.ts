import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'supersecretjwtkeybirkhal2026';
  return new TextEncoder().encode(secret);
}

/**
 * Validates whether the given JWT string is a valid, unexpired admin token
 */
export async function verifyAdminToken(token?: string | null): Promise<boolean> {
  if (!token || typeof token !== 'string') return false;
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload.role === 'admin';
  } catch (error) {
    return false;
  }
}

/**
 * Extracts and verifies admin authorization from a Request or NextRequest
 * Supports cookies ('admin_token') and Authorization header ('Bearer <token>')
 */
export async function isAuthorizedAdmin(request: Request | NextRequest): Promise<boolean> {
  // Check cookie
  let token: string | undefined;

  if ('cookies' in request && typeof request.cookies.get === 'function') {
    token = request.cookies.get('admin_token')?.value;
  }

  // Fallback to cookie header string if needed
  if (!token) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/admin_token=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  // Fallback to Bearer token
  if (!token) {
    const authHeader = request.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  return await verifyAdminToken(token);
}
