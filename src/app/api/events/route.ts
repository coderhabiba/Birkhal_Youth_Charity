import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/models/Event';
import ActivityLog from '@/models/ActivityLog';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ date: 1 }).lean();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();
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

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
