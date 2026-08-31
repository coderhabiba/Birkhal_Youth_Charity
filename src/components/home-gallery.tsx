"use client";

import { useLanguage } from "@/components/language-provider";
import { useState } from "react";
import { 
  Images, 
  Eye, 
  X, 
  Sparkles, 
  Camera, 
  ExternalLink,
  ChevronRight,
  Maximize2
} from "lucide-react";
import Image from "next/image";
import { translateBanglaBio } from "@/lib/bengali-transliteration";

export interface GalleryItem {
  id: string;
  title: string;
  category: "all" | "activities" | "relief" | "education" | "plantation";
  categoryNameBn: string;
  categoryNameEn: string;
  url: string;
  date?: string;
}

export function HomeGallery({ 
  mediaList = [],
  settings = {}
}: { 
  mediaList?: any[];
  settings?: Record<string, string>;
}) {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const sectionHeading = (language === "bn" ? settings["gallery_heading_bn"] : settings["gallery_heading_en"]) || (
    language === "bn" ? "আমাদের কার্যক্রমের ছবি ও স্মৃতি অ্যালবাম" : "Our Activity Moments & Gallery"
  );
  const sectionDesc = (language === "bn" ? settings["gallery_desc_bn"] : settings["gallery_desc_en"]) || (
    language === "bn"
      ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের মাঠপর্যায়ের সমাজসেবা, ত্রাণ বিতরণ ও উন্নয়নমূলক কার্যক্রমের বাস্তব চিত্র।"
      : "A visual journey capturing the spirit, unity, and ground-level charity works of our youth volunteers."
  );
  // Fallback items using real ground-level activity photos with matching titles & tags
  const defaultGallery = [
    { _id: "g-1", title: "বীরখাল সমাজ কল্যাণ যুব সংগঠনের ঐক্যবদ্ধ সমাজসেবা কার্যক্রম", url: "/up-1.jpeg", tag: "ACTIVITIES" },
    { _id: "g-2", title: "বীরখাল সবুজায়ন ও পরিবেশ সুরক্ষা বৃক্ষরোপণ কর্মসূচি", url: "/ai_plantation.jpg", tag: "PLANTATION" },
    { _id: "g-3", title: "দরিদ্র ও মেধাবী শিক্ষার্থীদের মাঝে শিক্ষাসামগ্রী ও মেধা বৃত্তি বিতরণ", url: "/ai_education.jpg", tag: "EDUCATION" },
    { _id: "g-4", title: "বন্যা ও দুর্যোগকালীন জরুরি খাদ্য ও ত্রাণ সামগ্রী বিতরণ", url: "/ai_relief.jpg", tag: "RELIEF" },
    { _id: "g-5", title: "বিনামূল্যে জরুরি স্বাস্থ্যসেবা ও রক্তের গ্রুপ নির্ণয় কর্মসূচি", url: "/ai_medical.jpg", tag: "RELIEF" },
  ];

  const rawList = (mediaList && mediaList.length > 0) ? mediaList : defaultGallery;
  const sourceMedia = rawList.filter((m: any) => !m.title?.includes("যুবসমাজ উন্নয়ন ও দক্ষতা প্রশিক্ষণ") && !m.title?.includes("দক্ষতা প্রশিক্ষণ"));
  const uniqueMedia = Array.from(new Map(sourceMedia.map(m => [m.url, m])).values());

  const allGalleryItems: GalleryItem[] = uniqueMedia.map((m: any) => {
    const rawTag = (m.tag || "").toLowerCase();
    const titleText = (m.title || "").toLowerCase();
    
    let catId: "all" | "activities" | "relief" | "education" | "plantation" = "activities";
    if (rawTag.includes("relief") || rawTag.includes("ত্রাণ") || rawTag.includes("healthcare") || rawTag.includes("স্বাস্থ্য") || titleText.includes("ত্রাণ") || titleText.includes("স্বাস্থ্য")) {
      catId = "relief";
    } else if (rawTag.includes("education") || rawTag.includes("শিক্ষা") || titleText.includes("শিক্ষা") || titleText.includes("শিক্ষাসামগ্রী")) {
      catId = "education";
    } else if (rawTag.includes("plantation") || rawTag.includes("বৃক্ষরোপণ") || titleText.includes("বৃক্ষরোপণ") || titleText.includes("সবুজায়ন")) {
      catId = "plantation";
    }

    // Precise image resolution to match the tagline and activity type
    let matchedUrl = m.url || "/up-1.jpeg";
    if (m.title?.includes("বৃক্ষরোপণ") || m.title?.includes("সবুজায়ন") || m.tag === "PLANTATION" || matchedUrl === "/support4.jpeg") {
      matchedUrl = "/ai_plantation.jpg";
    } else if (m.title?.includes("শিক্ষা") || m.title?.includes("শিক্ষাসামগ্রী") || m.tag === "EDUCATION" || matchedUrl === "/support3.jpeg") {
      matchedUrl = "/ai_education.jpg";
    } else if (m.title?.includes("ত্রাণ") || m.title?.includes("বন্যা") || m.tag === "RELIEF" || matchedUrl === "/support2.jpeg") {
      matchedUrl = "/ai_relief.jpg";
    } else if (m.title?.includes("স্বাস্থ্য") || m.title?.includes("চিকিৎসা") || m.title?.includes("মেডিকেল")) {
      matchedUrl = "/ai_medical.jpg";
    } else if (m.title?.includes("যুবসমাজ") || m.title?.includes("দক্ষতা") || m.tag === "YOUTH" || matchedUrl === "/support1.jpeg") {
      matchedUrl = "/up-1.jpeg";
    }

    const rawTitle = m.title || (language === "bn" ? "বীরখাল সমাজসেবা কার্যক্রম" : "Birkhal Community Activity");
    const itemTitle = language === "bn" ? rawTitle : translateBanglaBio(rawTitle, "en");

    // Bilingual category tag resolution
    let tagBn = m.tag || (catId === "education" ? "শিক্ষা" : catId === "plantation" ? "বৃক্ষরোপণ" : catId === "relief" ? "ত্রাণ ও সেবা" : "যুব কার্যক্রম");
    let tagEn = (catId === "education" ? "Education" : catId === "plantation" ? "Plantation" : catId === "relief" ? "Relief & Healthcare" : "Youth Activities");

    if (m.tag) {
      const lowerTag = (m.tag || "").toLowerCase();
      if (lowerTag.includes("স্বাস্থ্য") || lowerTag.includes("medical") || lowerTag.includes("চিকিৎসা")) {
        tagBn = "স্বাস্থ্যসেবা";
        tagEn = "Healthcare";
      } else if (lowerTag.includes("শিক্ষা") || lowerTag.includes("education")) {
        tagBn = "শিক্ষা সহায়তা";
        tagEn = "Education Aid";
      } else if (lowerTag.includes("বৃক্ষরোপণ") || lowerTag.includes("plantation") || lowerTag.includes("সবুজায়ন")) {
        tagBn = "বৃক্ষরোপণ";
        tagEn = "Plantation";
      } else if (lowerTag.includes("ত্রাণ") || lowerTag.includes("relief") || lowerTag.includes("বন্যা")) {
        tagBn = "ত্রাণ ও সেবা";
        tagEn = "Relief & Aid";
      } else if (lowerTag.includes("যুব") || lowerTag.includes("activity") || lowerTag.includes("কার্যক্রম") || lowerTag.includes("activities")) {
        tagBn = "যুব কার্যক্রম";
        tagEn = "Youth Activities";
      } else {
        tagEn = translateBanglaBio(m.tag, "en");
      }
    }

    return {
      id: m._id || m.id,
      title: itemTitle,
      category: catId,
      categoryNameBn: tagBn,
      categoryNameEn: tagEn,
      url: matchedUrl,
      date: m.createdAt ? new Date(m.createdAt).getFullYear().toString() : new Date().getFullYear().toString()
    };
  });

  const categories = [
    { id: "all", labelBn: "সকল ছবি (All)", labelEn: "All Media" },
    { id: "activities", labelBn: "যুব কার্যক্রম", labelEn: "Youth Activities" },
    { id: "relief", labelBn: "ত্রাণ ও সেবা", labelEn: "Relief & Aid" },
    { id: "education", labelBn: "শিক্ষা সহায়তা", labelEn: "Education Aid" },
    { id: "plantation", labelBn: "বৃক্ষরোপণ", labelEn: "Plantation" },
  ];

  const filteredItems = activeCategory === "all"
    ? allGalleryItems
    : allGalleryItems.filter(item => item.category === activeCategory);

  return (
    <section className="relative w-full py-16 border-t border-border">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-growth-green/10 text-growth-green font-bold text-xs mb-3 rounded-full border border-growth-green/20">
            <Camera className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "ফটো ও কার্যক্রম অ্যালবাম" : "Photo & Event Gallery"}</span>
          </div>
          <h2 className="font-headline-xl text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            {sectionHeading}
          </h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mt-3 text-base">
            {sectionDesc}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer rounded-full border ${
                activeCategory === cat.id
                  ? "bg-growth-green text-white border-growth-green shadow-md scale-105"
                  : "bg-surface dark:bg-surface-container-low text-on-surface-variant border-border hover:bg-surface-variant hover:text-foreground"
              }`}
            >
              {language === "bn" ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-dashed border-border">
          <Camera className="w-12 h-12 mb-4 opacity-50" />
          <p className="font-bold text-lg">{language === "bn" ? "কোনো ছবি পাওয়া যায়নি" : "No images found"}</p>
          <p className="text-sm mt-1">{language === "bn" ? "অ্যাডমিন প্যানেল থেকে ছবি আপলোড করুন।" : "Upload images from the admin panel."}</p>
        </div>
      ) : (
        /* Modern Mosaic Gallery Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] grid-flow-dense">
          {filteredItems.map((item, idx) => {
            // Determine mosaic spanning based on index to create a beautiful varied grid
            const isLarge = idx % 7 === 0;
            const isTall = idx % 5 === 2;
            const isWide = idx % 5 === 4;
            
            return (
            <div
              key={item.id || idx}
              onClick={() => setSelectedImage(item)}
              className={`group relative bg-surface-container-lowest dark:bg-surface-container-low overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500 rounded-xl ${
                isLarge ? "sm:col-span-2 sm:row-span-2" :
                isTall ? "sm:row-span-2" :
                isWide ? "sm:col-span-2" :
                "col-span-1 row-span-1"
              }`}
            >
              {/* Image */}
              <Image
                src={item.url}
                alt={item.title}
                fill
                unoptimized={(item.url || "").startsWith("data:")}
                className="object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />

              {/* Smooth Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

              {/* Top Category Badge */}
              <div className="absolute top-4 left-4 z-10 transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-bold rounded-full border border-white/30">
                  {language === "bn" ? item.categoryNameBn : item.categoryNameEn}
                </span>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-headline-md text-sm md:text-base font-bold text-white line-clamp-2 drop-shadow-md">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20 text-white/80 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <span>{item.date || new Date().getFullYear().toString()}</span>
                  <span className="flex items-center gap-1.5 font-bold text-white bg-white/20 px-2 py-1 rounded-full">
                    <Maximize2 className="w-3 h-3" />
                    <span>{language === "bn" ? "বড় করুন" : "View"}</span>
                  </span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-6xl w-full bg-transparent overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 mb-2">
              <div>
                <span className="px-3 py-1 bg-growth-green/90 text-white text-[11px] font-bold rounded-full mb-2 inline-block shadow-sm">
                  {language === "bn" ? selectedImage.categoryNameBn : selectedImage.categoryNameEn}
                </span>
                <h3 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg">
                  {selectedImage.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-3 text-white bg-white/15 hover:bg-white/30 rounded-full transition-all cursor-pointer backdrop-blur-md shrink-0 ml-4"
                aria-label="Close image modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image Preview Box - Full Width */}
            <div className="relative h-[55vh] sm:h-[65vh] md:h-[80vh] w-full rounded-2xl overflow-hidden shadow-2xl bg-black/60 border border-white/10">
              <Image
                src={selectedImage.url}
                alt={selectedImage.title}
                fill
                unoptimized={(selectedImage.url || "").startsWith("data:")}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
