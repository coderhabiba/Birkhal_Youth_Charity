import connectToDatabase from '@/lib/mongodb';
import Member from '@/models/Member';
import DonationEntry from '@/models/DonationEntry';
import Expense from '@/models/Expense';
import Review from '@/models/Review';
import Event from '@/models/Event';
import { DashboardOverviewClient } from './dashboard-client';
import { cachedQuery } from '@/lib/cache';

export const revalidate = 0; // Don't cache dashboard stats

async function getDashboardData() {
  await connectToDatabase();

  // Run all queries in parallel for maximum speed
  const [
    totalMembers,
    pendingMembers,
    completedDonations,
    expenses,
    activeEvents,
    totalReviews,
    recentMembers,
  ] = await Promise.all([
    Member.countDocuments({ status: 'approved' }),
    Member.countDocuments({ status: 'pending' }),
    DonationEntry.find({ status: 'Completed' })
      .select('amount date createdAt category donorName')
      .lean(),
    Expense.find().select('amount').lean(),
    Event.countDocuments({ status: 'upcoming' }),
    Review.countDocuments(),
    Member.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const totalDonations = completedDonations.reduce(
    (sum: number, d: any) => sum + (d.amount || 0),
    0,
  );

  const totalExpenses = expenses.reduce(
    (sum: number, e: any) => sum + (e.amount || 0),
    0,
  );

  const netBalance = totalDonations - totalExpenses;

  const stats = {
    totalMembers,
    pendingMembers,
    totalDonations,
    totalExpenses,
    netBalance,
    activeEvents,
    totalReviews,
  };

  const recentRegistrations = recentMembers.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt ? m.createdAt.toISOString() : null,
  }));

  const serializableDonations = completedDonations.map((d: any) => ({
    _id: d._id.toString(),
    amount: d.amount || 0,
    donorName: d.donorName || '',
    category: d.category || 'General',
    date: d.date || (d.createdAt ? d.createdAt.toISOString() : undefined),
    createdAt: d.createdAt ? d.createdAt.toISOString() : undefined,
  }));

  return { stats, recentRegistrations, serializableDonations };
}

export default async function DashboardOverview() {
  let stats = {
    totalMembers: 0,
    pendingMembers: 0,
    totalDonations: 0,
    totalExpenses: 0,
    netBalance: 0,
    activeEvents: 0,
    totalReviews: 0,
  };
  let recentRegistrations: any[] = [];
  let serializableDonations: any[] = [];

  try {
    const data = await cachedQuery('dashboard-overview', getDashboardData, 120_000);
    stats = data.stats;
    recentRegistrations = data.recentRegistrations;
    serializableDonations = data.serializableDonations;
  } catch (e) {
    console.error("Failed to load dashboard data:", e);
  }

  return (
    <DashboardOverviewClient
      stats={stats}
      recentRegistrations={recentRegistrations}
      donations={serializableDonations}
    />
  );
}

