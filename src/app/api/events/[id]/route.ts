import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/models/Event';
import ActivityLog from '@/models/ActivityLog';
import { revalidatePath } from 'next/cache';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await connectToDatabase();

    const updatedEvent = await Event.findByIdAndUpdate(id, data, { new: true });
    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Update",
        module: "Events",
        details: `Updated event: ${updatedEvent.title} (${updatedEvent.status})`
      });
    } catch (e) {}

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/dashboard/events");

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Delete",
        module: "Events",
        details: `Deleted event: ${deletedEvent.title}`
      });
    } catch (e) {}

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/dashboard/events");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete event" }, { status: 500 });
  }
}
