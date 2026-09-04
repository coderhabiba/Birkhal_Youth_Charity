import connectToDatabase from "@/lib/mongodb";
import Member from "@/models/Member";
import { DashboardMembersClient } from "./members-client";
import { cachedQuery } from "@/lib/cache";

export const revalidate = 0;

async function getDashboardMembers() {
  await connectToDatabase();
  const rawMembers = await Member.find().sort({ createdAt: -1 }).lean();
  return rawMembers.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt ? m.createdAt.toISOString() : null,
  }));
}

export default async function MembersPage() {
  let members: any[] = [];
  try {
    members = await cachedQuery('dashboard-members', getDashboardMembers, 30_000);
  } catch (e) {
    console.error("Failed to load dashboard members:", e);
  }

  return <DashboardMembersClient members={members} />;
}

