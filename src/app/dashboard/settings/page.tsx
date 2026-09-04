import connectToDatabase from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { DashboardSettingsClient } from "./settings-client";
import { cachedQuery } from "@/lib/cache";

export const revalidate = 0;

async function getDashboardSettings() {
  await connectToDatabase();
  const settings = await Setting.find().lean();
  const settingsData: Record<string, string> = {};
  settings.forEach((s: any) => {
    settingsData[s.key] = s.value;
  });
  return settingsData;
}

export default async function SettingsPage() {
  let settingsData: Record<string, string> = {};
  try {
    settingsData = await cachedQuery('dashboard-settings', getDashboardSettings, 30_000);
  } catch (e) {
    console.error("Failed to load dashboard settings:", e);
  }

  return <DashboardSettingsClient settingsData={settingsData} />;
}

