import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Expense from '@/models/Expense';
import ActivityLog from '@/models/ActivityLog';
import { revalidatePath } from 'next/cache';
import { invalidateCache } from '@/lib/cache';

export async function GET() {
  try {
    await connectToDatabase();
    const expenses = await Expense.find().sort({ date: -1, createdAt: -1 });
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: 'ব্যয়ের তালিকা লোড করা যায়নি।' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();

    if (!data.title?.trim() || !data.amount || Number(data.amount) <= 0) {
      return NextResponse.json(
        { error: 'খরচের বিবরণ ও সঠিক ব্যয়ের পরিমাণ দেওয়া আবশ্যক।' },
        { status: 400 }
      );
    }

    const newExpense = await Expense.create({
      title: data.title.trim(),
      amount: Number(data.amount),
      category: data.category?.trim() || 'অন্যান্য',
      date: data.date || new Date().toISOString().slice(0, 10),
      spentBy: data.spentBy ? String(data.spentBy).trim() : '',
      voucherNo: data.voucherNo ? String(data.voucherNo).trim() : '',
      notes: data.notes ? String(data.notes).trim() : '',
    });

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Create",
        module: "Expenses",
        details: `Recorded new expense of ৳${newExpense.amount} for "${newExpense.title}" (${newExpense.category})`
      });
    } catch (e) {}

    invalidateCache('dashboard-overview');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/calculator');

    return NextResponse.json({ success: true, expense: newExpense });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'ব্যয় সংরক্ষণ করা যায়নি।' }, { status: 400 });
  }
}
