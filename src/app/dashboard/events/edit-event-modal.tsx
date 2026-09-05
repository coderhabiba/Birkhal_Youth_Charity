"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Trash2, Link as LinkIcon } from "lucide-react";
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
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [imageUrl, setImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    type: "campaign",
    status: "upcoming",
    contactPhone: "",
    image: "",
  });

  useEffect(() => {
    if (event) {
      const d = event.date ? new Date(event.date) : new Date();
      const formattedDate = !isNaN(d.getTime())
        ? new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16)
        : "";

      setFormData({
        title: event.title || "",
        date: formattedDate,
        location: event.location || "",
        description: event.description || "",
        type: event.type || "campaign",
        status: event.status || "upcoming",
        contactPhone: event.contactPhone || "",
        image: event.image || "",
      });
      setImagePreview(event.image || "");
      setImageUrl(event.image && !event.image.startsWith("data:") && !event.image.startsWith("/uploads") ? event.image : "");
      setError("");
    }
  }, [event, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(language === "bn" ? "ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।" : "Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setFormData(prev => ({ ...prev, image: result }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageUrl("");
    setFormData(prev => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event) return;
    setLoading(true);
    setError("");

    const finalImage = uploadMode === "file" ? formData.image : (imageUrl || formData.image);

    try {
      const res = await fetch(`/api/events/${event._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: finalImage || "",
        }),
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
      <div className="bg-surface dark:bg-surface-container-lowest w-full max-w-xl shadow-2xl border border-border mt-14 mb-10 relative flex flex-col max-h-[92vh] rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border sticky top-0 bg-surface dark:bg-surface-container-lowest z-10">
          <div>
            <h2 className="font-headline-md text-xl font-bold text-foreground">
              {language === "bn" ? "ইভেন্ট সম্পাদনা করুন" : "Edit Event"}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {event.title}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant dark:hover:bg-white/10 transition-colors text-on-surface-variant rounded-xl cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm font-bold border border-red-200 dark:border-red-900/50">
              {error}
            </div>
          )}

          <form id="edit-event-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Image Upload Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-foreground">
                  {language === "bn" ? "ইভেন্টের ছবি / ব্যানার" : "Event Banner / Photo"}
                </label>
                <div className="flex text-xs border border-border rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`px-2.5 py-1 font-bold cursor-pointer transition-colors ${uploadMode === "file" ? "bg-growth-green text-white" : "bg-surface dark:bg-background text-on-surface-variant"}`}
                  >
                    {language === "bn" ? "ফাইল আপলোড" : "Upload File"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`px-2.5 py-1 font-bold cursor-pointer transition-colors ${uploadMode === "url" ? "bg-growth-green text-white" : "bg-surface dark:bg-background text-on-surface-variant"}`}
                  >
                    {language === "bn" ? "ইমেজ লিংক" : "Image URL"}
                  </button>
                </div>
              </div>

              {uploadMode === "file" ? (
                <div>
                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-border bg-black/5 dark:bg-white/5 aspect-video max-h-48 group">
                      <img
                        src={imagePreview}
                        alt="Event Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg shadow-sm hover:bg-growth-green hover:text-white transition-colors cursor-pointer"
                        >
                          {language === "bn" ? "ছবি পরিবর্তন করুন" : "Change Image"}
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {language === "bn" ? "মুছুন" : "Remove"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border hover:border-growth-green rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer bg-surface-variant/40 dark:bg-surface-container-low hover:bg-growth-green/5 transition-all"
                    >
                      <div className="w-12 h-12 rounded-full bg-growth-green/10 flex items-center justify-center text-growth-green">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {language === "bn" ? "ইভেন্টের ছবি নির্বাচন করতে ক্লিক করুন" : "Click to select event image"}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1">
                          PNG, JPG, JPEG, WEBP (Max 5MB)
                        </p>
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input
                      type="url"
                      placeholder="https://example.com/event-banner.jpg"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setFormData(prev => ({ ...prev, image: e.target.value }));
                      }}
                      className="w-full pl-9 pr-3 py-2.5 bg-surface-variant dark:bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-growth-green text-foreground"
                    />
                  </div>
                  {imageUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-border bg-black/5 aspect-video max-h-36">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
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

            {/* Date & Type Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="block text-xs font-bold text-foreground">{language === "bn" ? "ইভেন্ট টাইপ" : "Event Type"}</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl cursor-pointer"
                >
                  <option value="campaign">{language === "bn" ? "সামাজিক ক্যাম্পেইন" : "Social Campaign"}</option>
                  <option value="fundraiser">{language === "bn" ? "ত্রাণ ও তহবিল সংগ্রহ" : "Fundraiser"}</option>
                  <option value="workshop">{language === "bn" ? "প্রশিক্ষণ ও কর্মশালা" : "Workshop"}</option>
                  <option value="meeting">{language === "bn" ? "সাধারণ সভা" : "Meeting"}</option>
                </select>
              </div>
            </div>

            {/* Location & Contact Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="block text-xs font-bold text-foreground">{language === "bn" ? "যোগাযোগের ফোন" : "Contact Phone"}</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">{language === "bn" ? "ইভেন্টের বিবরণ" : "Event Description"} *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
              ></textarea>
            </div>

            {/* Status */}
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-surface dark:bg-surface-container-lowest">
          <button type="button" onClick={onClose} className="px-5 py-2.5 font-bold text-xs text-on-surface-variant hover:bg-surface-variant dark:hover:bg-white/10 transition-colors border border-border cursor-pointer rounded-xl">
            {language === "bn" ? "বাতিল" : "Cancel"}
          </button>
          <button type="submit" form="edit-event-form" disabled={loading} className="px-6 py-2.5 font-bold text-xs bg-growth-green hover:bg-[#236026] text-white shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer rounded-xl">
            {loading ? (language === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : (language === "bn" ? "পরিবর্তন সংরক্ষণ করুন" : "Save Changes")}
          </button>
        </div>
      </div>
    </div>
  );
}
