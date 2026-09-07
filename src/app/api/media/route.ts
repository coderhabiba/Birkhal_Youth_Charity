import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Media from '@/models/Media';
import ActivityLog from '@/models/ActivityLog';
import { processBase64Image } from '@/lib/uploadHelper';
import { cachedQuery, invalidateCache } from '@/lib/cache';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch media with cache
    const getMediaData = async () => {
      return await Media.find().sort({ createdAt: -1 }).lean();
    };
    
    const media = await cachedQuery('media-all', getMediaData, 60_000);
    return NextResponse.json(media);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    const imageUrl = processBase64Image(data.url, 'media');

    const newMedia = await Media.create({
      title: data.title || 'Uploaded Asset',
      url: imageUrl,
      size: data.size || '1.2 MB',
      tag: data.tag || 'GALLERY',
      isDoc: data.isDoc || false,
      description: data.description || '',
      date: data.date || '',
    });

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Create",
        module: "Media",
        details: `Uploaded new media item: ${newMedia.title}`
      });
    } catch (e) {}

    invalidateCache('media-all');
    invalidateCache('home-page-data');
    revalidatePath('/');
    revalidatePath('/dashboard/media');

    return NextResponse.json(newMedia, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save media" }, { status: 400 });
  }
}
