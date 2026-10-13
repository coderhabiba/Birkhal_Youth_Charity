import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: filePathParams } = await params;

    // Strict path traversal prevention:
    // 1. Sanitize segments using path.basename to strip any ../, ..\, null bytes
    const safeParams = (filePathParams || []).map(p => path.basename(p));
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    const filePath = path.resolve(uploadsDir, ...safeParams);

    // 2. Ensure resolved path is strictly inside public/uploads
    if (!filePath.startsWith(uploadsDir) || !fs.existsSync(filePath)) {
      return new NextResponse('Not found', { status: 404 });
    }

    // 3. Ensure it is a file and not a directory
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return new NextResponse('Not found', { status: 404 });
    }

    const file = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.pdf') contentType = 'application/pdf';

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error serving upload file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
