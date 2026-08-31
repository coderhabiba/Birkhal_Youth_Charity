"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";

export function EditEventModal({
  event,
  isOpen,
  onClose,
  onUpdated,
}: {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    status: "upcoming",
  });

  useEffect(() => {
    if (event) {
      // Format date for datetime-local input
      const d = event.date ? new Date(event.date) : new Date();
      const formattedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setFormData({
        title: event.title || "",
        date: formattedDate,
        location: event.location || "",
        description: event.description || "",
        status: event.status || "upcoming",
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/events/${event._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || "Failed to update event");
      }

      onUpdated();
      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface dark:bg-surface-container-lowest w-full max-w-lg shadow-xl border border-border mt-20 mb-10 relative flex flex-col max-h-[90vh] rounded-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-surface dark:bg-surface-container-lowest z-10">
          <h2 className="font-headline-md text-xl font-bold text-foreground">
            {language === "bn" ? "ইভেন্ট সম্পাদনা করুন" : "Edit Event"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant dark:hover:bg-white/10 transition-colors text-on-surface-variant rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 mb-6 text-sm font-bold border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          <form id="edit-event-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">{language === "bn" ? "ইভেন্টের শিরোনাম" : "Event Title"} *</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">{language === "bn" ? "তারিখ ও সময়" : "Date & Time"} *</label>
              <input
                required
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">{language === "bn" ? "স্থান" : "Location"} *</label>
              <input
                required
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">{language === "bn" ? "ইভেন্টের বিবরণ" : "Event Description"} *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
              ></textarea>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">{language === "bn" ? "স্ট্যাটাস" : "Status"}</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl cursor-pointer"
              >
                <option value="upcoming">{language === "bn" ? "আসন্ন (Upcoming)" : "Upcoming"}</option>
                <option value="ongoing">{language === "bn" ? "চলমান (Ongoing)" : "Ongoing"}</option>
                <option value="completed">{language === "bn" ? "সম্পন্ন (Completed)" : "Completed"}</option>
              </select>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4 sticky bottom-0 bg-surface dark:bg-surface-container-lowest">
          <button type="button" onClick={onClose} className="px-6 py-2 font-bold text-sm text-on-surface-variant hover:bg-surface-variant dark:hover:bg-white/10 transition-colors border border-border cursor-pointer rounded-xl">
            {language === "bn" ? "বাতিল" : "Cancel"}
          </button>
          <button type="submit" form="edit-event-form" disabled={loading} className="px-6 py-2 font-bold text-sm bg-growth-green hover:bg-[#236026] text-white shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer rounded-xl">
            {loading ? (language === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : (language === "bn" ? "পরিবর্তন সংরক্ষণ করুন" : "Save Changes")}
          </button>
        </div>
      </div>
    </div>
  );
}
