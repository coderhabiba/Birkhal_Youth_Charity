"use server";

import connectToDatabase from "@/lib/mongodb";
import Member from "@/models/Member";
import ActivityLog from "@/models/ActivityLog";
import { revalidatePath } from "next/cache";

export async function updateMemberStatus(id: string, status: "approved" | "rejected") {
  await connectToDatabase();
  try {
    const member = await Member.findByIdAndUpdate(id, { status }, { new: true });
    if (!member) throw new Error("Member not found");

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Update",
        module: "Members",
        details: `Updated membership status of ${member.nameEn || member.nameBn} to ${status}`
      });
    } catch (e) {}

    revalidatePath("/dashboard/members");
    revalidatePath("/");
    revalidatePath("/members");
    return { success: true, member: JSON.parse(JSON.stringify(member)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateMemberDetails(id: string, data: {
  nameBn: string;
  nameEn?: string;
  fatherHusbandName?: string;
  motherName: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  mobileNumber: string;
  whatsappNumber?: string;
  email?: string;
  nidOrBirthCert?: string;
  presentAddress: string;
  permanentAddress: string;
  photoUrl?: string;
  status?: string;
}) {
  await connectToDatabase();
  try {
    const member = await Member.findByIdAndUpdate(id, data, { new: true });
    if (!member) throw new Error("Member not found");

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Update",
        module: "Members",
        details: `Updated member profile details for ${member.nameBn || member.nameEn}`
      });
    } catch (e) {}

    revalidatePath("/dashboard/members");
    revalidatePath("/");
    revalidatePath("/members");
    revalidatePath("/about");
    return { success: true, member: JSON.parse(JSON.stringify(member)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update member" };
  }
}

export async function createMemberAction(data: {
  nameBn: string;
  nameEn?: string;
  fatherHusbandName?: string;
  motherName: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  mobileNumber: string;
  whatsappNumber?: string;
  email?: string;
  nidOrBirthCert?: string;
  presentAddress: string;
  permanentAddress: string;
  photoUrl?: string;
  status?: string;
}) {
  await connectToDatabase();
  try {
    const member = await Member.create(data);

    try {
      await ActivityLog.create({
        user: "Admin",
        action: "Create",
        module: "Members",
        details: `Created new member: ${member.nameBn || member.nameEn}`
      });
    } catch (e) {}

    revalidatePath("/dashboard/members");
    revalidatePath("/");
    revalidatePath("/members");
    revalidatePath("/about");
    return { success: true, member: JSON.parse(JSON.stringify(member)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create member" };
  }
}

export async function deleteMember(id: string) {
  await connectToDatabase();
  try {
    const member = await Member.findByIdAndDelete(id);

    try {
      if (member) {
        await ActivityLog.create({
          user: "Admin",
          action: "Delete",
          module: "Members",
          details: `Deleted member ${member.nameEn || member.nameBn}`
        });
      }
    } catch (e) {}

    revalidatePath("/dashboard/members");
    revalidatePath("/");
    revalidatePath("/members");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
