import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Role from '@/models/Role';
import ActivityLog from '@/models/ActivityLog';

export async function GET() {
  try {
    await connectToDatabase();
    let roles = await Role.find().sort({ createdAt: 1 }).lean();

    if (roles.length === 0) {
      const initialRoles = [
        {
          name: "Super Admin",
          nameBn: "সুপার অ্যাডমিন",
          description: "Full system access. Can modify all settings, manage all users, and oversee financial configurations.",
          isCritical: true,
          usersAssigned: 2,
          permissions: {
            volunteers: { view: true, edit: true, delete: true },
            events: { view: true, edit: true, delete: true },
            financial: { view: true, edit: true, delete: true },
            content: { view: true, edit: true, delete: true },
            settings: { view: true, edit: true, delete: true },
          }
        },
        {
          name: "Content Manager",
          nameBn: "কনটেন্ট ম্যানেজার",
          description: "Responsible for updating website pages, managing media assets, and publishing updates.",
          isCritical: false,
          usersAssigned: 5,
          permissions: {
            volunteers: { view: true, edit: false, delete: false },
            events: { view: true, edit: true, delete: false },
            financial: { view: false, edit: false, delete: false },
            content: { view: true, edit: true, delete: true },
            settings: { view: false, edit: false, delete: false },
          }
        },
        {
          name: "Volunteer Coordinator",
          nameBn: "স্বেচ্ছাসেবক সমন্বয়কারী",
          description: "Oversees volunteer registration, scheduling, and event assignments.",
          isCritical: false,
          usersAssigned: 3,
          permissions: {
            volunteers: { view: true, edit: true, delete: false },
            events: { view: true, edit: true, delete: false },
            financial: { view: false, edit: false, delete: false },
            content: { view: true, edit: false, delete: false },
            settings: { view: false, edit: false, delete: false },
          }
        }
      ];
      await Role.insertMany(initialRoles);
      roles = await Role.find().sort({ createdAt: 1 }).lean();
    }

    return NextResponse.json(roles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch roles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();

    const newRole = await Role.create(data);

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Create",
        module: "Roles",
        details: `Created new role: ${newRole.name}`
      });
    } catch (e) {}

    return NextResponse.json({ success: true, role: newRole }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create role" }, { status: 400 });
  }
}
