import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Committee from '@/models/Committee';

export async function GET() {
  try {
    await connectToDatabase();
    const members = await Committee.find().sort({ createdAt: 1 }).lean();
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch committee members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();
    const newMember = new Committee(data);
    await newMember.save();
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create committee member" }, { status: 500 });
  }
}
