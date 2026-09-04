"use client";

import { useLanguage } from "@/components/language-provider";
import { useState, useRef, useEffect, useCallback } from "react";
import { 
  ShieldCheck, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Award, 
  Quote, 
  Crown,
  CheckCircle2,
  ExternalLink,
  Phone
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { 
  translateBanglaName, 
  translateBanglaRole, 
  translateBanglaAddress, 
  translateBanglaBio 
} from "@/lib/bengali-transliteration";

function getRole(member: any, lang: string) {
  if (lang === "en" && member.roleEn) return member.roleEn;
  return translateBanglaRole(member.role || member.designation || "", lang);
}

function getName(member: any, lang: string) {
  if (lang === "en" && member.nameEn) return member.nameEn;
  const rawName = member.name || member.nameBn || "";
  return translateBanglaName(rawName, lang);
}

function getAddress(member: any, lang: string) {
  if (lang === "en" && member.addressEn) return member.addressEn;
  return translateBanglaAddress(member.address || member.location || "", lang);
}

function getDescription(member: any, lang: string) {
  if (lang === "en" && member.descriptionEn) return member.descriptionEn;
  const rawDesc = member.description || "";
  if (!rawDesc) {
    return lang === "bn"
      ? "আমাদের লক্ষ্য বীরখাল ও চান্দিনার তরুণ প্রজন্মকে একতাবদ্ধ করে সামাজিক সেবা, শিক্ষা ও মানবতার সর্বোচ্চ বিকাশ ঘটানো।"
      : "Our mission is to empower youth through unity, sustainable development, and transparent social impact.";
  }
  return translateBanglaBio(rawDesc, lang);
}

export function HomeCommitteeSlider({ 
  committeeMembers = [],
  settings = {}
}: { 
  committeeMembers: any[];
  settings?: Record<string, string>;
}) {
  const { language } = useLanguage();

  const committeeHeading = (language === "bn" ? settings["committee_heading_bn"] : settings["committee_heading_en"]) || (
    language === "bn" ? "কার্যনির্বাহী কমিটি" : "Executive Committee"
  );
  const committeeDesc = (language === "bn" ? settings["committee_desc_bn"] : settings["committee_desc_en"]) || (
    language === "bn"
      ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের সম্মানিত পরিচালনা পরিষদের শ্রদ্ধেয় নেতৃবৃন্দ।"
      : "Honorable leadership team directing our humanitarian, youth development and social initiatives."
  );
  
  // Fallback demo committee members if DB is empty to ensure high visual impact
  const displayMembers = committeeMembers.length > 0 ? committeeMembers : [
    {
      _id: "demo-1",
      name: "মুহাম্মদ মোমিন হোসাইন",
      role: "সভাপতি (President)",
      address: "বীরখাল, চান্দিনা, কুমিল্লা",
      description: "বীরখাল যুব সমাজের সার্বিক উন্নয়ন, শিক্ষা বিস্তার ও সমাজকল্যাণমূলক কার্যক্রমে বলিষ্ঠ নেতৃত্বের প্রতীক।",
      image: "/up-1.jpeg",
      isVerified: true
    },
    {
      _id: "demo-2",
      name: "কাজী তানভীর হাসান",
      role: "সাধারণ সম্পাদক (General Secretary)",
      address: "কাদুটি বাজার, চান্দিনা, কুমিল্লা",
      description: "সাংগঠনিক শৃঙ্খলা, সমাজসেবা ও যুব জাগরণ কর্মসূচির মূল পরিকল্পনা ও সফল বাস্তবায়নকারী।",
      image: "/up-2.jpeg",
      isVerified: true
    },
    {
      _id: "demo-3",
      name: "মাহমুদুল হাসান শুভ",
      role: "সাংগঠনিক সম্পাদক (Organizing Secretary)",
      address: "বীরখাল, চান্দিনা, কুমিল্লা",
      description: "স্বেচ্ছাসেবক দল গঠন, দুর্যোগকালীন ত্রাণ ও সামাজিক সহায়তা কার্যক্রমে নিবেদিতপ্রাণ।",
      image: "/up-3.jpeg",
      isVerified: true
    },
    {
      _id: "demo-4",
      name: "আহমেদ জুবায়ের",
      role: "অর্থ সম্পাদক (Finance Secretary)",
      address: "বীরখাল, চান্দিনা, কুমিল্লা",
      description: "সংগঠনের সকল অনুদান ও কল্যাণ তহবিলের শতভাগ আর্থিক স্বচ্ছতা ও জবাবদিহিতা রক্ষাকারী।",
      image: "/up-4.jpeg",
      isVerified: true
    },
    {
      _id: "demo-5",
      name: "শাহাদাত হোসেন সুমন",
      role: "প্রচার ও প্রকাশনা সম্পাদক",
      address: "চান্দিনা, কুমিল্লা",
      description: "ডিজিটাল প্ল্যাটফর্ম, মিডিয়া ও সামাজিক যোগাযোগ মাধ্যমে উন্নয়নমূলক তথ্যের প্রচারক।",
      image: "/up-5.jpeg",
      isVerified: true
    },
    {
      _id: "demo-6",
      name: "মোঃ আল-আমিন হোসেন",
      role: "সমাজকল্যাণ সম্পাদক",
      address: "বীরখাল, চান্দিনা",
      description: "দরিদ্র ও অসহায় মানুষের স্বাস্থ্যসেবা এবং শিক্ষা সহায়তা কার্যক্রমে অগ্রণী ভূমিকা পালনকারী।",
      image: "/up-6.jpeg",
      isVerified: true
    }
  ];

  const total = displayMembers.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const DURATION = 4000; // 4 seconds per slide
  const INTERVAL_STEP = 40; // 40ms interval tick

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  // Smooth progress bar and auto-slide timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (INTERVAL_STEP / DURATION) * 100;
      });
    }, INTERVAL_STEP);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const activeMember = displayMembers[currentIndex];
  const activeRole = getRole(activeMember, language);
  const activeName = getName(activeMember, language);
  const activeAddress = getAddress(activeMember, language);
  const activeDescription = getDescription(activeMember, language);

  return (
    <section 
      className="relative w-full py-12 select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-growth-green/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-reliability-blue/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-growth-green/10 text-growth-green font-bold text-xs mb-3 border border-growth-green/20 rounded-xl">
            <Crown className="w-3.5 h-3.5 text-impact-orange" />
            <span>{language === "bn" ? "বীরখাল পরিচালনা পরিষদ ২০২৬" : "Executive Council 2026"}</span>
          </div>
          <h2 className="font-headline-xl text-3xl md:text-5xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <span>{committeeHeading}</span>
            <span className="text-sm font-bold text-growth-green bg-growth-green/10 px-2.5 py-1 border border-growth-green/20 rounded-lg">
              {currentIndex + 1} / {total}
            </span>
          </h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mt-2 text-base">
            {committeeDesc}
          </p>
        </div>

        {/* Action Controls & Navigation Buttons */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <Link
            href="/about"
            className="text-xs font-bold text-growth-green hover:underline mr-2 hidden sm:flex items-center gap-1"
          >
            <span>{language === "bn" ? "কমিটির বিস্তারিত" : "Full Committee"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-12 h-12 border border-border bg-surface-container-lowest dark:bg-surface-container-low hover:bg-growth-green hover:text-white text-foreground flex items-center justify-center transition-all shadow-sm cursor-pointer group rounded-xl"
              aria-label="Previous committee member"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 border border-border bg-surface-container-lowest dark:bg-surface-container-low hover:bg-growth-green hover:text-white text-foreground flex items-center justify-center transition-all shadow-sm cursor-pointer group rounded-xl"
              aria-label="Next committee member"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Auto-Slide Visual Progress Bar */}
      <div className="w-full h-1 bg-surface-variant dark:bg-surface mb-8 relative overflow-hidden rounded-full">
        <div 
          className="h-full bg-gradient-to-r from-growth-green via-secondary to-reliability-blue transition-all duration-75 ease-linear rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Modern 3D Dynamic Slider Stage */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Featured Spotlight Card (Active Member) */}
          <div className="lg:col-span-7 bg-surface-container-lowest dark:bg-surface-container-low border-2 border-growth-green/40 p-6 md:p-8 shadow-2xl relative overflow-hidden group transition-all duration-500 rounded-xl">
            {/* Top Glowing Header Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-growth-green via-impact-orange to-reliability-blue"></div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-growth-green/10 rounded-full blur-2xl"></div>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10">
              {/* Leader Avatar with Glowing Halo */}
              <div className="relative shrink-0">
                <div className="w-36 h-40 md:w-44 md:h-48 overflow-hidden border-2 border-growth-green shadow-xl bg-surface-variant relative rounded-xl">
                  {activeMember.image ? (
                    <Image 
                      src={activeMember.image} 
                      alt={activeName}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 150px, 200px"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-growth-green/10 text-growth-green text-4xl font-bold rounded-xl">
                      {activeName.charAt(0)}
                    </div>
                  )}
                </div>
                {activeMember.isVerified !== false && (
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-growth-green text-white px-3 py-0.5 text-[11px] font-bold shadow-md flex items-center gap-1 whitespace-nowrap border border-white dark:border-background rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{language === "bn" ? "ভেরিফায়েড" : "Verified"}</span>
                  </div>
                )}
              </div>

              {/* Leader Info & Statement */}
              <div className="flex-grow space-y-4 text-center sm:text-left">
                <div>
                  <div className="inline-block px-3 py-1 bg-growth-green text-white text-xs font-bold shadow-xs mb-2 rounded-md">
                    {activeRole}
                  </div>
                  <h3 className="font-headline-xl text-2xl md:text-3xl font-bold text-foreground">
                    {activeName}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-on-surface-variant mt-1 font-medium">
                    {activeAddress && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-growth-green shrink-0" />
                        <span>{activeAddress}</span>
                      </div>
                    )}
                    {activeMember.phone && (
                      <a href={`tel:${activeMember.phone}`} className="flex items-center gap-1.5 text-growth-green font-bold hover:underline">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{activeMember.phone}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Quote / Bio */}
                <div className="bg-surface-variant/40 dark:bg-surface/50 p-4 border-l-4 border-growth-green text-xs md:text-sm text-on-surface-variant leading-relaxed relative rounded-r-xl">
                  <Quote className="w-5 h-5 text-growth-green/30 absolute right-3 top-3 -scale-x-100" />
                  <p className="italic relative z-10">
                    "{activeDescription}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                  <span className="text-[11px] font-bold text-growth-green bg-growth-green/10 px-2.5 py-1 border border-growth-green/20 rounded-md">
                    {language === "bn" ? "✓ কার্যনির্বাহী পরিচালনা" : "✓ Executive Board"}
                  </span>
                  <span className="text-[11px] font-bold text-reliability-blue bg-reliability-blue/10 px-2.5 py-1 border border-reliability-blue/20 rounded-md">
                    {language === "bn" ? "✓ সমাজসেবক" : "✓ Social Worker"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Carousel Preview Cards (Next in Queue) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {displayMembers.map((member, idx) => {
              const isCurrent = idx === currentIndex;
              const isNext = idx === (currentIndex + 1) % total;
              const isNext2 = idx === (currentIndex + 2) % total;

              // Only show the 2 upcoming members in the side stack on desktop
              if (!isNext && !isNext2) return null;

              const memberRole = getRole(member, language);
              const memberName = getName(member, language);
              const memberAddress = getAddress(member, language) || (language === "bn" ? "বীরখাল, চান্দিনা" : "Birkhal, Chandina");

              return (
                <div
                  key={member._id || idx}
                  onClick={() => goToSlide(idx)}
                  className={`p-4 border transition-all duration-300 cursor-pointer flex items-center gap-4 relative overflow-hidden rounded-xl ${
                    isCurrent
                      ? "bg-surface-container-lowest border-growth-green shadow-md scale-[1.02]"
                      : "bg-surface-container-lowest/70 dark:bg-surface-container-low/70 border-border hover:border-growth-green/50 hover:bg-surface-container-lowest shadow-sm"
                  }`}
                >
                  {/* Photo */}
                  <div className="relative w-16 h-16 overflow-hidden border border-border shrink-0 bg-surface-variant rounded-xl">
                    {member.image ? (
                      <img src={member.image} alt={memberName} className="w-full h-full object-cover object-top rounded-xl" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-growth-green/10 text-growth-green font-bold rounded-xl">
                        {memberName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <span className="text-[10px] font-bold text-growth-green uppercase tracking-wider block truncate">
                      {memberRole}
                    </span>
                    <h4 className="font-bold text-sm text-foreground truncate group-hover:text-growth-green">
                      {memberName}
                    </h4>
                    <p className="text-xs text-on-surface-variant truncate opacity-80 mt-0.5">
                      {memberAddress}
                    </p>
                  </div>

                  <div className="text-[10px] font-bold px-2 py-1 bg-surface-variant text-foreground shrink-0 border border-border rounded-md">
                    {language === "bn" ? "পরবর্তী" : "Next"}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Pagination Dot Navigation & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-border">
        {/* Interactive Progress Indicator Dots */}
        <div className="flex items-center gap-2">
          {displayMembers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 cursor-pointer rounded-full ${
                idx === currentIndex
                  ? "w-8 h-2.5 bg-growth-green shadow-xs"
                  : "w-2.5 h-2.5 bg-surface-variant hover:bg-on-surface-variant/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>

        {/* Auto Slide State Hint */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-growth-green ${!isPaused ? 'animate-ping opacity-75' : 'opacity-0'}`}></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-growth-green"></span>
          </span>
          <span className="font-medium">
            {!isPaused 
              ? (language === "bn" ? "অটো-স্লাইড চালু (মাউস রাখলে থামবে)" : "Auto-sliding active (hover to pause)")
              : (language === "bn" ? "পজ করা আছে" : "Paused")}
          </span>
        </div>
      </div>
    </section>
  );
}
