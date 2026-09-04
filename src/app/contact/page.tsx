import connectToDatabase from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { ContactClient } from "./contact-client";

export const revalidate = 60;

export default async function ContactPage() {
  await connectToDatabase();
  const settings = await Setting.find().lean();

  const settingsMap: Record<string, string> = {};
  settings.forEach((s: any) => {
    settingsMap[s.key] = s.value;
  });

  return <ContactClient settings={settingsMap} />;
}
