import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import DonationEntry from '@/models/DonationEntry';
import ActivityLog from '@/models/ActivityLog';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await connectToDatabase();
    const donations = await DonationEntry.find().sort({ createdAt: -1 });
    return NextResponse.json(donations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();

    if (!data.donorName?.trim() || !data.amount || Number(data.amount) <= 0) {
      return NextResponse.json(
        { error: 'দাতার নাম ও অনুদানের সঠিক পরিমাণ দেওয়া আবশ্যক।' },
        { status: 400 }
      );
    }

    const newDonation = await DonationEntry.create({
      donorName: data.donorName.trim(),
      amount: Number(data.amount),
      date: data.date || new Date().toISOString().slice(0, 10),
      category: data.category || 'General',
      mobileNumber: data.mobileNumber ? String(data.mobileNumber).trim() : '',
      transactionId: data.transactionId ? String(data.transactionId).trim() : '',
      status: data.status || 'Completed',
    });

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Create",
        module: "Donations",
        details: `Recorded new donation of ৳${newDonation.amount} from ${newDonation.donorName}`
      });
    } catch (e) {}

    revalidatePath("/donations");
    revalidatePath("/dashboard/donations");
    revalidatePath("/");

    return NextResponse.json({ success: true, donation: newDonation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
