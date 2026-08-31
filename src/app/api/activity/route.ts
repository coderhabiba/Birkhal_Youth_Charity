import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');
    const action = searchParams.get('action');
    const moduleName = searchParams.get('module');

    const query: any = {};
    if (user && user !== 'all') query.user = new RegExp(user, 'i');
    if (action && action !== 'all') query.action = action;
    if (moduleName && moduleName !== 'all') query.module = new RegExp(moduleName, 'i');

    const logs = await ActivityLog.find(query).sort({ createdAt: -1 }).limit(100).lean();

    // If no logs exist yet, seed a few friendly initial logs
    if (logs.length === 0 && Object.keys(query).length === 0) {
      const initialLogs = [
        {
          user: "Admin (admin@birkhalyouth.org)",
          action: "Create",
          module: "Settings",
          details: "System settings initialized and synchronized.",
          createdAt: new Date(),
        },
        {
          user: "System",
          action: "Update",
          module: "Members",
          details: "Member database verification completed.",
          createdAt: new Date(Date.now() - 3600000),
        }
      ];
      await ActivityLog.insertMany(initialLogs);
      const seeded = await ActivityLog.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json(seeded);
    }

    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch activity logs" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectToDatabase();
    await ActivityLog.deleteMany({});
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to clear logs" }, { status: 500 });
  }
}
