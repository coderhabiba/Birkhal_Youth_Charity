"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/components/language-provider";
import { 
  Plus, 
  FileText, 
  Trash2, 
  Edit, 
  Eye, 
  Save, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  Upload, 
  HelpCircle, 
  LayoutGrid, 
  Type, 
  MousePointerClick, 
  CheckCircle2, 
  Loader2, 
  ExternalLink,
  ChevronRight,
  Menu,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AlertModal, ConfirmModal } from "@/components/confirm-modal";

interface ISection {
  id: string;
  type: "hero" | "text_block" | "cards_grid" | "image_gallery" | "faq_accordion" | "cta_box";
  titleBn?: string;
  titleEn?: string;
  contentBn?: string;
  contentEn?: string;
  bannerImage?: string;
  buttonTextBn?: string;
  buttonTextEn?: string;
  buttonUrl?: string;
  items?: Array<{
    titleBn?: string;
    titleEn?: string;
    descBn?: string;
    descEn?: string;
    image?: string;
    link?: string;
  }>;
}

interface ICustomPage {
  _id?: string;
  titleBn: string;
  titleEn: string;
  slug: string;
  subtitleBn?: string;
  subtitleEn?: string;
  bannerImage?: string;
  showInNavbar: boolean;
  showInFooter: boolean;
  status: "published" | "draft";
  sections: ISection[];
  createdAt?: string;
}

