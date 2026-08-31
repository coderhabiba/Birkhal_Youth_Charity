"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";

export function AddEventModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      date: formData.get("date"),
      location: formData.get("location"),
      description: formData.get("description"),
      status: formData.get("status"),
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || "Failed to create event");
      }

      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface dark:bg-surface-container-lowest w-full max-w-lg shadow-xl border border-border mt-20 mb-10 relative flex flex-col max-h-[90vh] rounded-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-surface dark:bg-surface-container-lowest z-10">
          <h2 className="font-headline-md text-xl font-bold text-foreground">
            {language === "bn" ? "নতুন ইভেন্ট যোগ করুন" : "Create New Event"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-variant dark:hover:bg-white/10 transition-colors text-on-surface-variant cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-6 text-sm font-bold border border-red-200">
              {error}
            </div>
          )}

          <form id="add-event-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground">{language === "bn" ? "ইভেন্টের শিরোনাম" : "Event Title"} *</label>
              <input required type="text" name="title" className="w-full bg-surface-variant dark:bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-growth-green text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground">{language === "bn" ? "তারিখ ও সময়" : "Date & Time"} *</label>
              <input required type="datetime-local" name="date" className="w-full bg-surface-variant dark:bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-growth-green text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground">{language === "bn" ? "স্থান" : "Location"} *</label>
              <input required type="text" name="location" className="w-full bg-surface-variant dark:bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-growth-green text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground">{language === "bn" ? "ইভেন্টের বিবরণ" : "Event Description"} *</label>
              <textarea required name="description" rows={4} className="w-full bg-surface-variant dark:bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-growth-green text-foreground"></textarea>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground">{language === "bn" ? "স্ট্যাটাস" : "Status"}</label>
              <select name="status" className="w-full bg-surface-variant dark:bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-growth-green text-foreground cursor-pointer">
                <option value="upcoming">{language === "bn" ? "আসন্ন" : "Upcoming"}</option>
                <option value="ongoing">{language === "bn" ? "চলমান" : "Ongoing"}</option>
                <option value="completed">{language === "bn" ? "সম্পন্ন" : "Completed"}</option>
              </select>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4 sticky bottom-0 bg-surface dark:bg-surface-container-lowest">
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-variant dark:hover:bg-white/10 transition-colors border border-border cursor-pointer">
            {language === "bn" ? "বাতিল" : "Cancel"}
          </button>
          <button type="submit" form="add-event-form" disabled={loading} className="px-6 py-2 rounded-xl font-bold text-sm bg-impact-orange hover:bg-orange-500 text-white shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer">
            {loading ? (language === "bn" ? "সংরক্ষণ করা হচ্ছে..." : "Saving...") : (language === "bn" ? "সংরক্ষণ করুন" : "Save Event")}
          </button>
        </div>
      </div>
    </div>
  );
}
