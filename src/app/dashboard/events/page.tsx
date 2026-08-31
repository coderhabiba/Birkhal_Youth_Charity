import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import { DashboardEventsClient } from "./events-client";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  await connectToDatabase();
  const rawEvents = await Event.find().sort({ date: 1 }).lean();

  const events = rawEvents.map((e: any) => ({
    ...e,
    _id: e._id.toString(),
    date: e.date ? e.date.toISOString() : null,
    createdAt: e.createdAt ? e.createdAt.toISOString() : null,
  }));

  return <DashboardEventsClient events={events} />;
}
