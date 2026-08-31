"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { Heart } from "lucide-react";
import { QuickDonationModal } from "./quick-donation-modal";

export function FloatingDonationButton({ settings = {} }: { settings?: Record<string, string> }) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hide on dashboard routes or if disabled by admin
  if (pathname?.startsWith("/dashboard") || settings["floating_donation_enabled"] === "false") {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <aside aria-label="Quick Donation" className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 text-white font-bold px-4 md:px-5 py-3 shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 cursor-pointer border border-white/20 rounded-xl"
          aria-label="Donate Now"
        >
          {/* Pulsing Glowing Ring */}
          <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 opacity-40 blur-md group-hover:opacity-75 animate-pulse -z-10"></span>

          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white animate-bounce" />
          </div>

          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] uppercase tracking-wider text-white/90 font-bold">
              {language === "bn" ? "জরুরি মানবসেবা" : "Charity Aid"}
            </span>
            <span className="text-xs md:text-sm font-bold tracking-tight">
              {language === "bn" ? "অনুদান দিন" : "Donate Now"}
            </span>
          </div>

          <span className="hidden sm:inline-block ml-1 px-2 py-0.5 bg-white/25 text-[11px] font-bold">
            বিকাশ / নগদ
          </span>
        </button>
      </aside>

      {/* Global Donation Modal */}
      <QuickDonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
