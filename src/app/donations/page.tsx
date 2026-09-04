import connectToDatabase from "@/lib/mongodb";
import DonationEntry from "@/models/DonationEntry";
import Setting from "@/models/Setting";
import { DonationsClient } from "./donations-client";
import { cachedQuery } from "@/lib/cache";

export const revalidate = 60;

async function getDonationsData() {
  await connectToDatabase();
  const [rawDonations, rawSettings] = await Promise.all([
    DonationEntry.find({ status: 'Completed' }).sort({ createdAt: -1 }).lean(),
    Setting.find().lean()
  ]);
  
  const donations = rawDonations.map((d: any) => ({
    ...d,
    _id: d._id.toString(),
    createdAt: d.createdAt ? d.createdAt.toISOString() : null,
  }));

  const settingsMap: Record<string, string> = {};
  rawSettings.forEach((s: any) => {
    settingsMap[s.key] = s.value;
  });

  return { donations, settingsMap };
}

export default async function PublicDonationsPage() {
  let donations: any[] = [];
  let settingsMap: Record<string, string> = {};

  try {
    const data = await cachedQuery('public-donations', getDonationsData, 60_000);
    donations = data.donations;
    settingsMap = data.settingsMap;
  } catch (e) {
    console.error("Failed to load donations:", e);
  }

  return <DonationsClient donations={donations} settings={settingsMap} />;
}

