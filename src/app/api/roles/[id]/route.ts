import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Role from '@/models/Role';
import ActivityLog from '@/models/ActivityLog';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await connectToDatabase();

    const updatedRole = await Role.findByIdAndUpdate(id, data, { new: true });
    if (!updatedRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Update",
        module: "Roles",
        details: `Updated permissions for role: ${updatedRole.name}`
      });
    } catch (e) {}

    return NextResponse.json({ success: true, role: updatedRole });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update role" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Delete",
        module: "Roles",
        details: `Deleted role: ${deletedRole.name}`
      });
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete role" }, { status: 500 });
  }
}
