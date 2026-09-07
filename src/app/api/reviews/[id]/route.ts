import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import ActivityLog from '@/models/ActivityLog';
import { revalidatePath } from 'next/cache';
import { invalidateCache } from '@/lib/cache';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    await connectToDatabase();
    
    const updateData: any = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.designation !== undefined) updateData.designation = data.designation;
    if (data.comment !== undefined) updateData.comment = data.comment;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.image !== undefined) updateData.image = data.image;

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!updatedReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Update",
        module: "Reviews",
        details: `Approved/updated testimonial from ${updatedReview.name} (${status})`
      });
    } catch (e) {}
    
    revalidatePath("/");
    revalidatePath("/dashboard/reviews");
    invalidateCache("home-page-data");

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    const deletedReview = await Review.findByIdAndDelete(id);
    
    if (!deletedReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Delete",
        module: "Reviews",
        details: `Deleted review from ${deletedReview.name}`
      });
    } catch (e) {}
    
    revalidatePath("/");
    revalidatePath("/dashboard/reviews");
    invalidateCache("home-page-data");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
