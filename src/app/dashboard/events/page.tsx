import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import { DashboardEventsClient } from "./events-client";
import { cachedQuery } from "@/lib/cache";

export const revalidate = 0;

async function getDashboardEvents() {
  await connectToDatabase();
  const rawEvents = await Event.find().sort({ date: 1 }).lean();
  return rawEvents.map((e: any) => ({
    ...e,
    _id: e._id.toString(),
    date: e.date ? e.date.toISOString() : null,
    createdAt: e.createdAt ? e.createdAt.toISOString() : null,
  }));
}

export default async function EventsPage() {
  let events: any[] = [];
  try {
    events = await cachedQuery('dashboard-events', getDashboardEvents, 30_000);
  } catch (e) {
    console.error("Failed to load dashboard events:", e);
  }

  return <DashboardEventsClient events={events} />;
}

