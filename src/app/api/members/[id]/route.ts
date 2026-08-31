import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Member from '@/models/Member';
import ActivityLog from '@/models/ActivityLog';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const member = await Member.findById(id).lean();
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    return NextResponse.json(member);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch member" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await connectToDatabase();

    const updatedMember = await Member.findByIdAndUpdate(id, data, { new: true });
    if (!updatedMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Update",
        module: "Members",
        details: `Updated member details/status for ${updatedMember.nameEn || updatedMember.nameBn} (${updatedMember.status})`
      });
    } catch (e) {}

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deletedMember = await Member.findByIdAndDelete(id);
    if (!deletedMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Delete",
        module: "Members",
        details: `Deleted member record: ${deletedMember.nameEn || deletedMember.nameBn}`
      });
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete member" }, { status: 500 });
  }
}
