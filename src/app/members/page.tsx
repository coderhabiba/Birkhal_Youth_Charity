import connectToDatabase from '@/lib/mongodb';
import Member from '@/models/Member';
import { MembersClient } from './members-client';

export const revalidate = 60;

export default async function PublicMembersPage() {
  await connectToDatabase();
  // Fetch only approved members. We lean() to convert to plain objects and map _id to string for the client.
  const rawMembers = await Member.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .lean();

  const members = rawMembers.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt.toISOString(),
  }));

  return <MembersClient members={members} />;
}
