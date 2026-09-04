import connectToDatabase from "@/lib/mongodb";
import DonationEntry from "@/models/DonationEntry";
import Setting from "@/models/Setting";
import { DonationsClient } from "./donations-client";

export const dynamic = "force-dynamic";

export default async function PublicDonationsPage() {
  await connectToDatabase();
  const [rawDonations, rawSettings] = await Promise.all([
    DonationEntry.find({ status: 'Completed' }).sort({ createdAt: -1 }).lean(),
    Setting.find().lean(),
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

  return <DonationsClient donations={donations} settings={settingsMap} />;
}
