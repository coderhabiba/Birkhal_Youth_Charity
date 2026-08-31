"use client";

import { useLanguage } from "@/components/language-provider";
import { useState, useRef, useEffect } from "react";
import { 
  Users, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  User as UserIcon,
  Crown,
  Heart
} from "lucide-react";
import Link from "next/link";

export interface SliderMemberItem {
  id: string;
  name: string;
  nameEn?: string;
  role: string;
  category: "committee" | "member";
  address: string;
  photoUrl?: string;
  isVerified?: boolean;
  bloodGroup?: string;
}

export function HomeMembersSlider({ 
  committeeMembers, 
  generalMembers 
}: { 
  committeeMembers: any[]; 
  generalMembers: any[]; 
}) {
  const { language } = useLanguage();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"all" | "committee" | "member">("all");
  const [isPaused, setIsPaused] = useState(false);

  // Normalize members into a unified format
  const normalizedCommittee: SliderMemberItem[] = committeeMembers.map((m) => ({
    id: `com-${m._id}`,
    name: m.name,
    nameEn: m.name,
    role: m.role || (language === "bn" ? "কমিটি সদস্য" : "Committee Member"),
    category: "committee",
    address: m.address || m.description || (language === "bn" ? "বীরখাল, চান্দিনা, কুমিল্লা" : "Birkhal, Chandina, Cumilla"),
    photoUrl: m.image,
    isVerified: m.isVerified ?? true,
  }));

  const normalizedMembers: SliderMemberItem[] = generalMembers.map((m) => ({
    id: `mem-${m._id}`,
    name: language === "bn" ? (m.nameBn || m.nameEn) : (m.nameEn || m.nameBn),
    nameEn: m.nameEn,
    role: language === "bn" ? "সাধারণ সদস্য" : "General Member",
    category: "member",
    address: m.presentAddress || (language === "bn" ? "বীরখাল, চান্দিনা" : "Birkhal, Chandina"),
    photoUrl: m.photoUrl,
    isVerified: false,
    bloodGroup: m.bloodGroup,
  }));

  const allItems = [...normalizedCommittee, ...normalizedMembers];

  const displayedItems = allItems.filter((item) => {
    if (filter === "committee") return item.category === "committee";
    if (filter === "member") return item.category === "member";
    return true;
  });

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused || displayedItems.length <= 3) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, displayedItems.length]);

  const handleScroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const offset = direction === "left" ? -340 : 340;
      sliderRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full bg-surface-container-lowest dark:bg-surface-container-low border border-border p-6 md:p-10 shadow-sm overflow-hidden">
      {/* Decorative top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-growth-green via-reliability-blue to-impact-orange"></div>

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-growth-green/10 text-growth-green border border-growth-green/20 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {language === "bn" ? "বীরখাল যুব সমাজের গর্ব" : "Our Honored Community Leaders & Members"}
          </div>
          <h2 className="font-headline-xl text-2xl md:text-4xl font-bold text-foreground tracking-tight">
            {language === "bn" ? "নেতৃত্ব ও সদস্য পরিচিতি" : "Committee & Member Showcase"}
          </h2>
          <p className="font-body-md text-on-surface-variant text-sm md:text-base mt-1 max-w-xl">
            {language === "bn"
              ? "সংগঠনের সক্রিয় কার্যনির্বাহী কমিটি ও নিবন্ধিত নিবেদিতপ্রাণ সদস্যদের একনজরে পরিচিতি।"
              : "Explore the dedicated leadership committee and active members shaping our community."}
          </p>
        </div>

        {/* Filters & Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* Category Tabs */}
          <div className="flex border border-border bg-surface dark:bg-surface-container-lowest p-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                filter === "all"
                  ? "bg-growth-green text-white"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              {language === "bn" ? `সবাই (${allItems.length})` : `All (${allItems.length})`}
            </button>
            <button
              onClick={() => setFilter("committee")}
              className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                filter === "committee"
                  ? "bg-growth-green text-white"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              {language === "bn" ? `কমিটি (${normalizedCommittee.length})` : `Committee (${normalizedCommittee.length})`}
            </button>
            <button
              onClick={() => setFilter("member")}
              className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                filter === "member"
                  ? "bg-growth-green text-white"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              {language === "bn" ? `সাধারণ সদস্য (${normalizedMembers.length})` : `Members (${normalizedMembers.length})`}
            </button>
          </div>

          {/* Slider Prev / Next Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Previous Slide"
              className="p-2.5 bg-surface dark:bg-surface-container-lowest border border-border hover:bg-growth-green hover:text-white text-foreground transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              aria-label="Next Slide"
              className="p-2.5 bg-surface dark:bg-surface-container-lowest border border-border hover:bg-growth-green hover:text-white text-foreground transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Track */}
      <div
        ref={sliderRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 snap-x no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayedItems.map((item) => {
          const isCommittee = item.category === "committee";

          return (
            <div
              key={item.id}
              className={`min-w-[270px] sm:min-w-[290px] max-w-[290px] snap-start shrink-0 bg-surface dark:bg-background border ${
                isCommittee ? "border-growth-green/40 shadow-sm" : "border-border"
              } p-5 flex flex-col items-center text-center relative group hover:border-growth-green hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm`}
            >
              {/* Category Ribbon */}
              <div className="absolute top-3 right-3">
                {isCommittee ? (
                  <span className="inline-flex items-center gap-1 bg-growth-green text-white text-[10px] font-bold px-2 py-0.5 shadow-sm">
                    <Crown className="w-3 h-3 text-amber-300" />
                    {language === "bn" ? "কার্যনির্বাহী" : "Executive"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-reliability-blue/10 text-reliability-blue border border-reliability-blue/30 text-[10px] font-bold px-2 py-0.5">
                    <Heart className="w-3 h-3" />
                    {language === "bn" ? "সদস্য" : "Member"}
                  </span>
                )}
              </div>

              {/* Profile Photo */}
              <div className="relative w-24 h-24 mt-2 mb-4">
                <div className={`w-full h-full overflow-hidden border-2 ${
                  isCommittee ? "border-growth-green" : "border-border"
                } bg-surface-variant dark:bg-surface-container flex items-center justify-center relative shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-on-surface-variant/60">
                      <UserIcon className="w-10 h-10" />
                    </div>
                  )}
                </div>
                {item.isVerified && (
                  <div
                    title="Verified Leader"
                    className="absolute -bottom-1.5 -right-1.5 bg-growth-green text-white p-0.5 border border-surface shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="font-headline-md text-base font-bold text-foreground line-clamp-1 mb-1 group-hover:text-growth-green transition-colors">
                {item.name}
              </h3>

              {/* Designation / Role */}
              <div className="mb-3">
                <span className={`inline-block text-xs font-bold px-2.5 py-1 ${
                  isCommittee 
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20" 
                    : "bg-surface-variant dark:bg-white/5 text-on-surface-variant border border-border"
                }`}>
                  {item.role}
                </span>
              </div>

              {/* Address / Location */}
              <div className="mt-auto w-full pt-3 border-t border-border/60 flex flex-col gap-1.5">
                <p className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant line-clamp-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-reliability-blue" />
                  <span>{item.address}</span>
                </p>
                {item.bloodGroup && (
                  <p className="text-[11px] font-bold text-red-600 dark:text-red-400">
                    {language === "bn" ? "রক্তের গ্রুপ: " : "Blood: "} {item.bloodGroup}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {displayedItems.length === 0 && (
          <div className="w-full py-12 text-center text-on-surface-variant border border-dashed border-border">
            <Users className="w-10 h-10 mx-auto mb-2 text-on-surface-variant/40" />
            <p className="font-bold text-sm">
              {language === "bn" ? "কোনো সদস্য তথ্য পাওয়া যায়নি।" : "No member records found."}
            </p>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-border text-xs">
        <span className="text-on-surface-variant font-medium">
          {language === "bn" 
            ? `💡 মোট ${allItems.length} জন সক্রিয় সদস্য ও নেতৃত্ব আমাদের সাথে যুক্ত আছেন।` 
            : `💡 Total ${allItems.length} active leadership & members registered.`}
        </span>
        <div className="flex gap-4">
          <Link href="/about" className="font-bold text-growth-green hover:underline">
            {language === "bn" ? "সম্পূর্ণ কমিটি দেখুন →" : "View Full Committee →"}
          </Link>
          <Link href="/members" className="font-bold text-reliability-blue hover:underline">
            {language === "bn" ? "সকল সাধারণ সদস্য দেখুন →" : "View All Members →"}
          </Link>
        </div>
      </div>
    </section>
  );
}
