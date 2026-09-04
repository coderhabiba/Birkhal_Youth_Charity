import connectToDatabase from "@/lib/mongodb";
import Setting from "@/models/Setting";
import Committee from "@/models/Committee";
import { AboutClient } from "./about-client";
import { cachedQuery } from "@/lib/cache";

export const revalidate = 60;

async function getAboutData() {
  await connectToDatabase();
  const [rawSettings, rawCommittee] = await Promise.all([
    Setting.find().lean(),
    Committee.find().sort({ createdAt: 1 }).lean()
  ]);

  const settingsMap: Record<string, string> = {};
  rawSettings.forEach((s: any) => {
    settingsMap[s.key] = s.value;
  });

  const committeeMembers = rawCommittee.map((c: any) => ({
    ...c,
    _id: c._id.toString(),
    createdAt: c.createdAt ? c.createdAt.toISOString() : null,
  }));

  return { settingsMap, committeeMembers };
}

export default async function AboutPage() {
  let settingsMap: Record<string, string> = {};
  let committeeMembers: any[] = [];

  try {
    const data = await cachedQuery('about-page-data', getAboutData, 60_000);
    settingsMap = data.settingsMap;
    committeeMembers = data.committeeMembers;
  } catch (e) {
    console.error("Failed to load About page data", e);
  }

  return (
    <AboutClient 
      settings={settingsMap} 
      committeeMembers={committeeMembers} 
    />
  );
}

