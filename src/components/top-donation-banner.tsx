"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Heart, Sparkles, PhoneCall, ArrowRight, X } from "lucide-react";
import { QuickDonationModal } from "./quick-donation-modal";

export function TopDonationBanner({ settings = {} }: { settings?: Record<string, string> }) {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Allow admin to completely disable top banner from dashboard
  if (settings["top_banner_enabled"] === "false" || !isVisible) {
    return null;
  }

  const badgeText = (language === "bn" ? settings["top_banner_badge_bn"] : settings["top_banner_badge_en"]) || (
    language === "bn" ? "জরুরি মানবসেবা ফান্ড" : "Charity Appeal"
  );

  const bannerText = (language === "bn" ? settings["top_banner_text_bn"] : settings["top_banner_text_en"]) || (
    language === "bn"
      ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের তহবিলে আপনার যাকাত ও অনুদান দিন। বিকাশ/নগদ: 01882447721"
      : "Support Birkhal Youth Welfare Fund with your Zakat & Charity. bKash/Nagad: 01882447721"
  );

  const btnText = (language === "bn" ? settings["top_banner_btn_bn"] : settings["top_banner_btn_en"]) || (
    language === "bn" ? "অনলাইনে অনুদান দিন" : "Donate Now"
  );

  return (
    <>
      <div className="bg-gradient-to-r from-growth-green via-[#005a4b] to-[#00382e] text-white py-1.5 sm:py-2 px-3 sm:px-4 text-xs z-50 border-b border-white/10 relative transition-all">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Left Text with Heart Badge */}
          <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-md shrink-0 animate-pulse shadow-xs">
              <Heart className="w-2.5 h-2.5 fill-white" />
              <span>{badgeText}</span>
            </span>
            <p className="font-medium text-[11px] sm:text-xs text-white/95 truncate max-w-full text-center sm:text-left">
              {bannerText}
            </p>
          </div>

          {/* Right Action Button & Close */}
          <div className="flex items-center gap-2 shrink-0 justify-center w-full sm:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-growth-green hover:bg-white/90 font-bold px-3 py-1 text-[11px] shadow-sm flex items-center gap-1.5 transition-all cursor-pointer rounded-lg shrink-0"
            >
              <Heart className="w-3 h-3 text-red-600 fill-red-600" />
              <span className="whitespace-nowrap">{btnText}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/70 hover:text-white p-1 transition-colors cursor-pointer rounded-md hover:bg-white/10 shrink-0"
              title="Close Banner"
              aria-label="Close Announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <QuickDonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
