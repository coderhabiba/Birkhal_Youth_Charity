import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import DonationEntry from '@/models/DonationEntry';
import ActivityLog from '@/models/ActivityLog';
import { revalidatePath } from 'next/cache';
import { isAuthorizedAdmin } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function GET(req: Request) {
  try {
    const isAdmin = await isAuthorizedAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'অননুমোদিত অ্যাক্সেস।' }, { status: 401 });
    }

    await connectToDatabase();
    const donations = await DonationEntry.find().sort({ createdAt: -1 });
    return NextResponse.json(donations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    // Rate limiting: max 10 submissions per 5 minutes per IP
    const rateCheck = checkRateLimit(ip, 'donation_submit', 10, 5 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'অনেক বেশি অনুদানের অনুরোধ করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।' },
        { status: 429 }
      );
    }

    await connectToDatabase();
    const data = await req.json().catch(() => null);
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'ভুল অনুরোধ।' }, { status: 400 });
    }

    const donorName = typeof data.donorName === 'string' ? data.donorName.trim() : '';
    const amount = Number(data.amount);

    if (!donorName || isNaN(amount) || amount <= 0 || amount > 10000000) {
      return NextResponse.json(
        { error: 'দাতার নাম ও অনুদানের সঠিক পরিমাণ দেওয়া আবশ্যক।' },
        { status: 400 }
      );
    }

    const isAdmin = await isAuthorizedAdmin(req);

    // Security: Only authorized admins can set status other than Pending
    const status = isAdmin && data.status ? String(data.status).trim() : 'Pending';

    const newDonation = await DonationEntry.create({
      donorName: donorName.slice(0, 100),
      amount: Math.round(amount),
      date: data.date ? String(data.date).slice(0, 20) : new Date().toISOString().slice(0, 10),
      category: data.category ? String(data.category).slice(0, 50) : 'General',
      mobileNumber: data.mobileNumber ? String(data.mobileNumber).trim().slice(0, 30) : '',
      transactionId: data.transactionId ? String(data.transactionId).trim().slice(0, 60) : '',
      status: status,
    });

    try {
      await ActivityLog.create({
        user: isAdmin ? "Admin" : "Public Donor",
        action: "Create",
        module: "Donations",
        details: `Recorded new donation of ৳${newDonation.amount} from ${newDonation.donorName} (${status})`
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
