import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import { processBase64Image } from '@/lib/uploadHelper';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    await connectToDatabase();
    
    let query = {};
    if (status) {
      query = { status };
    }

    const reviews = await Review.find(query)
      .select('-image')
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    
    const createData = { ...data };
    if (createData.image && createData.image.startsWith('data:image')) {
      createData.image = processBase64Image(createData.image, 'review');
    }

    // By default all submissions go to pending
    const newReview = await Review.create({
      ...createData,
      status: 'pending' // For security, override just in case
    });
    
    return NextResponse.json({ success: true, review: newReview });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
