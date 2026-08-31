"use server";

import connectToDatabase from "@/lib/mongodb";
import Member from "@/models/Member";
import DonationEntry from "@/models/DonationEntry";
import Event from "@/models/Event";
import Review from "@/models/Review";

export async function getDashboardStats() {
  await connectToDatabase();

  try {
    const totalMembers = await Member.countDocuments({ status: "approved" });
    
    // Aggregate total donations
    const donationResult = await DonationEntry.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalDonations = donationResult.length > 0 ? donationResult[0].total : 0;

    const activeEvents = await Event.countDocuments({ status: "upcoming" }); // Or whatever the active status is
    const totalReviews = await Review.countDocuments();

    const recentRegistrations = await Member.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return {
      success: true,
      data: {
        stats: {
          totalMembers,
          totalDonations,
          activeEvents,
          totalReviews
        },
        recentRegistrations: JSON.parse(JSON.stringify(recentRegistrations))
      }
    };
  } catch (error: any) {
    console.error("Failed to fetch dashboard stats:", error);
    return { success: false, error: error.message };
  }
}
