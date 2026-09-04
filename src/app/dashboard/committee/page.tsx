import connectToDatabase from "@/lib/mongodb";
import Committee from "@/models/Committee";
import { DashboardCommitteeClient } from "./committee-client";
import { cachedQuery } from "@/lib/cache";

export const revalidate = 0;

async function getDashboardCommittee() {
  await connectToDatabase();
  const rawMembers = await Committee.find().sort({ createdAt: 1 }).lean();
  return rawMembers.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt ? m.createdAt.toISOString() : null,
  }));
}

export default async function CommitteePage() {
  let members: any[] = [];
  try {
    members = await cachedQuery('dashboard-committee', getDashboardCommittee, 30_000);
  } catch (e) {
    console.error("Failed to load dashboard committee:", e);
  }

  return <DashboardCommitteeClient members={members} />;
}

