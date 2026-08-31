import connectToDatabase from '@/lib/mongodb';
import Member from '@/models/Member';
import DonationEntry from '@/models/DonationEntry';
import Review from '@/models/Review';
import Event from '@/models/Event';
import { DashboardOverviewClient } from './dashboard-client';

export const revalidate = 0; // Don't cache dashboard stats

export default async function DashboardOverview() {
  await connectToDatabase();

  // Fetch stats and donation records concurrently
  const [
    totalMembers,
    pendingMembers,
    completedDonations,
    activeEvents,
    totalReviews,
    recentMembers,
  ] = await Promise.all([
    Member.countDocuments({ status: 'approved' }),
    Member.countDocuments({ status: 'pending' }),
    DonationEntry.find({ status: 'Completed' })
      .select('amount date createdAt category donorName')
      .lean(),
    Event.countDocuments({ status: 'upcoming' }),
    Review.countDocuments(),
    Member.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const totalDonations = completedDonations.reduce(
    (sum: number, d: any) => sum + (d.amount || 0),
    0,
  );

  const stats = {
    totalMembers,
    pendingMembers,
    totalDonations,
    activeEvents,
    totalReviews,
  };

  const recentRegistrations = recentMembers.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt.toISOString(),
  }));

  const serializableDonations = completedDonations.map((d: any) => ({
    _id: d._id.toString(),
    amount: d.amount || 0,
    donorName: d.donorName || '',
    category: d.category || 'General',
    date: d.date || (d.createdAt ? d.createdAt.toISOString() : undefined),
    createdAt: d.createdAt ? d.createdAt.toISOString() : undefined,
  }));

  return (
    <DashboardOverviewClient
      stats={stats}
      recentRegistrations={recentRegistrations}
      donations={serializableDonations}
    />
  );
}
