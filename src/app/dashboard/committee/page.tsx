import connectToDatabase from "@/lib/mongodb";
import Committee from "@/models/Committee";
import { DashboardCommitteeClient } from "./committee-client";

export const dynamic = "force-dynamic";

export default async function CommitteePage() {
  await connectToDatabase();
  const rawMembers = await Committee.find().sort({ createdAt: 1 }).lean();

  const members = rawMembers.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt ? m.createdAt.toISOString() : null,
  }));

  return <DashboardCommitteeClient members={members} />;
}
