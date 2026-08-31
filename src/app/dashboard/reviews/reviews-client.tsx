"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { Star, Check, Trash2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ConfirmModal } from "@/components/confirm-modal";

export function DashboardReviewsClient() {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all"); // all, pending, approved

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/reviews" : `/api/reviews?status=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to approve review", error);
    }
  };

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDeleteReview = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/reviews/${deleteTargetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to delete review", error);
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold text-foreground mb-2">
            {language === "bn" ? "রিভিউ ও মতামত" : "Reviews & Testimonials"}
          </h1>
          <p className="text-on-surface-variant dark:text-on-surface-variant font-body-md">
            {language === "bn"
              ? "ওয়েবসাইটে প্রদর্শনের জন্য ব্যবহারকারীদের দেওয়া মতামত ও রেটিং তদারকি করুন।"
              : "Moderate user feedback, ratings, and reviews to display on the main page."}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-surface-container-low dark:bg-surface-container-lowest p-4 shadow-sm border border-border flex flex-wrap gap-2 items-center backdrop-blur-md rounded-xl">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 font-label-md text-sm cursor-pointer transition-colors rounded-xl ${
            filter === "all"
              ? "bg-growth-green text-white"
              : "bg-surface dark:bg-background text-foreground border border-border hover:bg-surface-variant"
          }`}
        >
          {language === "bn" ? "সমস্ত মতামত" : "All Reviews"}
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 font-label-md text-sm cursor-pointer transition-colors rounded-xl ${
            filter === "pending"
              ? "bg-growth-green text-white"
              : "bg-surface dark:bg-background text-foreground border border-border hover:bg-surface-variant"
          }`}
        >
          {language === "bn" ? "পেন্ডিং" : "Pending"}
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 font-label-md text-sm cursor-pointer transition-colors rounded-xl ${
            filter === "approved"
              ? "bg-growth-green text-white"
              : "bg-surface dark:bg-background text-foreground border border-border hover:bg-surface-variant"
          }`}
        >
          {language === "bn" ? "অনুমোদিত" : "Approved"}
        </button>
      </div>

      {/* Reviews List */}
      <div className="bg-surface-container-lowest dark:bg-surface-container-low shadow-sm border border-surface-variant dark:border-border overflow-hidden backdrop-blur-md rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface dark:bg-background border-b border-surface-variant dark:border-border text-on-surface-variant dark:text-on-surface-variant text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">{language === "bn" ? "ব্যবহারকারী" : "User"}</th>
                <th className="p-4 font-semibold">{language === "bn" ? "রেটিং" : "Rating"}</th>
                <th className="p-4 font-semibold">{language === "bn" ? "মতামত" : "Comment"}</th>
                <th className="p-4 font-semibold">{language === "bn" ? "স্ট্যাটাস" : "Status"}</th>
                <th className="p-4 font-semibold text-right">{language === "bn" ? "অ্যাকশন" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant dark:divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                    {language === "bn" ? "লোড হচ্ছে..." : "Loading..."}
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                    {language === "bn" ? "কোনো মতামত পাওয়া যায়নি।" : "No reviews found."}
                  </td>
                </tr>
              ) : (
                reviews.map((review: any) => (
                  <tr key={review._id} className="hover:bg-surface dark:hover:bg-background/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {review.image ? (
                          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-border bg-surface-variant">
                            <img src={review.image} alt={review.name} className="w-full h-full object-cover object-top" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-growth-green/10 text-growth-green font-bold flex items-center justify-center text-xs shrink-0 border border-growth-green/20">
                            {review.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-foreground">{review.name}</div>
                          <div className="text-xs text-on-surface-variant dark:text-on-surface-variant">{review.designation || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs md:max-w-md">
                      <p className="text-sm text-foreground line-clamp-3">{review.comment}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold capitalize rounded-md ${
                        review.status === 'approved' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30'
                      }`}>
                        {language === "bn"
                          ? (review.status === 'approved' ? "অনুমোদিত" : "পেন্ডিং")
                          : review.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {review.status !== "approved" && (
                          <button
                            onClick={() => handleApprove(review._id)}
                            className="p-2 bg-green-100 hover:bg-green-200 text-green-600 transition-colors cursor-pointer rounded-lg"
                            title={language === "bn" ? "অনুমোদন করুন" : "Approve"}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-500 transition-colors cursor-pointer rounded-lg"
                          title={language === "bn" ? "মুছে ফেলুন" : "Delete"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDeleteReview}
        title={language === "bn" ? "রিভিউ মুছে ফেলার নিশ্চয়তা" : "Delete Review"}
        message={language === "bn" ? "আপনি কি নিশ্চিতভাবে এই রিভিউটি মুছে ফেলতে চান? এটি আর প্রদর্শিত হবে না।" : "Are you sure you want to permanently delete this review?"}
        confirmText={language === "bn" ? "হ্যাঁ, মুছে ফেলুন" : "Yes, Delete"}
        cancelText={language === "bn" ? "বাতিল" : "Cancel"}
        type="danger"
      />
    </div>
  );
}
