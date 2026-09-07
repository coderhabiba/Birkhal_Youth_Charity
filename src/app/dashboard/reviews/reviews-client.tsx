"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { Star, Check, Trash2, MessageSquare, Edit3, X, Save, Image as ImageIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { ConfirmModal } from "@/components/confirm-modal";

export function DashboardReviewsClient() {
  const { language } = useLanguage();
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all"); // all, pending, approved
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [editFileBase64, setEditFileBase64] = useState<string>("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setAllReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = allReviews.filter((r) => filter === "all" ? true : r.status === filter);
  const counts = {
    all: allReviews.length,
    pending: allReviews.filter(r => r.status === 'pending').length,
    approved: allReviews.filter(r => r.status === 'approved').length,
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    try {
      const payload = { ...editingReview };
      if (editFileBase64) payload.image = editFileBase64;
      
      const res = await fetch(`/api/reviews/${editingReview._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchReviews();
        setEditingReview(null);
        setEditFileBase64("");
      }
    } catch (error) {
      console.error("Failed to update review", error);
    }
  };

  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
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
          className={`px-4 py-2 font-label-md text-sm cursor-pointer transition-colors rounded-xl flex items-center gap-2 ${
            filter === "all"
              ? "bg-growth-green text-white"
              : "bg-surface dark:bg-background text-foreground border border-border hover:bg-surface-variant"
          }`}
        >
          <span>{language === "bn" ? "সমস্ত মতামত" : "All Reviews"}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">{counts.all}</span>
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 font-label-md text-sm cursor-pointer transition-colors rounded-xl flex items-center gap-2 ${
            filter === "pending"
              ? "bg-growth-green text-white"
              : "bg-surface dark:bg-background text-foreground border border-border hover:bg-surface-variant"
          }`}
        >
          <span>{language === "bn" ? "পেন্ডিং" : "Pending"}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">{counts.pending}</span>
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 font-label-md text-sm cursor-pointer transition-colors rounded-xl flex items-center gap-2 ${
            filter === "approved"
              ? "bg-growth-green text-white"
              : "bg-surface dark:bg-background text-foreground border border-border hover:bg-surface-variant"
          }`}
        >
          <span>{language === "bn" ? "অনুমোদিত" : "Approved"}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">{counts.approved}</span>
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
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                    {language === "bn" ? "কোনো মতামত পাওয়া যায়নি।" : "No reviews found."}
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review: any) => (
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
                          onClick={() => {
                            setEditingReview({ ...review });
                            setEditFileBase64("");
                          }}
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors cursor-pointer rounded-lg"
                          title={language === "bn" ? "সম্পাদনা করুন" : "Edit"}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
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

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest dark:bg-surface-container-low w-full max-w-lg border border-border shadow-2xl p-6 animate-in zoom-in-95 rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-growth-green/10 text-growth-green">
                  <Edit3 className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-base text-foreground">
                  {language === "bn" ? "রিভিউ সম্পাদনা" : "Edit Review"}
                </h3>
              </div>
              <button 
                onClick={() => { setEditingReview(null); setEditFileBase64(""); }} 
                className="text-on-surface-variant hover:text-foreground font-bold p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Image Preview & Upload */}
              <div className="p-3.5 bg-surface dark:bg-background border border-border rounded-xl">
                <label className="block text-xs font-bold mb-2 text-foreground">
                  {language === "bn" ? "ব্যবহারকারীর ছবি" : "User Image"}
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-16 h-16 rounded-full border border-border overflow-hidden bg-surface-variant/30 flex items-center justify-center shrink-0">
                    {editFileBase64 || editingReview.image ? (
                      <img 
                        src={editFileBase64 || editingReview.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-xl font-bold text-growth-green">{editingReview.name?.charAt(0) || "U"}</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-surface-variant hover:bg-surface-variant/80 border border-border rounded-xl cursor-pointer text-foreground transition-colors">
                      <Upload className="w-3.5 h-3.5 text-growth-green" />
                      <span>{language === "bn" ? "নতুন ছবি নির্বাচন করুন" : "Upload Image"}</span>
                      <input type="file" accept="image/*" onChange={handleEditFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Name & Designation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "নাম" : "Name"}</label>
                  <input
                    type="text"
                    required
                    value={editingReview.name}
                    onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl focus:border-growth-green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "পদবি/পরিচয়" : "Designation"}</label>
                  <input
                    type="text"
                    required
                    value={editingReview.designation}
                    onChange={(e) => setEditingReview({ ...editingReview, designation: e.target.value })}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl focus:border-growth-green focus:outline-none"
                  />
                </div>
              </div>

              {/* Rating & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "রেটিং (১-৫)" : "Rating (1-5)"}</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    required
                    value={editingReview.rating}
                    onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl focus:border-growth-green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "স্ট্যাটাস" : "Status"}</label>
                  <select
                    value={editingReview.status}
                    onChange={(e) => setEditingReview({ ...editingReview, status: e.target.value })}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl focus:border-growth-green focus:outline-none"
                  >
                    <option value="pending">{language === "bn" ? "পেন্ডিং" : "Pending"}</option>
                    <option value="approved">{language === "bn" ? "অনুমোদিত" : "Approved"}</option>
                  </select>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "মতামত" : "Comment"}</label>
                <textarea
                  required
                  rows={4}
                  value={editingReview.comment}
                  onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl focus:border-growth-green focus:outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button 
                  type="button" 
                  onClick={() => { setEditingReview(null); setEditFileBase64(""); }} 
                  className="px-4 py-2 border border-border text-foreground font-bold text-xs cursor-pointer rounded-xl hover:bg-surface-variant transition-colors"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-growth-green text-white font-bold text-xs hover:bg-[#236026] flex items-center gap-2 cursor-pointer rounded-xl shadow-xs transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  {language === "bn" ? "সংরক্ষণ করুন" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