export default function CustomPagesManager() {
  const { language } = useLanguage();
  const [pages, setPages] = useState<ICustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<ICustomPage | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [deleteTargetSlug, setDeleteTargetSlug] = useState<string | null>(null);

  // Load all pages
  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/pages");
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (err) {
      console.error("Failed to load custom pages", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewPage = () => {
    setEditingPage({
      titleBn: "",
      titleEn: "",
      slug: "",
      subtitleBn: "",
      subtitleEn: "",
      bannerImage: "",
      showInNavbar: true,
      showInFooter: true,
      status: "published",
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          type: "text_block",
          titleBn: "কার্যক্রমের বিস্তারিত পরিচিতি",
          titleEn: "Program Overview",
          contentBn: "বীরখাল সমাজ কল্যাণ যুব সংগঠনের এই উদ্যোগ সম্পর্কে বিস্তারিত তথ্য লিখুন...",
          contentEn: "Detailed information about this specific community program..."
        }
      ]
    });
    setIsCreatingNew(true);
  };

  const handleEditPage = (page: ICustomPage) => {
    setEditingPage({ ...page, sections: page.sections || [] });
    setIsCreatingNew(false);
  };

  // Add Section to currently editing page
  const handleAddSection = (type: ISection["type"]) => {
    if (!editingPage) return;
    const newSection: ISection = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      titleBn: type === "text_block" ? "নতুন অনুচ্ছেদ শিরোনাম" :
               type === "cards_grid" ? "গুরুত্বপূর্ণ সুবিধাসমূহ" :
               type === "faq_accordion" ? "সাধারণ প্রশ্নোত্তর (FAQ)" :
               type === "cta_box" ? "আমাদের সাথে যুক্ত হোন" : "ফটো অ্যালবাম",
      titleEn: type === "text_block" ? "Section Heading" :
               type === "cards_grid" ? "Key Highlights" :
               type === "faq_accordion" ? "Frequently Asked Questions" :
               type === "cta_box" ? "Join / Support Our Mission" : "Photo Showcase",
      contentBn: "এখানে সেকশনের বিস্তারিত বিবরণী লিখুন...",
      contentEn: "Write detailed content description here...",
      items: type === "cards_grid" ? [
        { titleBn: "সুবিধা ১", titleEn: "Feature 1", descBn: "বিবরণ...", descEn: "Details..." },
        { titleBn: "সুবিধা ২", titleEn: "Feature 2", descBn: "বিবরণ...", descEn: "Details..." },
        { titleBn: "সুবিধা ৩", titleEn: "Feature 3", descBn: "বিবরণ...", descEn: "Details..." },
      ] : type === "faq_accordion" ? [
        { titleBn: "কেমন করে এই সুবিধা পাওয়া যাবে?", titleEn: "How to apply?", descBn: "অনলাইনে ফরম পূরণ করে অথবা সরাসরি যোগাযোগ করুন।", descEn: "Fill out the online application or contact us directly." },
        { titleBn: "কারা এতে অংশগ্রহণ করতে পারবে?", titleEn: "Who is eligible?", descBn: "গ্রামের যেকোনো নাগরিক বা সদস্য অংশগ্রহণ করতে পারবেন।", descEn: "Any village resident or member can participate." }
      ] : []
    };

    setEditingPage({
      ...editingPage,
      sections: [...editingPage.sections, newSection]
    });
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    if (!editingPage) return;
    const newSections = [...editingPage.sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setEditingPage({ ...editingPage, sections: newSections });
  };

  const handleRemoveSection = (sectionId: string) => {
    if (!editingPage) return;
    setEditingPage({
      ...editingPage,
      sections: editingPage.sections.filter(s => s.id !== sectionId)
    });
  };

  const handleSavePage = async () => {
    if (!editingPage) return;
    if (!editingPage.titleBn || !editingPage.titleEn || !editingPage.slug) {
      setAlertMessage(language === "bn" ? "দয়া করে পেজের বাংলা ও ইংরেজি নাম এবং URL স্লাগ দিন।" : "Please provide Bengali and English page titles and a URL slug.");
      return;
    }

    setSaving(true);
    try {
      const url = isCreatingNew ? "/api/pages" : `/api/pages/${editingPage.slug}`;
      const method = isCreatingNew ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPage)
      });

      if (res.ok) {
        setAlertMessage(language === "bn" ? "পেজ ও সেকশন সফলভাবে সংরক্ষিত হয়েছে!" : "Page and all dynamic sections saved successfully!");
        setEditingPage(null);
        setIsCreatingNew(false);
        fetchPages();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to save page");
      }
    } catch (err: any) {
      setAlertMessage(err.message || "Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (slug: string) => {
    try {
      const res = await fetch(`/api/pages/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setAlertMessage(language === "bn" ? "পেজটি সফলভাবে মুছে ফেলা হয়েছে।" : "Page deleted successfully.");
        setDeleteTargetSlug(null);
        fetchPages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-growth-green" />
      </div>
    );
  }

  // ======================== PAGE & SECTION EDITOR UI ========================
  if (editingPage) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Editor Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditingPage(null)}
              className="p-2 rounded-xl border border-border hover:bg-surface-variant transition-colors cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="font-headline-md text-2xl font-bold text-foreground">
                {isCreatingNew 
                  ? (language === "bn" ? "নতুন কাস্টম পেজ তৈরি করুন" : "Create New Custom Page")
                  : (language === "bn" ? "পেজ ও সেকশন এডিটর" : "Edit Page & Sections")
                }
              </h2>
              <p className="text-xs text-on-surface-variant">
                {language === "bn" ? "ওয়ার্ডপ্রেসের মতো সম্পূর্ণ ড্যাশবোর্ড থেকে পেজ ও সেকশন পরিচালনা করুন।" : "Build and customize modular sections with WordPress-style flexibility."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isCreatingNew && (
              <a
                href={`/p/${editingPage.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-variant hover:bg-surface-container-high border border-border px-4 py-2.5 rounded-xl text-xs font-bold text-foreground flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Eye className="w-4 h-4" />
                <span>{language === "bn" ? "লাইভ পেজ দেখুন" : "View Live"}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            )}

            <button
              onClick={handleSavePage}
              disabled={saving}
              className="bg-growth-green hover:bg-[#1b501f] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? (language === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : (language === "bn" ? "পেজ সংরক্ষণ করুন" : "Save Page")}</span>
            </button>
          </div>
        </div>

        {/* Core Page Metadata Box */}
        <div className="bg-surface-container-lowest dark:bg-surface-container-low p-6 sm:p-8 rounded-xl border border-border space-y-6 shadow-xs">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2 border-b border-border pb-3">
            <FileText className="w-4 h-4 text-growth-green" />
            <span>{language === "bn" ? "১. পেজ সেটিংস ও মেন্যু লিঙ্ক" : "1. Page Information & Navigation"}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {language === "bn" ? "পেজের নাম (বাংলা) *" : "Page Title (Bengali) *"}
              </label>
              <input
                type="text"
                value={editingPage.titleBn}
                onChange={(e) => setEditingPage({ ...editingPage, titleBn: e.target.value })}
                placeholder="উদা: শিক্ষা বৃত্তি কর্মসূচি ২০২৬"
                className="w-full bg-surface dark:bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground focus:border-growth-green outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {language === "bn" ? "পেজের নাম (ইংরেজি) *" : "Page Title (English) *"}
              </label>
              <input
                type="text"
                value={editingPage.titleEn}
                onChange={(e) => {
                  const title = e.target.value;
                  const autoSlug = isCreatingNew ? title.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/--+/g, "-") : editingPage.slug;
                  setEditingPage({ ...editingPage, titleEn: title, slug: autoSlug });
                }}
                placeholder="e.g. Scholarship Program 2026"
                className="w-full bg-surface dark:bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground focus:border-growth-green outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {language === "bn" ? "URL স্লাগ (ওয়েব লিঙ্ক) *" : "URL Slug *"}
              </label>
              <div className="flex items-center">
                <span className="bg-surface-variant border border-r-0 border-border px-2.5 py-2 rounded-l-xl text-xs text-on-surface-variant font-mono">
                  /p/
                </span>
                <input
                  type="text"
                  disabled={!isCreatingNew}
                  value={editingPage.slug}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                  placeholder="scholarship-program"
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 rounded-r-xl text-xs text-foreground font-mono focus:border-growth-green outline-none disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {language === "bn" ? "সাবটাইটেল / সারসংক্ষেপ (বাংলা)" : "Subtitle (Bengali)"}
              </label>
              <input
                type="text"
                value={editingPage.subtitleBn || ""}
                onChange={(e) => setEditingPage({ ...editingPage, subtitleBn: e.target.value })}
                placeholder="বীরখাল সমাজ কল্যাণ যুব সংগঠনের উদ্যোগ..."
                className="w-full bg-surface dark:bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {language === "bn" ? "সাবটাইটেল / সারসংক্ষেপ (ইংরেজি)" : "Subtitle (English)"}
              </label>
              <input
                type="text"
                value={editingPage.subtitleEn || ""}
                onChange={(e) => setEditingPage({ ...editingPage, subtitleEn: e.target.value })}
                placeholder="Brief summary of this initiative..."
                className="w-full bg-surface dark:bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground outline-none"
              />
            </div>
          </div>

          {/* Menu & Placement Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-surface dark:bg-background cursor-pointer">
              <input
                type="checkbox"
                checked={editingPage.showInNavbar}
                onChange={(e) => setEditingPage({ ...editingPage, showInNavbar: e.target.checked })}
                className="w-4 h-4 accent-growth-green rounded"
              />
              <span className="text-xs font-bold text-foreground">
                {language === "bn" ? "Navbar-এ মেন্যু লিঙ্ক দেখান" : "Show in Header Menu"}
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-surface dark:bg-background cursor-pointer">
              <input
                type="checkbox"
                checked={editingPage.showInFooter}
                onChange={(e) => setEditingPage({ ...editingPage, showInFooter: e.target.checked })}
                className="w-4 h-4 accent-growth-green rounded"
              />
              <span className="text-xs font-bold text-foreground">
                {language === "bn" ? "Footer-এ লিঙ্ক দেখান" : "Show in Footer"}
              </span>
            </label>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface dark:bg-background">
              <span className="text-xs font-bold text-foreground">
                {language === "bn" ? "স্ট্যাটাস" : "Status"}
              </span>
              <select
                value={editingPage.status}
                onChange={(e: any) => setEditingPage({ ...editingPage, status: e.target.value })}
                className="bg-surface-variant border border-border text-xs px-2.5 py-1 rounded-lg font-bold text-foreground outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Sections Builder Area */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-headline-md text-xl font-bold text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5 text-growth-green" />
                <span>{language === "bn" ? "২. পেজের ভেতরের সেকশনসমূহ (Dynamic Sections)" : "2. Page Sections Builder"}</span>
              </h3>
              <p className="text-xs text-on-surface-variant">
                {language === "bn" ? "যেকোনো ধরণের সেকশন যোগ করুন, এডিট করুন বা ক্রম পরিবর্তন করুন।" : "Add, customize, or re-order any dynamic block section."}
              </p>
            </div>

            {/* Add Section Buttons Dropdown/Cluster */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddSection("text_block")}
                className="bg-surface-container hover:bg-surface-container-high border border-border text-foreground text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Type className="w-3.5 h-3.5 text-growth-green" />
                <span>+ টেক্সট ব্লক</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddSection("cards_grid")}
                className="bg-surface-container hover:bg-surface-container-high border border-border text-foreground text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
                <span>+ কার্ড গ্রিড</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddSection("faq_accordion")}
                className="bg-surface-container hover:bg-surface-container-high border border-border text-foreground text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>+ প্রশ্নোত্তর (FAQ)</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddSection("cta_box")}
                className="bg-surface-container hover:bg-surface-container-high border border-border text-foreground text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <MousePointerClick className="w-3.5 h-3.5 text-red-500" />
                <span>+ কল টু অ্যাকশন</span>
              </button>
            </div>
          </div>

          {/* Section Items List */}
          {editingPage.sections.length === 0 ? (
            <div className="p-12 text-center bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-dashed border-border text-on-surface-variant">
              <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="font-bold text-sm">{language === "bn" ? "এখনো কোনো সেকশন যোগ করা হয়নি" : "No sections added yet"}</p>
              <p className="text-xs mt-1">{language === "bn" ? "উপরের বাটনগুলো থেকে নতুন সেকশন যোগ করুন।" : "Click any button above to add a section."}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {editingPage.sections.map((section, sIndex) => (
                <div 
                  key={section.id || sIndex}
                  className="bg-surface-container-lowest dark:bg-surface-container-low p-6 rounded-xl border border-border shadow-xs space-y-4 relative group"
                >
                  {/* Section Top Header & Order Controls */}
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-growth-green/10 text-growth-green text-xs font-bold flex items-center justify-center">
                        {sIndex + 1}
                      </span>
                      <span className="font-bold text-xs uppercase tracking-wider text-growth-green bg-growth-green/10 px-2.5 py-0.5 rounded-full">
                        {section.type === "text_block" ? "📝 Text & Story Block" :
                         section.type === "cards_grid" ? "🗂️ Features & Card Grid" :
                         section.type === "faq_accordion" ? "❓ FAQ Accordion" :
                         section.type === "cta_box" ? "🎯 Call To Action Box" : "🖼️ Gallery"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={sIndex === 0}
                        onClick={() => handleMoveSection(sIndex, "up")}
                        className="p-1.5 rounded-lg border border-border hover:bg-surface-variant disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={sIndex === editingPage.sections.length - 1}
                        onClick={() => handleMoveSection(sIndex, "down")}
                        className="p-1.5 rounded-lg border border-border hover:bg-surface-variant disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(section.id)}
                        className="p-1.5 rounded-lg border border-transparent hover:border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer ml-2"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Section Title Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        {language === "bn" ? "সেকশন শিরোনাম (বাংলা)" : "Section Heading (Bengali)"}
                      </label>
                      <input
                        type="text"
                        value={section.titleBn || ""}
                        onChange={(e) => {
                          const updated = [...editingPage.sections];
                          updated[sIndex].titleBn = e.target.value;
                          setEditingPage({ ...editingPage, sections: updated });
                        }}
                        className="w-full bg-surface dark:bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        {language === "bn" ? "সেকশন শিরোনাম (ইংরেজি)" : "Section Heading (English)"}
                      </label>
                      <input
                        type="text"
                        value={section.titleEn || ""}
                        onChange={(e) => {
                          const updated = [...editingPage.sections];
                          updated[sIndex].titleEn = e.target.value;
                          setEditingPage({ ...editingPage, sections: updated });
                        }}
                        className="w-full bg-surface dark:bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground outline-none"
                      />
                    </div>
                  </div>

                  {/* Text & Content Block */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        {language === "bn" ? "বিস্তারিত বিবরণী (বাংলা)" : "Content / Description (Bengali)"}
                      </label>
                      <textarea
                        rows={3}
                        value={section.contentBn || ""}
                        onChange={(e) => {
                          const updated = [...editingPage.sections];
                          updated[sIndex].contentBn = e.target.value;
                          setEditingPage({ ...editingPage, sections: updated });
                        }}
                        className="w-full bg-surface dark:bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        {language === "bn" ? "বিস্তারিত বিবরণী (ইংরেজি)" : "Content / Description (English)"}
                      </label>
                      <textarea
                        rows={3}
                        value={section.contentEn || ""}
                        onChange={(e) => {
                          const updated = [...editingPage.sections];
                          updated[sIndex].contentEn = e.target.value;
                          setEditingPage({ ...editingPage, sections: updated });
                        }}
                        className="w-full bg-surface dark:bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground outline-none"
                      />
                    </div>
                  </div>

                  {/* Section-specific dynamic items editor for Cards Grid / FAQ */}
                  {(section.type === "cards_grid" || section.type === "faq_accordion") && (
                    <div className="pt-3 border-t border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          {section.type === "cards_grid" ? "কার্ড আইটেমসমূহ" : "প্রশ্ন ও উত্তরের তালিকা"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...editingPage.sections];
                            const curItems = updated[sIndex].items || [];
                            updated[sIndex].items = [
                              ...curItems,
                              { titleBn: "নতুন আইটেম", titleEn: "New Item", descBn: "বিবরণ...", descEn: "Details..." }
                            ];
                            setEditingPage({ ...editingPage, sections: updated });
                          }}
                          className="text-[11px] font-bold text-growth-green bg-growth-green/10 px-2.5 py-1 rounded-lg hover:bg-growth-green/20 transition-colors"
                        >
                          + আইটেম যোগ করুন
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(section.items || []).map((item, itemIdx) => (
                          <div key={itemIdx} className="p-3.5 bg-surface dark:bg-background rounded-xl border border-border space-y-2 relative">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...editingPage.sections];
                                updated[sIndex].items = updated[sIndex].items?.filter((_, i) => i !== itemIdx);
                                setEditingPage({ ...editingPage, sections: updated });
                              }}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="text"
                              placeholder="শিরোনাম (বাংলা)"
                              value={item.titleBn || ""}
                              onChange={(e) => {
                                const updated = [...editingPage.sections];
                                if (updated[sIndex].items) updated[sIndex].items![itemIdx].titleBn = e.target.value;
                                setEditingPage({ ...editingPage, sections: updated });
                              }}
                              className="w-full bg-surface-container border border-border px-2.5 py-1 rounded-lg text-xs font-bold outline-none"
                            />
                            <textarea
                              rows={2}
                              placeholder="বিবরণ (বাংলা)"
                              value={item.descBn || ""}
                              onChange={(e) => {
                                const updated = [...editingPage.sections];
                                if (updated[sIndex].items) updated[sIndex].items![itemIdx].descBn = e.target.value;
                                setEditingPage({ ...editingPage, sections: updated });
                              }}
                              className="w-full bg-surface-container border border-border px-2.5 py-1 rounded-lg text-xs outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Box Button Details */}
                  {section.type === "cta_box" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-border">
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">বাটনের লেখা (বাংলা)</label>
                        <input
                          type="text"
                          value={section.buttonTextBn || "অনুদানের তালিকা"}
                          onChange={(e) => {
                            const updated = [...editingPage.sections];
                            updated[sIndex].buttonTextBn = e.target.value;
                            setEditingPage({ ...editingPage, sections: updated });
                          }}
                          className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">Button Text (EN)</label>
                        <input
                          type="text"
                          value={section.buttonTextEn || "Donate / Join"}
                          onChange={(e) => {
                            const updated = [...editingPage.sections];
                            updated[sIndex].buttonTextEn = e.target.value;
                            setEditingPage({ ...editingPage, sections: updated });
                          }}
                          className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">বাটন লিংক (URL)</label>
                        <input
                          type="text"
                          value={section.buttonUrl || "/donations"}
                          onChange={(e) => {
                            const updated = [...editingPage.sections];
                            updated[sIndex].buttonUrl = e.target.value;
                            setEditingPage({ ...editingPage, sections: updated });
                          }}
                          className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 rounded-xl text-xs outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ======================== PAGES LISTING DASHBOARD ========================
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-growth-green/10 text-growth-green border border-growth-green/20">
              WordPress-Style Page Builder
            </span>
          </div>
          <h1 className="font-headline-lg text-3xl font-bold text-foreground">
            {language === "bn" ? "কাস্টম পেজ ও সেকশন বিল্ডার" : "Custom Pages & Section Builder"}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            {language === "bn" ? "আনলিমিটেড নতুন পেজ তৈরি করুন এবং ওয়ার্ডপ্রেসের মতো প্রতিটি পেজে কাস্টম সেকশন সাজান।" : "Create unlimited custom pages and build dynamic modular sections with complete dashboard control."}
          </p>
        </div>

        <button
          onClick={handleStartNewPage}
          className="bg-growth-green hover:bg-[#1b501f] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-growth-green/20 hover:shadow-lg transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{language === "bn" ? "+ নতুন পেজ তৈরি করুন" : "Create New Page"}</span>
        </button>
      </div>

      {/* Pages Grid */}
      {pages.length === 0 ? (
        <div className="p-12 text-center bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-dashed border-border text-on-surface-variant">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40 text-growth-green" />
          <h3 className="font-bold text-base text-foreground mb-1">
            {language === "bn" ? "এখনো কোনো কাস্টম পেজ তৈরি করা হয়নি" : "No Custom Pages Created Yet"}
          </h3>
          <p className="text-xs text-on-surface-variant mb-4">
            {language === "bn" ? "যেকোনো নতুন উদ্যোগ বা প্রজেক্টের জন্য সম্পূর্ণ নতুন পেজ ও সেকশন তৈরি করুন।" : "Start building your first custom dynamic page with rich modular sections."}
          </p>
          <button
            onClick={handleStartNewPage}
            className="bg-growth-green text-white px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{language === "bn" ? "প্রথম পেজটি তৈরি করুন" : "Create First Page"}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div 
              key={page._id || page.slug}
              className="bg-surface-container-lowest dark:bg-surface-container-low p-6 rounded-xl border border-border shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    page.status === "published" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}>
                    {page.status === "published" ? "Published" : "Draft"}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                    <Layers className="w-3.5 h-3.5 text-growth-green" />
                    <span>{page.sections?.length || 0} {language === "bn" ? "টি সেকশন" : "Sections"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-foreground line-clamp-1">
                    {language === "bn" ? page.titleBn : page.titleEn}
                  </h3>
                  <p className="text-xs text-on-surface-variant/80 font-mono mt-0.5">
                    /p/{page.slug}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[11px]">
                  {page.showInNavbar && (
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 font-bold rounded-md">
                      Navbar
                    </span>
                  )}
                  {page.showInFooter && (
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 font-bold rounded-md">
                      Footer
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                <a
                  href={`/p/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-growth-green hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "ভিউ" : "View"}</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditPage(page)}
                    className="p-2 rounded-lg border border-border hover:bg-surface-variant text-foreground transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5 text-blue-500" />
                    <span>{language === "bn" ? "এডিট" : "Edit"}</span>
                  </button>

                  <button
                    onClick={() => setDeleteTargetSlug(page.slug)}
                    className="p-2 rounded-lg border border-transparent hover:border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                    title="Delete Page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation & Alert Modals */}
      <AlertModal
        isOpen={!!alertMessage}
        onClose={() => setAlertMessage(null)}
        title={language === "bn" ? "বিজ্ঞপ্তি" : "Notice"}
        message={alertMessage || ""}
        type="success"
      />

      <ConfirmModal
        isOpen={!!deleteTargetSlug}
        onClose={() => setDeleteTargetSlug(null)}
        onConfirm={() => {
          if (deleteTargetSlug) {
            handleDeletePage(deleteTargetSlug);
          }
        }}
        title={language === "bn" ? "পেজ ডিলিট করবেন?" : "Delete this page?"}
        message={language === "bn" ? "আপনি কি নিশ্চিতভাবে এই কাস্টম পেজটি এবং এর সকল সেকশন মুছে ফেলতে চান?" : "Are you sure you want to permanently delete this page and its sections?"}
        confirmText={language === "bn" ? "হ্যাঁ, মুছে ফেলুন" : "Yes, Delete"}
        cancelText={language === "bn" ? "বাতিল" : "Cancel"}
        type="danger"
      />
    </div>
  );
}
