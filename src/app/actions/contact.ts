'use server';

import connectToDatabase from '@/lib/mongodb';
import Contact from '@/models/Contact';
import ActivityLog from '@/models/ActivityLog';
import { revalidatePath } from 'next/cache';

export async function updateContactApprovalStatus(
  id: string,
  approvalStatus: 'approved' | 'rejected',
) {
  await connectToDatabase();
  try {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { approvalStatus },
      { new: true },
    );
    if (!contact) throw new Error('Contact message not found');

    try {
      await ActivityLog.create({
        user: 'Admin',
        action: 'Update',
        module: 'Contact Messages',
        details: `Updated contact message approval status from ${contact.name} to ${approvalStatus}`,
      });
    } catch (e) {}

    revalidatePath('/dashboard/contact');
    return { success: true, contact: JSON.parse(JSON.stringify(contact)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateContactReadStatus(
  id: string,
  status: 'unread' | 'read' | 'replied',
) {
  await connectToDatabase();
  try {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!contact) throw new Error('Contact message not found');

    try {
      await ActivityLog.create({
        user: 'Admin',
        action: 'Update',
        module: 'Contact Messages',
        details: `Updated contact message status to ${status} from ${contact.name}`,
      });
    } catch (e) {}

    revalidatePath('/dashboard/contact');
    return { success: true, contact: JSON.parse(JSON.stringify(contact)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteContact(id: string) {
  await connectToDatabase();
  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) throw new Error('Contact message not found');

    try {
      await ActivityLog.create({
        user: 'Admin',
        action: 'Delete',
        module: 'Contact Messages',
        details: `Deleted contact message from ${contact.name}`,
      });
    } catch (e) {}

    revalidatePath('/dashboard/contact');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
