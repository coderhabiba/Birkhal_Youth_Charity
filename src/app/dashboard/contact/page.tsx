import connectToDatabase from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { DashboardContactClient } from './contact-client';

export const revalidate = 0; // Disable caching for this route so we always see fresh data

export default async function ContactPage() {
  await connectToDatabase();
  const rawMessages = await Contact.find().sort({ createdAt: -1 }).lean();

  const messages = rawMessages.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt ? m.createdAt.toISOString() : null,
  }));

  return <DashboardContactClient messages={messages} />;
}
