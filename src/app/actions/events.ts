'use server';

import connectToDatabase from '@/lib/mongodb';
import Event from '@/models/Event';
import ActivityLog from '@/models/ActivityLog';
import { revalidatePath } from 'next/cache';

export async function updateEventApprovalStatus(
  id: string,
  approvalStatus: 'approved' | 'rejected',
) {
  await connectToDatabase();
  try {
    const event = await Event.findByIdAndUpdate(
      id,
      { approvalStatus },
      { new: true },
    );
    if (!event) throw new Error('Event not found');

    try {
      await ActivityLog.create({
        user: 'Admin',
        action: 'Update',
        module: 'Events',
        details: `Updated event approval status for ${event.title} to ${approvalStatus}`,
      });
    } catch (e) {}

    revalidatePath('/dashboard/events');
    revalidatePath('/events');
    return { success: true, event: JSON.parse(JSON.stringify(event)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateEventDetails(
  id: string,
  data: {
    title: string;
    date: Date;
    location: string;
    description: string;
    image?: string;
    contactPhone?: string;
    type: 'fundraiser' | 'workshop' | 'campaign' | 'meeting';
    status: 'upcoming' | 'ongoing' | 'completed';
    approvalStatus?: string;
  },
) {
  await connectToDatabase();
  try {
    const event = await Event.findByIdAndUpdate(id, data, { new: true });
    if (!event) throw new Error('Event not found');

    try {
      await ActivityLog.create({
        user: 'Admin',
        action: 'Update',
        module: 'Events',
        details: `Updated event details for ${event.title}`,
      });
    } catch (e) {}

    revalidatePath('/dashboard/events');
    revalidatePath('/events');
    return { success: true, event: JSON.parse(JSON.stringify(event)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createEventAction(data: {
  title: string;
  date: Date;
  location: string;
  description: string;
  image?: string;
  contactPhone?: string;
  type: 'fundraiser' | 'workshop' | 'campaign' | 'meeting';
  status: 'upcoming' | 'ongoing' | 'completed';
}) {
  await connectToDatabase();
  try {
    const event = await Event.create(data);

    try {
      await ActivityLog.create({
        user: 'Admin',
        action: 'Create',
        module: 'Events',
        details: `Created new event: ${event.title}`,
      });
    } catch (e) {}

    revalidatePath('/dashboard/events');
    revalidatePath('/events');
    return { success: true, event: JSON.parse(JSON.stringify(event)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteEvent(id: string) {
  await connectToDatabase();
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) throw new Error('Event not found');

    try {
      await ActivityLog.create({
        user: 'Admin',
        action: 'Delete',
        module: 'Events',
        details: `Deleted event: ${event.title}`,
      });
    } catch (e) {}

    revalidatePath('/dashboard/events');
    revalidatePath('/events');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
