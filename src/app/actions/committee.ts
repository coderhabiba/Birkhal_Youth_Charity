"use server";

import connectToDatabase from "@/lib/mongodb";
import Committee from "@/models/Committee";
import ActivityLog from "@/models/ActivityLog";
import { revalidatePath } from "next/cache";

export async function createCommitteeMember(data: {
  name: string;
  role: string;
  phone?: string;
  address?: string;
  description?: string;
  image?: string;
  isVerified?: boolean;
}) {
  await connectToDatabase();
  try {
    const member = await Committee.create(data);
    
    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Create",
        module: "Committee",
        details: `Added new committee member: ${member.name} (${member.role})`
      });
    } catch (e) {}

    revalidatePath("/dashboard/committee");
    revalidatePath("/");
    revalidatePath("/about");
    return { success: true, member: JSON.parse(JSON.stringify(member)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create committee member" };
  }
}

export async function updateCommitteeMember(id: string, data: {
  name: string;
  role: string;
  phone?: string;
  address?: string;
  description?: string;
  image?: string;
  isVerified?: boolean;
}) {
  await connectToDatabase();
  try {
    const member = await Committee.findByIdAndUpdate(id, data, { new: true });
    if (!member) throw new Error("Committee member not found");

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Update",
        module: "Committee",
        details: `Updated committee member: ${member.name}`
      });
    } catch (e) {}

    revalidatePath("/dashboard/committee");
    revalidatePath("/");
    revalidatePath("/about");
    return { success: true, member: JSON.parse(JSON.stringify(member)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update committee member" };
  }
}

export async function deleteCommitteeMember(id: string) {
  await connectToDatabase();
  try {
    const member = await Committee.findByIdAndDelete(id);
    if (!member) throw new Error("Committee member not found");

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Delete",
        module: "Committee",
        details: `Deleted committee member: ${member.name}`
      });
    } catch (e) {}

    revalidatePath("/dashboard/committee");
    revalidatePath("/");
    revalidatePath("/about");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete committee member" };
  }
}
