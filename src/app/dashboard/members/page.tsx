import connectToDatabase from "@/lib/mongodb";
import Member from "@/models/Member";
import { DashboardMembersClient } from "./members-client";

export const revalidate = 0; // Disable caching for this route so we always see fresh data

export default async function MembersPage() {
  await connectToDatabase();
  const rawMembers = await Member.find().sort({ createdAt: -1 }).lean();

  const members = rawMembers.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt ? m.createdAt.toISOString() : null,
  }));

  return <DashboardMembersClient members={members} />;
}
