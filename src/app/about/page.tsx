import connectToDatabase from "@/lib/mongodb";
import Setting from "@/models/Setting";
import Committee from "@/models/Committee";
import { AboutClient } from "./about-client";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let settingsMap: Record<string, string> = {};
  let committeeMembers: any[] = [];

  try {
    await connectToDatabase();
    
    const [rawSettings, rawCommittee] = await Promise.all([
      Setting.find().lean(),
      Committee.find().sort({ createdAt: 1 }).lean(),
    ]);

    rawSettings.forEach((s: any) => {
      settingsMap[s.key] = s.value;
    });

    committeeMembers = rawCommittee.map((c: any) => ({
      ...c,
      _id: c._id.toString(),
      createdAt: c.createdAt ? c.createdAt.toISOString() : null,
    }));
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
