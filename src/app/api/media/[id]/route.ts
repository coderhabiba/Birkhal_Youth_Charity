import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Media from '@/models/Media';
import ActivityLog from '@/models/ActivityLog';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectToDatabase();

    const updatedMedia = await Media.findByIdAndUpdate(
      id,
      {
        title: body.title,
        tag: body.tag,
        url: body.url,
        isDoc: body.isDoc ?? false,
      },
      { new: true }
    );

    if (!updatedMedia) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Edit",
        module: "Media",
        details: `Updated media item: ${updatedMedia.title}`
      });
    } catch (e) {}

    return NextResponse.json(updatedMedia);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update media" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deletedMedia = await Media.findByIdAndDelete(id);
    if (!deletedMedia) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Delete",
        module: "Media",
        details: `Deleted media item: ${deletedMedia.title}`
      });
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete media" }, { status: 500 });
  }
}
