import connectToDatabase from "@/lib/mongodb";
import Setting from "@/models/Setting";
import Committee from "@/models/Committee";
import { AboutClient } from "./about-client";

export const revalidate = 60;

export default async function AboutPage() {
  await connectToDatabase();
  
  const [rawSettings, rawCommittee] = await Promise.all([
    Setting.find().lean(),
    Committee.find().sort({ createdAt: 1 }).lean(),
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

  return (
    <AboutClient 
      settings={settingsMap} 
      committeeMembers={committeeMembers} 
    />
  );
}
