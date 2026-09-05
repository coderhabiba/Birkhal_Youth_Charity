import connectToDatabase from '@/lib/mongodb';
import DonationEntry from '@/models/DonationEntry';
import Expense from '@/models/Expense';
import { cachedQuery } from '@/lib/cache';
import { CalculatorClient } from './calculator-client';

export const revalidate = 0;

async function getFinancialData() {
  await connectToDatabase();

  const completedDonations = await DonationEntry.find({ status: 'Completed' })
    .select('amount date category donorName createdAt')
    .sort({ createdAt: -1 })
    .lean();

  const rawExpenses = await Expense.find()
    .sort({ date: -1, createdAt: -1 })
    .lean();

  const totalDonations = completedDonations.reduce(
    (sum: number, d: any) => sum + (d.amount || 0),
    0
  );

  const totalExpenses = rawExpenses.reduce(
    (sum: number, e: any) => sum + (e.amount || 0),
    0
  );

  const serializableExpenses = rawExpenses.map((e: any) => ({
    _id: e._id.toString(),
    title: e.title || '',
    amount: e.amount || 0,
    category: e.category || 'অন্যান্য',
    date: e.date || '',
    spentBy: e.spentBy || '',
    voucherNo: e.voucherNo || '',
    notes: e.notes || '',
    createdAt: e.createdAt ? e.createdAt.toISOString() : null,
  }));

  return {
    totalDonations,
    totalExpenses,
    netBalance: totalDonations - totalExpenses,
    expenses: serializableExpenses,
  };
}

export default async function CalculatorPage() {
  let financialData = {
    totalDonations: 0,
    totalExpenses: 0,
    netBalance: 0,
    expenses: [] as any[],
  };

  try {
    financialData = await cachedQuery('dashboard-financials', getFinancialData, 15_000);
  } catch (error) {
    console.error('Failed to fetch financial data for calculator:', error);
  }

  return (
    <CalculatorClient
      initialTotalDonations={financialData.totalDonations}
      initialTotalExpenses={financialData.totalExpenses}
      initialExpenses={financialData.expenses}
    />
  );
}
