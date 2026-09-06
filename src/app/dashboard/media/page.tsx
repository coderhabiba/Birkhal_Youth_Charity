"use client";

import { useState, useEffect } from "react";
import { 
  Upload, Search, Edit3, Image as ImageIcon, Trash2, Copy, Check, Eye, Plus, 
  FileText, Loader2, Save, Calendar, Tag, RefreshCw, Info, ExternalLink, X, FileUp
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { ConfirmModal, AlertModal } from "@/components/confirm-modal";

const CATEGORIES = [
  { value: "GALLERY", labelBn: "কার্যক্রম গ্যালারি", labelEn: "Activity Gallery", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" },
  { value: "ACTIVITIES", labelBn: "সমাজসেবা কার্যক্রম", labelEn: "Community Activities", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
  { value: "RELIEF", labelBn: "ত্রাণ ও দুর্যোগ পুনর্বাসন", labelEn: "Relief & Aid", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20" },
  { value: "EDUCATION", labelBn: "শিক্ষা সহায়তা ও বৃত্তি", labelEn: "Education Support", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20" },
  { value: "PLANTATION", labelBn: "বৃক্ষরোপণ ও পরিবেশ", labelEn: "Tree Plantation", color: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20" },
  { value: "MEDICAL", labelBn: "স্বাস্থ্যসেবা ও মেডিকেল ক্যাম্প", labelEn: "Medical & Health", color: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20" },
  { value: "YOUTH", labelBn: "যুব উন্নয়ন ও ক্রীড়া", labelEn: "Youth & Sports", color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20" },
  { value: "MEMBERS", labelBn: "সদস্য ও সংগঠন", labelEn: "Members & Staff", color: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20" },
  { value: "GENERAL", labelBn: "সাধারণ ছবি", labelEn: "General Photo", color: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20" },
];

export default function MediaLibraryPage() {
  const { language } = useLanguage();
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editFileBase64, setEditFileBase64] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<any | null>(null);

  // New item upload form states
  const [newTitle, setNewTitle] = useState("");
  const [newTag, setNewTag] = useState("GALLERY");
  const [newDate, setNewDate] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [fileBase64, setFileBase64] = useState("");

  const [alertInfo, setAlertInfo] = useState<{ title: string; message: string } | null>(null);
  const [deleteTargetMedia, setDeleteTargetMedia] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.media || []);
        setMediaItems(list);
      } else {
        console.error("Failed to load media items, status:", res.status);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!newTitle) {
        // Strip file extension for a cleaner default title
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setNewTitle(nameWithoutExt);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = fileBase64 || newUrl;
    if (!finalUrl) {
      setAlertInfo({
        title: language === "bn" ? "ফাইল বা লিঙ্ক আবশ্যক" : "File or URL Required",
        message: language === "bn" 
          ? "অনুগ্রহ করে ডিভাইস থেকে একটি ছবি নির্বাচন করুন অথবা সরাসরি ইমেজ লিঙ্ক প্রদান করুন।" 
          : "Please select an image file or enter a direct image URL."
      });
      return;
    }

    setUploading(true);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle || (language === "bn" ? "কার্যক্রমের ছবি" : "Activity Photo"),
          url: finalUrl,
          tag: newTag,
          date: newDate,
          description: newDescription,
          isDoc: finalUrl.includes(".pdf") || finalUrl.includes(".doc"),
          size: fileBase64 ? `${Math.round((fileBase64.length * 3) / 4 / 1024)} KB` : "1.0 MB",
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        const added = resData.media || resData;
        setMediaItems([added, ...mediaItems]);
        setShowUploadModal(false);
        setNewTitle("");
        setNewUrl("");
        setFileBase64("");
        setNewDate("");
        setNewDescription("");
        setAlertInfo({
          title: language === "bn" ? "সফলভাবে আপলোড সম্পন্ন" : "Upload Successful",
          message: language === "bn" ? "ছবি ও তথ্য সফলভাবে মিডিয়া লাইব্রেরিতে যুক্ত হয়েছে।" : "Photo and details added to media library successfully."
        });
      } else {
        setAlertInfo({
          title: language === "bn" ? "ত্রুটি" : "Error",
          message: language === "bn" ? "আপলোড করতে ব্যর্থ হয়েছে।" : "Upload failed."
        });
      }
    } catch (err) {
      console.error(err);
      setAlertInfo({
        title: language === "bn" ? "ত্রুটি" : "Error",
        message: language === "bn" ? "সার্ভারের সাথে যোগাযোগে সমস্যা হয়েছে।" : "Failed to connect to server."
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setUploading(true);

    try {
      const payload = {
        ...editingItem,
        url: editFileBase64 || editingItem.url,
        size: editFileBase64 ? `${Math.round((editFileBase64.length * 3) / 4 / 1024)} KB` : editingItem.size,
      };

      const res = await fetch(`/api/media/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const resData = await res.json();
        const updated = resData.media || resData.event || resData;
        setMediaItems(mediaItems.map((m) => (m._id === updated._id ? updated : m)));
        setEditingItem(null);
        setEditFileBase64("");
        setAlertInfo({
          title: language === "bn" ? "সফলভাবে সংরক্ষিত" : "Updated Successfully",
          message: language === "bn" ? "ছবির সমস্ত তথ্য ও পরিবর্তন সফলভাবে সংরক্ষণ করা হয়েছে।" : "All photo details have been saved successfully."
        });
      } else {
        setAlertInfo({
          title: language === "bn" ? "ত্রুটি" : "Error",
          message: language === "bn" ? "তথ্য আপডেট করতে ব্যর্থ হয়েছে।" : "Failed to update photo details."
        });
      }
    } catch (err) {
      console.error(err);
      setAlertInfo({
        title: language === "bn" ? "ত্রুটি" : "Error",
        message: language === "bn" ? "সার্ভারে সমস্যা হয়েছে।" : "Server error occurred."
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteTargetMedia({ id, title });
  };

  const confirmDeleteMedia = async () => {
    if (!deleteTargetMedia) return;
    try {
      const res = await fetch(`/api/media/${deleteTargetMedia.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMediaItems(mediaItems.filter((item) => item._id !== deleteTargetMedia.id));
        setDeleteTargetMedia(null);
        setAlertInfo({
          title: language === "bn" ? "সফলভাবে মুছে ফেলা হয়েছে" : "Deleted Successfully",
          message: language === "bn" ? "মিডিয়া ফাইলটি স্থায়ীভাবে মুছে ফেলা হয়েছে।" : "Media file deleted permanently."
        });
      } else {
        setDeleteTargetMedia(null);
        setAlertInfo({
          title: language === "bn" ? "ত্রুটি" : "Error",
          message: language === "bn" ? "ফাইল মুছে ফেলা যায়নি।" : "Failed to delete file."
        });
      }
    } catch (err) {
      console.error(err);
      setDeleteTargetMedia(null);
    }
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaItems.filter((item) => {
    const titleMatch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const tagMatch = item.tag?.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || tagMatch || descMatch;

    if (!matchesSearch) return false;

    if (typeFilter === "all") return true;
    if (typeFilter === "doc") return item.isDoc;
    if (typeFilter === "image") return !item.isDoc;
    return item.tag?.toUpperCase() === typeFilter.toUpperCase();
  });

  const getCategoryBadge = (tag: string) => {
    const cat = CATEGORIES.find(c => c.value === tag?.toUpperCase());
    return {
      label: language === "bn" ? (cat?.labelBn || tag || "সাধারণ") : (cat?.labelEn || tag || "General"),
      color: cat?.color || "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20"
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low dark:bg-surface-container-lowest p-6 rounded-2xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-growth-green/10 text-growth-green">
              <ImageIcon className="w-6 h-6" />
            </span>
            <h2 className="font-headline-xl text-2xl md:text-3xl text-foreground font-bold">
              {language === "bn" ? "আমাদের কার্যক্রমের ছবি ও মিডিয়া গ্যালারি" : "Activity Photos & Media Library"}
            </h2>
          </div>
          <p className="text-sm text-on-surface-variant max-w-2xl">
            {language === "bn" 
              ? "হোম পেজের কার্যক্রম গ্যালারিসহ ওয়েবসাইটের যেকোনো ছবি সরাসরি আপলোড, সমস্ত তথ্য এডিট (ক্যাপশন, ক্যাটাগরি, তারিখ, বিবরণ, ছবি পরিবর্তন) ও ডিলিট করুন।" 
              : "Easily upload, preview, and edit full details (title, category tag, date, description, photo replacement) and manage media across the website."}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={fetchMedia}
            title={language === "bn" ? "রিফ্রেশ করুন" : "Refresh"}
            className="p-2.5 border border-border rounded-xl text-foreground hover:bg-surface-variant transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-growth-green" : ""}`} />
          </button>
          <button
            onClick={() => {
              setNewTitle("");
              setNewUrl("");
              setFileBase64("");
              setNewDate("");
              setNewDescription("");
              setShowUploadModal(true);
            }}
            className="bg-growth-green hover:bg-[#236026] text-white px-5 py-2.5 font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-sm rounded-xl flex-1 sm:flex-initial"
          >
            <Plus className="w-4 h-4" />
            {language === "bn" ? "নতুন ছবি / কার্যক্রম যোগ করুন" : "Add Activity Photo"}
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-surface-container-low dark:bg-surface-container-lowest p-4 shadow-xs border border-border rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-thin">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-xl whitespace-nowrap ${
              typeFilter === "all" ? "bg-growth-green text-white shadow-xs" : "bg-surface dark:bg-background text-foreground border border-border hover:bg-surface-variant"
            }`}
          >
            {language === "bn" ? "সমস্ত মিডিয়া" : "All"} ({mediaItems.length})
          </button>
          {CATEGORIES.slice(0, 6).map((cat) => {
            const count = mediaItems.filter(m => m.tag?.toUpperCase() === cat.value).length;
            return (
              <button
                key={cat.value}
                onClick={() => setTypeFilter(cat.value)}
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-xl whitespace-nowrap flex items-center gap-1.5 ${
                  typeFilter === cat.value ? "bg-growth-green text-white shadow-xs" : "bg-surface dark:bg-background text-foreground border border-border hover:bg-surface-variant"
                }`}
              >
                <span>{language === "bn" ? cat.labelBn : cat.labelEn}</span>
                {count > 0 && <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">{count}</span>}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder={language === "bn" ? "শিরোনাম, ট্যাগ বা বিবরণ খুঁজুন..." : "Search title, tag, description..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface dark:bg-background border border-border text-foreground focus:outline-none focus:border-growth-green rounded-xl"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-foreground text-xs">✕</button>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 bg-surface-container-low dark:bg-surface-container-lowest border border-border rounded-2xl">
          <Loader2 className="w-10 h-10 animate-spin text-growth-green mb-3" />
          <p className="text-sm text-on-surface-variant font-medium">
            {language === "bn" ? "মিডিয়া ফাইল লোড হচ্ছে..." : "Loading media items..."}
          </p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-surface-container-low dark:bg-surface-container-lowest p-16 text-center border border-dashed border-border rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-surface-variant/50 flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-foreground mb-1">
            {language === "bn" ? "কোনো মিডিয়া ফাইল পাওয়া যায়নি" : "No Media Files Found"}
          </h4>
          <p className="text-on-surface-variant text-xs max-w-md mx-auto mb-5">
            {searchTerm 
              ? (language === "bn" ? `"${searchTerm}" এর সাথে মিল রেখে কোনো ছবি খুঁজে পাওয়া যায়নি।` : `No photos match the filter "${searchTerm}".`)
              : (language === "bn" ? "আপনার গ্যালারিতে নতুন ছবি যোগ করতে উপরের 'নতুন ছবি যোগ করুন' বাটনে ক্লিক করুন।" : "Click 'Add Activity Photo' to upload your first image.")}
          </p>
          <button
            onClick={() => { setSearchTerm(""); setTypeFilter("all"); setShowUploadModal(true); }}
            className="px-4 py-2 bg-growth-green text-white font-bold text-xs rounded-xl hover:bg-[#236026] transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {language === "bn" ? "নতুন ছবি আপলোড করুন" : "Upload First Photo"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredMedia.map((item) => {
            const badge = getCategoryBadge(item.tag);
            return (
              <div 
                key={item._id} 
                className="group bg-surface-container-low dark:bg-surface-container-lowest border border-border shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between rounded-2xl hover:border-growth-green/40"
              >
                {/* Image Container with Overlay */}
                <div className="relative aspect-4/3 bg-surface dark:bg-surface-variant/20 flex items-center justify-center overflow-hidden">
                  {!item.isDoc ? (
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="p-6 text-center flex flex-col items-center justify-center text-on-surface-variant">
                      <FileText className="w-12 h-12 mb-2 text-growth-green" />
                      <span className="text-[11px] font-bold">Document</span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center pointer-events-none">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border backdrop-blur-md bg-white/90 dark:bg-black/70 shadow-xs ${badge.color}`}>
                      {badge.label}
                    </span>
                    {item.date && (
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded-lg bg-black/60 text-white backdrop-blur-md flex items-center gap-1 shadow-xs">
                        <Calendar className="w-2.5 h-2.5" />
                        {item.date}
                      </span>
                    )}
                  </div>
                  
                  {/* Quick Desktop Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingItem({ ...item });
                        setEditFileBase64("");
                      }}
                      className="w-8 h-8 bg-white text-slate-800 hover:text-growth-green hover:scale-110 flex items-center justify-center shadow-md cursor-pointer rounded-xl transition-all"
                      title={language === "bn" ? "সম্পাদনা করুন" : "Edit Details"}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(item._id, item.url)}
                      className="w-8 h-8 bg-white text-slate-800 hover:text-growth-green hover:scale-110 flex items-center justify-center shadow-md cursor-pointer rounded-xl transition-all"
                      title={language === "bn" ? "লিঙ্ক কপি করুন" : "Copy URL"}
                    >
                      {copiedId === item._id ? <Check className="w-4 h-4 text-growth-green" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="w-8 h-8 bg-white text-slate-800 hover:text-reliability-blue hover:scale-110 flex items-center justify-center shadow-md cursor-pointer rounded-xl transition-all"
                      title={language === "bn" ? "প্রিভিউ দেখুন" : "Preview"}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {item._id && (
                      <button
                        onClick={() => handleDelete(item._id, item.title)}
                        className="w-8 h-8 bg-white text-rose-600 hover:bg-rose-600 hover:text-white hover:scale-110 flex items-center justify-center shadow-md cursor-pointer transition-all rounded-xl"
                        title={language === "bn" ? "মুছে ফেলুন" : "Delete"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Details & Action Footer */}
                <div className="p-3.5 bg-surface dark:bg-background border-t border-border flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xs font-bold text-foreground line-clamp-1 mb-1" title={item.title}>
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="text-[11px] text-on-surface-variant line-clamp-2 mb-2">
                        {item.description}
                      </p>
                    ) : (
                      <div className="flex justify-between items-center text-[10px] text-on-surface-variant mb-2">
                        <span>{item.size || "1.0 MB"}</span>
                        <span>{item.isDoc ? "PDF/Doc" : "Image"}</span>
                      </div>
                    )}
                  </div>

                  {/* Explicit Action Buttons */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => {
                        setEditingItem({ ...item });
                        setEditFileBase64("");
                      }}
                      className="flex-1 py-1.5 px-2 text-[11px] font-bold bg-growth-green/10 hover:bg-growth-green text-growth-green hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title={language === "bn" ? "ছবির সমস্ত তথ্য ও ছবি এডিট করুন" : "Edit photo details"}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{language === "bn" ? "সম্পাদনা" : "Edit"}</span>
                    </button>

                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-1.5 text-on-surface-variant hover:text-foreground hover:bg-surface-variant rounded-lg transition-colors cursor-pointer"
                      title={language === "bn" ? "প্রিভিউ দেখুন" : "Preview"}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleCopy(item._id, item.url)}
                      className="p-1.5 text-on-surface-variant hover:text-growth-green hover:bg-surface-variant rounded-lg transition-colors cursor-pointer"
                      title={language === "bn" ? "লিঙ্ক কপি" : "Copy URL"}
                    >
                      {copiedId === item._id ? <Check className="w-3.5 h-3.5 text-growth-green" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      className="p-1.5 text-on-surface-variant hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                      title={language === "bn" ? "মুছে ফেলুন" : "Delete"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comprehensive Edit Media Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest dark:bg-surface-container-low w-full max-w-xl border border-border shadow-2xl p-6 animate-in zoom-in-95 rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-growth-green/10 text-growth-green">
                  <Edit3 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    {language === "bn" ? "ছবির সমস্ত তথ্য ও ছবি সম্পাদনা করুন" : "Edit Photo & Details"}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {language === "bn" ? "ক্যাপশন, ক্যাটাগরি, তারিখ, বিস্তারিত বিবরণ ও নতুন ছবি প্রতিস্থাপন করুন।" : "Update caption, category, date, description, and replace image."}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setEditingItem(null); setEditFileBase64(""); }} 
                className="text-on-surface-variant hover:text-foreground font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Photo Preview & Replacement Box */}
              <div className="p-3.5 bg-surface dark:bg-background border border-border rounded-xl">
                <label className="block text-xs font-bold mb-2 text-foreground flex items-center justify-between">
                  <span>{language === "bn" ? "বর্তমান ছবি / ফাইল প্রতিস্থাপন" : "Photo / Replace File"}</span>
                  {editFileBase64 && (
                    <span className="text-[10px] font-bold text-growth-green bg-growth-green/10 px-2 py-0.5 rounded-md">
                      {language === "bn" ? "✓ নতুন ছবি নির্বাচিত" : "✓ New Photo Selected"}
                    </span>
                  )}
                </label>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-24 h-24 rounded-xl border border-border overflow-hidden bg-surface-variant/30 flex items-center justify-center shrink-0">
                    <img 
                      src={editFileBase64 || editingItem.url} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs text-on-surface-variant">
                      {language === "bn" 
                        ? "এই ছবিটি পরিবর্তন করতে চাইলে নতুন ছবি সিলেক্ট করুন অথবা নিচে সরাসরি URL দিন।" 
                        : "Select a new image file to replace this photo, or edit the direct URL."}
                    </p>
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-surface-variant hover:bg-surface-variant/80 border border-border rounded-xl cursor-pointer text-foreground transition-colors">
                      <FileUp className="w-3.5 h-3.5 text-growth-green" />
                      <span>{language === "bn" ? "ডিভাইস থেকে নতুন ছবি দিন" : "Choose New Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditFileUpload}
                        className="hidden"
                      />
                    </label>
                    {editFileBase64 && (
                      <button
                        type="button"
                        onClick={() => setEditFileBase64("")}
                        className="text-[11px] text-rose-600 underline ml-2 cursor-pointer"
                      >
                        {language === "bn" ? "বাতিল করে আগেরটি রাখুন" : "Revert to original"}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium mb-1 text-on-surface-variant">
                    {language === "bn" ? "অথবা সরাসরি ইমেজ পাথ / URL" : "Or Direct Image URL"}
                  </label>
                  <input
                    type="text"
                    value={editingItem.url}
                    onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                    className="w-full bg-surface-variant/40 dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground rounded-xl"
                  />
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">
                  {language === "bn" ? "কার্যক্রমের ক্যাপশন / শিরোনাম" : "Caption / Title"} *
                </label>
                <input
                  required
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="যেমন: বন্যা কবলিত এলাকায় ত্রাণ সামগ্রী বিতরণ"
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl focus:border-growth-green focus:outline-none"
                />
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-growth-green" />
                    <span>{language === "bn" ? "ক্যাটাগরি ট্যাগ" : "Category Tag"}</span>
                  </label>
                  <select
                    value={editingItem.tag || "GALLERY"}
                    onChange={(e) => setEditingItem({ ...editingItem, tag: e.target.value })}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground rounded-xl cursor-pointer focus:border-growth-green focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>
                        {language === "bn" ? `${c.labelBn} (${c.value})` : `${c.labelEn} (${c.value})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-growth-green" />
                    <span>{language === "bn" ? "কার্যক্রমের তারিখ" : "Activity Date"}</span>
                  </label>
                  <input
                    type="date"
                    value={editingItem.date || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground rounded-xl focus:border-growth-green focus:outline-none"
                  />
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">
                  {language === "bn" ? "কার্যক্রমের বিস্তারিত বিবরণ ও নোট" : "Description & Activity Details"}
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder={language === "bn" ? "কার্যক্রমের স্থান, উপকারভোগীদের সংখ্যা বা গুরুত্বপূর্ণ তথ্য লিখুন..." : "Enter location, participants, or details..."}
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground rounded-xl focus:border-growth-green focus:outline-none resize-none"
                />
              </div>

              {/* File Type Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editIsDoc"
                  checked={!!editingItem.isDoc}
                  onChange={(e) => setEditingItem({ ...editingItem, isDoc: e.target.checked })}
                  className="rounded text-growth-green focus:ring-growth-green cursor-pointer"
                />
                <label htmlFor="editIsDoc" className="text-xs text-foreground font-medium cursor-pointer">
                  {language === "bn" ? "এটি একটি ডকুমেন্ট / পিডিএফ ফাইল" : "This is a document / PDF file"}
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button 
                  type="button" 
                  onClick={() => { setEditingItem(null); setEditFileBase64(""); }} 
                  className="px-4 py-2 border border-border text-foreground font-bold text-xs cursor-pointer rounded-xl hover:bg-surface-variant transition-colors"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button 
                  type="submit" 
                  disabled={uploading} 
                  className="px-5 py-2 bg-growth-green text-white font-bold text-xs hover:bg-[#236026] flex items-center gap-2 cursor-pointer rounded-xl shadow-xs transition-all"
                >
                  {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <Save className="w-3.5 h-3.5" />
                  {uploading 
                    ? (language === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") 
                    : (language === "bn" ? "পরিবর্তন সংরক্ষণ করুন" : "Save Changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload New Media Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest dark:bg-surface-container-low w-full max-w-xl border border-border shadow-2xl p-6 animate-in zoom-in-95 rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-growth-green/10 text-growth-green">
                  <Upload className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    {language === "bn" ? "নতুন কার্যক্রমের ছবি আপলোড করুন" : "Upload New Activity Photo"}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {language === "bn" ? "ক্যাপশন, ক্যাটাগরি ও বিবরণ দিয়ে ছবি যোগ করুন।" : "Add photo with caption, category, and details."}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)} 
                className="text-on-surface-variant hover:text-foreground font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Image File Selector */}
              <div className="p-3.5 bg-surface dark:bg-background border border-border rounded-xl">
                <label className="block text-xs font-bold mb-2 text-foreground">
                  {language === "bn" ? "ছবি বা ডকুমেন্ট নির্বাচন করুন *" : "Select Photo or Document *"}
                </label>
                
                {fileBase64 ? (
                  <div className="flex items-center gap-4 mb-2">
                    <div className="relative w-20 h-20 rounded-xl border border-border overflow-hidden bg-surface-variant/30 shrink-0">
                      <img src={fileBase64} alt="Selected preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground truncate">{newTitle || "Selected File"}</p>
                      <p className="text-[11px] text-growth-green font-medium mt-0.5">✓ {language === "bn" ? "ছবি প্রস্তুত আছে" : "Photo ready"}</p>
                      <button
                        type="button"
                        onClick={() => setFileBase64("")}
                        className="text-[11px] text-rose-600 underline mt-1 cursor-pointer"
                      >
                        {language === "bn" ? "অন্য ছবি পছন্দ করুন" : "Change photo"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="w-full bg-surface-variant/30 dark:bg-background border border-border px-3 py-2 text-xs text-foreground cursor-pointer rounded-xl file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-growth-green file:text-white"
                  />
                )}

                <div className="mt-2.5 pt-2 border-t border-border/60">
                  <label className="block text-[11px] font-medium mb-1 text-on-surface-variant">
                    {language === "bn" ? "অথবা সরাসরি ইমেজ লিঙ্ক (URL)" : "Or Direct Image URL"}
                  </label>
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="/up-1.jpeg অথবা https://..."
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground rounded-xl"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">
                  {language === "bn" ? "কার্যক্রমের ক্যাপশন / শিরোনাম" : "Activity Caption / Title"} *
                </label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={language === "bn" ? "যেমন: শীতবস্ত্র বিতরণ ২০২৬" : "e.g. Winter Clothing Distribution 2026"}
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl focus:border-growth-green focus:outline-none"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-growth-green" />
                    <span>{language === "bn" ? "ক্যাটাগরি ট্যাগ" : "Category Tag"}</span>
                  </label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground rounded-xl cursor-pointer focus:border-growth-green focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>
                        {language === "bn" ? `${c.labelBn} (${c.value})` : `${c.labelEn} (${c.value})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-growth-green" />
                    <span>{language === "bn" ? "কার্যক্রমের তারিখ" : "Activity Date"}</span>
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground rounded-xl focus:border-growth-green focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">
                  {language === "bn" ? "কার্যক্রমের বিস্তারিত বিবরণ ও নোট" : "Description & Notes"}
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder={language === "bn" ? "কার্যক্রমের প্রেক্ষাপট, স্থান ও অন্যান্য তথ্য..." : "Details about the activity, participants, impact..."}
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground rounded-xl focus:border-growth-green focus:outline-none resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button 
                  type="button" 
                  onClick={() => setShowUploadModal(false)} 
                  className="px-4 py-2 border border-border text-foreground font-bold text-xs cursor-pointer rounded-xl hover:bg-surface-variant transition-colors"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button 
                  type="submit" 
                  disabled={uploading} 
                  className="px-5 py-2 bg-growth-green text-white font-bold text-xs hover:bg-[#236026] flex items-center gap-2 cursor-pointer rounded-xl shadow-xs transition-all"
                >
                  {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {uploading 
                    ? (language === "bn" ? "আপলোড হচ্ছে..." : "Uploading...") 
                    : (language === "bn" ? "আপলোড সম্পন্ন করুন" : "Complete Upload")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setPreviewItem(null)}
        >
          <div 
            className="max-w-3xl w-full bg-surface dark:bg-surface-container-lowest p-5 border border-border rounded-2xl shadow-2xl overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border ${getCategoryBadge(previewItem.tag).color}`}>
                    {getCategoryBadge(previewItem.tag).label}
                  </span>
                  {previewItem.date && (
                    <span className="text-xs text-on-surface-variant flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {previewItem.date}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-base text-foreground">{previewItem.title}</h4>
              </div>
              <button 
                onClick={() => setPreviewItem(null)} 
                className="font-bold text-on-surface-variant hover:text-foreground cursor-pointer p-1.5 rounded-lg hover:bg-surface-variant"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-black/5 dark:bg-black/30 border border-border/50 max-h-[60vh] flex items-center justify-center mb-4">
              {!previewItem.isDoc ? (
                <img 
                  src={previewItem.url} 
                  alt={previewItem.title} 
                  className="max-h-[58vh] max-w-full object-contain mx-auto" 
                />
              ) : (
                <div className="p-12 text-center">
                  <FileText className="w-16 h-16 mx-auto text-growth-green mb-4" />
                  <a 
                    href={previewItem.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-growth-green text-white font-bold rounded-xl text-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {language === "bn" ? "ডকুমেন্ট নতুন ট্যাবে ওপেন করুন" : "Open Document in New Tab"}
                  </a>
                </div>
              )}
            </div>

            {previewItem.description && (
              <div className="p-3 bg-surface-variant/30 rounded-xl mb-4 border border-border/50">
                <p className="text-xs text-foreground">{previewItem.description}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-on-surface-variant">{previewItem.size || "1.0 MB"}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(previewItem._id, previewItem.url)}
                  className="px-3 py-1.5 text-xs font-bold border border-border rounded-xl hover:bg-surface-variant flex items-center gap-1.5 cursor-pointer text-foreground"
                >
                  {copiedId === previewItem._id ? <Check className="w-3.5 h-3.5 text-growth-green" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === previewItem._id ? (language === "bn" ? "কপি হয়েছে" : "Copied") : (language === "bn" ? "লিঙ্ক কপি" : "Copy URL")}</span>
                </button>
                <button
                  onClick={() => {
                    const target = previewItem;
                    setPreviewItem(null);
                    setEditingItem({ ...target });
                    setEditFileBase64("");
                  }}
                  className="px-4 py-1.5 text-xs font-bold bg-growth-green text-white rounded-xl hover:bg-[#236026] flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "সম্পাদনা করুন" : "Edit Photo"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetMedia}
        onClose={() => setDeleteTargetMedia(null)}
        onConfirm={confirmDeleteMedia}
        title={language === "bn" ? "ছবি মুছে ফেলার নিশ্চয়তা" : "Confirm Delete"}
        message={language === "bn" 
          ? `আপনি কি নিশ্চিতভাবে "${deleteTargetMedia?.title}" ছবিটি মুছে ফেলতে চান? এটি ওয়েবসাইটের সমস্ত গ্যালারি থেকেও মুছে যাবে।` 
          : `Are you sure you want to delete "${deleteTargetMedia?.title}"? It will also be removed from the gallery.`}
        confirmText={language === "bn" ? "হ্যাঁ, মুছে ফেলুন" : "Yes, Delete"}
        cancelText={language === "bn" ? "বাতিল" : "Cancel"}
        type="danger"
      />

      {/* Feedback Alert Modal */}
      <AlertModal
        isOpen={!!alertInfo}
        onClose={() => setAlertInfo(null)}
        title={alertInfo?.title || ""}
        message={alertInfo?.message || ""}
        type="info"
      />
    </div>
  );
}
