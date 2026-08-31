import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import DonationEntry from '@/models/DonationEntry';
import ActivityLog from '@/models/ActivityLog';
import { revalidatePath } from 'next/cache';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await connectToDatabase();

    const updatedDonation = await DonationEntry.findByIdAndUpdate(id, data, { new: true });
    if (!updatedDonation) {
      return NextResponse.json({ error: "Donation record not found" }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Update",
        module: "Donations",
        details: `Updated donation for ${updatedDonation.donorName} of amount ৳${updatedDonation.amount}`
      });
    } catch (e) {}

    revalidatePath("/donations");
    revalidatePath("/dashboard/donations");
    revalidatePath("/");

    return NextResponse.json({ success: true, donation: updatedDonation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update donation" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deletedDonation = await DonationEntry.findByIdAndDelete(id);
    if (!deletedDonation) {
      return NextResponse.json({ error: "Donation record not found" }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Delete",
        module: "Donations",
        details: `Deleted donation from ${deletedDonation.donorName}`
      });
    } catch (e) {}

    revalidatePath("/donations");
    revalidatePath("/dashboard/donations");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete donation" }, { status: 500 });
  }
}
