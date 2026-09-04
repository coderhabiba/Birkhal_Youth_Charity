import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Media from '@/models/Media';
import ActivityLog from '@/models/ActivityLog';
import { processBase64Image } from '@/lib/uploadHelper';

export async function GET() {
  try {
    await connectToDatabase();
    const media = await Media.find().sort({ createdAt: -1 }).lean();
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
    });

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Create",
        module: "Media",
        details: `Uploaded new media item: ${newMedia.title}`
      });
    } catch (e) {}

    return NextResponse.json({ success: true, media: newMedia }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save media" }, { status: 400 });
  }
}
