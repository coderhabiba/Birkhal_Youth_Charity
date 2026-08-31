import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Media from '@/models/Media';
import ActivityLog from '@/models/ActivityLog';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Auto-migrate legacy /support*.jpeg URLs to new high-res matching images
    await Media.updateMany({ url: '/support1.jpeg' }, { url: '/up-1.jpeg' });
    await Media.updateMany({ url: '/support2.jpeg' }, { url: '/ai_relief.jpg' });
    await Media.updateMany({ url: '/support3.jpeg' }, { url: '/ai_education.jpg' });
    await Media.updateMany({ url: '/support4.jpeg' }, { url: '/ai_plantation.jpg' });

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

    const newMedia = await Media.create({
      title: data.title || 'Uploaded Asset',
      url: data.url,
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
