import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Setting from '@/models/Setting';

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await Setting.find().lean();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();
    // Assuming data is an array of { key, value, category }
    for (const item of data) {
      await Setting.findOneAndUpdate(
        { key: item.key },
        { value: item.value, category: item.category || 'general' },
        { upsert: true, new: true }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
