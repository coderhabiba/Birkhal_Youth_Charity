import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import Setting from "@/models/Setting";
import { EventsPageClient } from "./events-client";

export const dynamic = "force-dynamic";

export default async function PublicEventsPage() {
  await connectToDatabase();

  const [rawEvents, rawSettings] = await Promise.all([
    Event.find().sort({ date: 1 }).lean(),
    Setting.find().lean(),
  ]);

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

  return <EventsPageClient events={events} settings={settingsMap} />;
}
