import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Setting from '@/models/Setting';
import { processBase64Image } from '@/lib/uploadHelper';
import { invalidateCacheByPrefix } from '@/lib/cache';
import { isAuthorizedAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await Setting.find().lean();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await isAuthorizedAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "অননুমোদিত অ্যাক্সেস। অ্যাডমিন লগইন আবশ্যক।" }, { status: 401 });
    }

    const data = await request.json().catch(() => null);
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "ভুল ডেটা ফরম্যাট।" }, { status: 400 });
    }

    await connectToDatabase();

    // Assuming data is an array of { key, value, category }
    for (const item of data) {
      if (!item.key || typeof item.key !== 'string') continue;

      const safeKey = String(item.key).trim();
      const val = typeof item.value === 'string' && item.value.startsWith('data:image')
        ? processBase64Image(item.value, `setting_${safeKey}`)
        : item.value;

      await Setting.findOneAndUpdate(
        { key: safeKey },
        { value: val, category: typeof item.category === 'string' ? item.category : 'general' },
        { upsert: true, new: true }
      );
    }

    invalidateCacheByPrefix('home-page-data');
    invalidateCacheByPrefix('about-page-data');
    invalidateCacheByPrefix('contact-page-data');
    invalidateCacheByPrefix('public-');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
