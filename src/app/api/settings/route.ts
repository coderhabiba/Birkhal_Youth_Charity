import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Setting from '@/models/Setting';
import { processBase64Image } from '@/lib/uploadHelper';
import { invalidateCacheByPrefix } from '@/lib/cache';

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
    const data = await request.json();
    await connectToDatabase();
    // Assuming data is an array of { key, value, category }
    for (const item of data) {
      const val = typeof item.value === 'string' && item.value.startsWith('data:image')
        ? processBase64Image(item.value, `setting_${item.key}`)
        : item.value;

      await Setting.findOneAndUpdate(
        { key: item.key },
        { value: val, category: item.category || 'general' },
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
