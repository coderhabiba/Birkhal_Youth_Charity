"use client";

import { useState, useEffect } from "react";
import { Upload, Search, Edit, Image as ImageIcon, Trash2, Copy, Check, Eye, Plus, FileText, Loader2, Save } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import { ConfirmModal, AlertModal } from "@/components/confirm-modal";

export default function MediaLibraryPage() {
  const { language } = useLanguage();
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<any | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newTag, setNewTag] = useState("GALLERY");
  const [newUrl, setNewUrl] = useState("");
  const [fileBase64, setFileBase64] = useState("");

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.media || []);
        if (list.length === 0) {
          const defaultItems = [
            { title: "বীরখাল সমাজ কল্যাণ যুব সংগঠনের ঐক্যবদ্ধ সমাজসেবা কার্যক্রম", url: "/up-1.jpeg", size: "950 KB", tag: "ACTIVITIES", isDoc: false },
            { title: "বন্যা ও দুর্যোগকালীন জরুরি ত্রাণ বিতরণ", url: "/ai_relief.jpg", size: "1.1 MB", tag: "RELIEF", isDoc: false },
            { title: "দরিদ্র শিক্ষার্থীদের মাঝে শিক্ষাসামগ্রী বিতরণ", url: "/ai_education.jpg", size: "930 KB", tag: "EDUCATION", isDoc: false },
            { title: "বীরখাল সবুজায়ন ও পরিবেশ সুরক্ষা বৃক্ষরোপণ", url: "/ai_plantation.jpg", size: "1.0 MB", tag: "PLANTATION", isDoc: false },
            { title: "বিনামূল্যে জরুরি স্বাস্থ্যসেবা ও চিকিৎসা সহায়তা", url: "/ai_medical.jpg", size: "1.0 MB", tag: "RELIEF", isDoc: false },
            { title: "বীরখাল সমাজসেবামূলক সম্মেলন ও যুব সমাবেশ", url: "/up-2.jpeg", size: "1.2 MB", tag: "GALLERY", isDoc: false },
          ];
          for (const item of defaultItems) {
            await fetch("/api/media", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item),
            });
          }
          const seeded = await fetch("/api/media");
          const seededData = await seeded.json();
          setMediaItems(Array.isArray(seededData) ? seededData : (seededData.media || []));
        } else {
          setMediaItems(list);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewTitle(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [alertInfo, setAlertInfo] = useState<{ title: string; message: string } | null>(null);
  const [deleteTargetMedia, setDeleteTargetMedia] = useState<{ id: string; title: string } | null>(null);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = fileBase64 || newUrl;
    if (!finalUrl) {
      setAlertInfo({
        title: language === "bn" ? "ফাইল প্রয়োজন" : "File Required",
        message: language === "bn" ? "অনুগ্রহ করে ফাইল নির্বাচন করুন অথবা একটি সরাসরি ইমেজ লিঙ্ক দিন।" : "Please select a file or enter a valid image URL."
      });
      return;
    }

    setUploading(true);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle || "Activity Photo",
          url: finalUrl,
          tag: newTag,
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
      } else {
        setAlertInfo({
          title: language === "bn" ? "ত্রুটি" : "Error",
          message: language === "bn" ? "আপলোড ব্যর্থ হয়েছে।" : "Upload failed."
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setUploading(true);

    try {
      const res = await fetch(`/api/media/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        const resData = await res.json();
        const updated = resData.media || resData.event || resData;
        setMediaItems(mediaItems.map((m) => (m._id === updated._id ? updated : m)));
        setEditingItem(null);
      } else {
        setAlertInfo({
          title: language === "bn" ? "ত্রুটি" : "Error",
          message: language === "bn" ? "আপডেট করতে ব্যর্থ হয়েছে।" : "Failed to update media."
        });
      }
    } catch (err) {
      console.error(err);
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
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.tag?.toLowerCase().includes(searchTerm.toLowerCase());
    if (typeFilter === "image") return matchesSearch && !item.isDoc;
    if (typeFilter === "doc") return matchesSearch && item.isDoc;
    if (typeFilter !== "all") return matchesSearch && item.tag?.toUpperCase() === typeFilter.toUpperCase();
    return matchesSearch;
  });

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="font-headline-xl text-3xl md:text-4xl text-foreground font-bold mb-1">
            {language === "bn" ? "আমাদের কার্যক্রমের ছবি ও মিডিয়া গ্যালারি" : "Activity Photos & Media Library"}
          </h2>
          <p className="font-body-md text-on-surface-variant">
            {language === "bn" 
              ? "হোম পেজের কার্যক্রম গ্যালারি এবং ওয়েবসাইটের সমস্ত ছবি সরাসরি আপলোড, এডিট ও ডিলিট করুন।" 
              : "Upload, edit, and delete activity photos and media shown in Home gallery and across the portal."}
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-growth-green hover:bg-[#236026] text-white px-5 py-2.5 font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer text-sm rounded-xl"
        >
          <Upload className="w-4 h-4" />
          {language === "bn" ? "নতুন ছবি / কার্যক্রম যোগ করুন" : "Add Activity Photo"}
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest dark:bg-surface-container-low w-full max-w-lg border border-border shadow-2xl p-6 animate-in zoom-in-95 rounded-xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">{language === "bn" ? "নতুন কার্যক্রমের ছবি আপলোড" : "Upload Activity Photo"}</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-on-surface-variant hover:text-foreground font-bold p-1 rounded-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "কার্যক্রমের নাম / ক্যাপশন" : "Activity Title"} *</label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: শীতবস্ত্র বিতরণ ২০২৬"
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "ফাইল আপলোড করুন (ছবি/নথি)" : "Select Image File"}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground cursor-pointer rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "অথবা সরাসরি ইমেজ লিঙ্ক (URL)" : "Or Direct Image URL"}</label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="/support1.jpeg অথবা https://..."
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "ক্যাটাগরি ট্যাগ" : "Category Tag"}</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl cursor-pointer"
                >
                  <option value="GALLERY">GALLERY (কার্যক্রম গ্যালারি)</option>
                  <option value="YOUTH">YOUTH (যুব উন্নয়ন)</option>
                  <option value="RELIEF">RELIEF (ত্রাণ ও পুনর্বাসন)</option>
                  <option value="EDUCATION">EDUCATION (শিক্ষা সহায়তা)</option>
                  <option value="PLANTATION">PLANTATION (বৃক্ষরোপণ)</option>
                  <option value="MEMBERS">MEMBERS (সদস্যবৃন্দ)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 border border-border text-foreground font-bold text-xs cursor-pointer rounded-xl hover:bg-surface-variant">
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button type="submit" disabled={uploading} className="px-5 py-2 bg-growth-green text-white font-bold text-xs hover:bg-[#236026] flex items-center gap-2 cursor-pointer rounded-xl">
                  {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {uploading ? (language === "bn" ? "আপলোড হচ্ছে..." : "Uploading...") : (language === "bn" ? "আপলোড সম্পন্ন করুন" : "Upload")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Media Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest dark:bg-surface-container-low w-full max-w-lg border border-border shadow-2xl p-6 animate-in zoom-in-95 rounded-xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">{language === "bn" ? "কার্যক্রমের ছবি ও তথ্য সম্পাদনা" : "Edit Activity Photo"}</h3>
              <button onClick={() => setEditingItem(null)} className="text-on-surface-variant hover:text-foreground font-bold p-1 rounded-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "ক্যাপশন / শিরোনাম" : "Title"} *</label>
                <input
                  required
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "ইমেজ পাথ / URL" : "Image URL"} *</label>
                <input
                  required
                  type="text"
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "ক্যাটাগরি ট্যাগ" : "Category Tag"}</label>
                <select
                  value={editingItem.tag || "GALLERY"}
                  onChange={(e) => setEditingItem({ ...editingItem, tag: e.target.value })}
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl cursor-pointer"
                >
                  <option value="GALLERY">GALLERY (কার্যক্রম গ্যালারি)</option>
                  <option value="YOUTH">YOUTH (যুব উন্নয়ন)</option>
                  <option value="RELIEF">RELIEF (ত্রাণ ও পুনর্বাসন)</option>
                  <option value="EDUCATION">EDUCATION (শিক্ষা সহায়তা)</option>
                  <option value="PLANTATION">PLANTATION (বৃক্ষরোপণ)</option>
                  <option value="MEMBERS">MEMBERS (সদস্যবৃন্দ)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 border border-border text-foreground font-bold text-xs cursor-pointer rounded-xl hover:bg-surface-variant">
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button type="submit" disabled={uploading} className="px-5 py-2 bg-growth-green text-white font-bold text-xs hover:bg-[#236026] flex items-center gap-2 cursor-pointer rounded-xl">
                  {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <Save className="w-3.5 h-3.5" />
                  {uploading ? (language === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : (language === "bn" ? "পরিবর্তন সংরক্ষণ করুন" : "Save Changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-surface-container-low dark:bg-surface-container-lowest p-4 mb-6 shadow-sm border border-border flex flex-col sm:flex-row gap-4 items-center justify-between backdrop-blur-md rounded-xl">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer rounded-xl ${typeFilter === "all" ? "bg-growth-green text-white" : "bg-surface dark:bg-background text-foreground border border-border"}`}
          >
            {language === "bn" ? "সমস্ত মিডিয়া" : "All"} ({mediaItems.length})
          </button>
          <button
            onClick={() => setTypeFilter("GALLERY")}
            className={`px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer rounded-xl ${typeFilter === "GALLERY" ? "bg-growth-green text-white" : "bg-surface dark:bg-background text-foreground border border-border"}`}
          >
            {language === "bn" ? "কার্যক্রম গ্যালারি" : "Gallery"}
          </button>
          <button
            onClick={() => setTypeFilter("YOUTH")}
            className={`px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer rounded-xl ${typeFilter === "YOUTH" ? "bg-growth-green text-white" : "bg-surface dark:bg-background text-foreground border border-border"}`}
          >
            {language === "bn" ? "যুব উন্নয়ন" : "Youth"}
          </button>
          <button
            onClick={() => setTypeFilter("RELIEF")}
            className={`px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer rounded-xl ${typeFilter === "RELIEF" ? "bg-growth-green text-white" : "bg-surface dark:bg-background text-foreground border border-border"}`}
          >
            {language === "bn" ? "ত্রাণ বিতরণ" : "Relief"}
          </button>
          <button
            onClick={() => setTypeFilter("EDUCATION")}
            className={`px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer rounded-xl ${typeFilter === "EDUCATION" ? "bg-growth-green text-white" : "bg-surface dark:bg-background text-foreground border border-border"}`}
          >
            {language === "bn" ? "শিক্ষা" : "Education"}
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder={language === "bn" ? "মিডিয়া খুঁজুন..." : "Search media..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface dark:bg-background border border-border text-foreground focus:outline-none focus:border-growth-green rounded-xl"
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="w-8 h-8 animate-spin text-growth-green" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-surface-container-low dark:bg-surface-container-lowest p-12 text-center border border-dashed border-border rounded-xl">
          <ImageIcon className="w-12 h-12 text-on-surface-variant mx-auto mb-3" />
          <p className="text-on-surface-variant text-sm">{language === "bn" ? "কোনো মিডিয়া ফাইল পাওয়া যায়নি।" : "No media files found."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div key={item._id} className="group bg-surface-container-low dark:bg-surface-container-lowest border border-border shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between rounded-xl">
              <div className="relative aspect-video sm:aspect-square bg-surface dark:bg-surface-variant/20 flex items-center justify-center overflow-hidden">
                {!item.isDoc ? (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <FileText className="w-12 h-12 text-on-surface-variant" />
                )}
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="w-8 h-8 bg-white text-black hover:text-growth-green flex items-center justify-center shadow-sm cursor-pointer rounded-lg"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopy(item._id, item.url)}
                    className="w-8 h-8 bg-white text-black hover:text-growth-green flex items-center justify-center shadow-sm cursor-pointer rounded-lg"
                    title="Copy URL"
                  >
                    {copiedId === item._id ? <Check className="w-3.5 h-3.5 text-growth-green" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="w-8 h-8 bg-white text-black hover:text-reliability-blue flex items-center justify-center shadow-sm cursor-pointer rounded-lg"
                    title="Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  {item._id && (
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      className="w-8 h-8 bg-white text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center shadow-sm cursor-pointer transition-colors rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-3 bg-surface dark:bg-background border-t border-border">
                <h3 className="text-xs font-bold text-foreground truncate" title={item.title}>{item.title}</h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[11px] text-on-surface-variant">
                    {item.size || "1.0 MB"}
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-growth-green/10 text-growth-green border border-growth-green/20 rounded-md">{item.tag || "GALLERY"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewItem(null)}>
          <div className="max-w-3xl max-h-[85vh] bg-surface dark:bg-surface-container-lowest p-4 border border-border rounded-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-sm text-foreground">{previewItem.title}</h4>
              <button onClick={() => setPreviewItem(null)} className="font-bold text-on-surface-variant cursor-pointer p-1 rounded-lg">✕</button>
            </div>
            {!previewItem.isDoc ? (
              <img src={previewItem.url} alt={previewItem.title} className="max-h-[70vh] object-contain mx-auto rounded-lg" />
            ) : (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-on-surface-variant mb-4" />
                <a href={previewItem.url} target="_blank" rel="noreferrer" className="text-reliability-blue font-bold underline">
                  {language === "bn" ? "ডকুমেন্ট ওপেন করুন" : "Open Document in New Tab"}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modern Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetMedia}
        onClose={() => setDeleteTargetMedia(null)}
        onConfirm={confirmDeleteMedia}
        title={language === "bn" ? "মিডিয়া মুছে ফেলার নিশ্চয়তা" : "Delete Media"}
        message={language === "bn" ? `আপনি কি নিশ্চিতভাবে "${deleteTargetMedia?.title}" মিডিয়া ফাইলটি মুছে ফেলতে চান?` : `Are you sure you want to delete "${deleteTargetMedia?.title}"?`}
        confirmText={language === "bn" ? "হ্যাঁ, মুছে ফেলুন" : "Yes, Delete"}
        cancelText={language === "bn" ? "বাতিল" : "Cancel"}
        type="danger"
      />

      {/* Modern Feedback Alert Modal */}
      <AlertModal
        isOpen={!!alertInfo}
        onClose={() => setAlertInfo(null)}
        title={alertInfo?.title || ""}
        message={alertInfo?.message || ""}
        type="info"
      />
    </>
  );
}
