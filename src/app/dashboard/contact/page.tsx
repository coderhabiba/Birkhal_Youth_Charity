import connectToDatabase from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { DashboardContactClient } from './contact-client';
import { cachedQuery } from '@/lib/cache';

export const revalidate = 0;

async function getDashboardContacts() {
  await connectToDatabase();
  const rawMessages = await Contact.find().sort({ createdAt: -1 }).lean();
  return rawMessages.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt ? m.createdAt.toISOString() : null,
  }));
}

export default async function ContactPage() {
  let messages: any[] = [];
  try {
    messages = await cachedQuery('dashboard-contacts', getDashboardContacts, 30_000);
  } catch (e) {
    console.error("Failed to load dashboard contacts:", e);
  }

  return <DashboardContactClient messages={messages} />;
}

