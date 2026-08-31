import connectToDatabase from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { DashboardSettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await connectToDatabase();
  const settings = await Setting.find().lean();
  
  // Transform lean array into simple key-value object
  const settingsData: Record<string, string> = {};
  settings.forEach((s: any) => {
    settingsData[s.key] = s.value;
  });

  return <DashboardSettingsClient settingsData={settingsData} />;
}
