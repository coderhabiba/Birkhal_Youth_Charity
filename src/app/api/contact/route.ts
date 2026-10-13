import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: max 5 messages per 10 minutes per IP
    const rateCheck = checkRateLimit(ip, 'contact_form', 5, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'অনেক বেশি বার্তা পাঠানো হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।' },
        { status: 429 }
      );
    }

    const data = await request.json().catch(() => null);
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ success: false, error: 'ভুল অনুরোধ' }, { status: 400 });
    }

    if (!data.name || typeof data.name !== 'string' || !data.message || typeof data.message !== 'string') {
      return NextResponse.json({ success: false, error: 'নাম ও বার্তা প্রদান করা আবশ্যক।' }, { status: 400 });
    }

    await connectToDatabase();

    // Create a new contact message with bounded strings
    const newMessage = new Contact({
      name: String(data.name).trim().slice(0, 100),
      email: data.email ? String(data.email).trim().slice(0, 100) : '',
      phone: data.phone ? String(data.phone).trim().slice(0, 30) : undefined,
      subject: data.subject ? String(data.subject).trim().slice(0, 150) : '',
      message: String(data.message).trim().slice(0, 2000),
    });

    await newMessage.save();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to save contact message:", error);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}
