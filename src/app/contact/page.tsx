import connectToDatabase from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { ContactClient } from "./contact-client";
import { cachedQuery } from "@/lib/cache";

export const revalidate = 60;

async function getContactData() {
  await connectToDatabase();
  const settings = await Setting.find().lean();

  const settingsMap: Record<string, string> = {};
  settings.forEach((s: any) => {
    settingsMap[s.key] = s.value;
  });

  return settingsMap;
}

export default async function ContactPage() {
  let settingsMap: Record<string, string> = {};

  try {
    settingsMap = await cachedQuery('contact-page-data', getContactData, 60_000);
  } catch (e) {
    console.error("Failed to load contact data:", e);
  }

  return <ContactClient settings={settingsMap} />;
}

