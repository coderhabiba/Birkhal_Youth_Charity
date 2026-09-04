import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import Setting from "@/models/Setting";
import { EventsPageClient } from "./events-client";
import { cachedQuery } from "@/lib/cache";

export const revalidate = 60;

async function getEventsData() {
  await connectToDatabase();
  const rawEvents = await Event.find().sort({ date: 1 }).lean();
  const rawSettings = await Setting.find().lean();

  const events = rawEvents.map((e: any) => ({
    ...e,
    _id: e._id.toString(),
    date: e.date ? e.date.toISOString() : null,
    createdAt: e.createdAt ? e.createdAt.toISOString() : null,
  }));

  const settingsMap: Record<string, string> = {};
  rawSettings.forEach((s: any) => {
    settingsMap[s.key] = s.value;
  });

  return { events, settingsMap };
}

export default async function PublicEventsPage() {
  let events: any[] = [];
  let settingsMap: Record<string, string> = {};

  try {
    const data = await cachedQuery('public-events', getEventsData, 60_000);
    events = data.events;
    settingsMap = data.settingsMap;
  } catch (e) {
    console.error("Failed to load events:", e);
  }

  return <EventsPageClient events={events} settings={settingsMap} />;
}

