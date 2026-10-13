import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Committee from '@/models/Committee';
import { processBase64Image } from '@/lib/uploadHelper';

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
    const createData = { ...data };
    if (createData.image && createData.image.startsWith('data:image')) {
      createData.image = processBase64Image(createData.image, 'committee');
    }
    const newMember = new Committee(createData);
    await newMember.save();
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create committee member" }, { status: 500 });
  }
}
