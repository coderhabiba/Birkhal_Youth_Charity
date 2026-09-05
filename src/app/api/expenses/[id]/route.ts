import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Expense from '@/models/Expense';
import ActivityLog from '@/models/ActivityLog';
import { revalidatePath } from 'next/cache';
import { invalidateCache } from '@/lib/cache';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await connectToDatabase();

    if (data.amount && Number(data.amount) <= 0) {
      return NextResponse.json({ error: "সঠিক ব্যয়ের পরিমাণ দিন।" }, { status: 400 });
    }

    const updatePayload: any = {};
    if (data.title !== undefined) updatePayload.title = data.title.trim();
    if (data.amount !== undefined) updatePayload.amount = Number(data.amount);
    if (data.category !== undefined) updatePayload.category = data.category.trim();
    if (data.date !== undefined) updatePayload.date = data.date;
    if (data.spentBy !== undefined) updatePayload.spentBy = String(data.spentBy).trim();
    if (data.voucherNo !== undefined) updatePayload.voucherNo = String(data.voucherNo).trim();
    if (data.notes !== undefined) updatePayload.notes = String(data.notes).trim();

    const updatedExpense = await Expense.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!updatedExpense) {
      return NextResponse.json({ error: "ব্যয়ের রেকর্ড পাওয়া যায়নি।" }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Update",
        module: "Expenses",
        details: `Updated expense "${updatedExpense.title}" (৳${updatedExpense.amount})`
      });
    } catch (e) {}

    invalidateCache('dashboard-overview');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/calculator');

    return NextResponse.json({ success: true, expense: updatedExpense });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "ব্যয় আপডেট করা সম্ভব হয়নি।" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      return NextResponse.json({ error: "ব্যয়ের রেকর্ড পাওয়া যায়নি।" }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Delete",
        module: "Expenses",
        details: `Deleted expense "${deletedExpense.title}" (৳${deletedExpense.amount})`
      });
    } catch (e) {}

    invalidateCache('dashboard-overview');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/calculator');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "ব্যয় মুছে ফেলা যায়নি।" }, { status: 500 });
  }
}
