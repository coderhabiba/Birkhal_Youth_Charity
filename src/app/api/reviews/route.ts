import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    await connectToDatabase();
    
    let query = {};
    if (status) {
      query = { status };
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    
    // By default all submissions go to pending
    const newReview = await Review.create({
      ...data,
      status: 'pending' // For security, override just in case
    });
    
    return NextResponse.json({ success: true, review: newReview });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
