import connectToDatabase from '@/lib/mongodb';
import Member from '@/models/Member';
import { MembersClient } from './members-client';
import { cachedQuery } from '@/lib/cache';

export const revalidate = 60;

async function getMembersData() {
  await connectToDatabase();
  const rawMembers = await Member.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .lean();

  return rawMembers.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt.toISOString(),
  }));
}

export default async function PublicMembersPage() {
  let members: any[] = [];
  try {
    members = await cachedQuery('public-members', getMembersData, 60_000);
  } catch (e) {
    console.error("Failed to load members:", e);
  }

  return <MembersClient members={members} />;
}

