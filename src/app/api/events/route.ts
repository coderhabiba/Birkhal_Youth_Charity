import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/models/Event';
import ActivityLog from '@/models/ActivityLog';
import { revalidatePath } from 'next/cache';
import { processBase64Image } from '@/lib/uploadHelper';
import { cachedQuery, invalidateCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

async function getEvents() {
  await connectToDatabase();
  return await Event.find().sort({ date: 1 }).limit(200).lean();
}

export async function GET() {
  try {
    const events = await cachedQuery('api-events', getEvents, 30_000);
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();

    if (data.image) {
      data.image = processBase64Image(data.image, 'event');
    }
    if (!data.approvalStatus) {
      data.approvalStatus = 'approved';
    }

    const newEvent = new Event(data);
    await newEvent.save();

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Create",
        module: "Events",
        details: `Created new event: ${newEvent.title} (${newEvent.status})`
      });
    } catch (e) {}

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    invalidateCache('dashboard-events');
    invalidateCache('api-events');

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
