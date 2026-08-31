"use client";

import { useLanguage } from "@/components/language-provider";
import { 
  CircleDollarSign, 
  HeartHandshake, 
  CheckCircle2, 
  Users, 
  Smartphone, 
  Copy, 
  Check, 
  Heart, 
  ShieldCheck, 
  Lock,
  QrCode
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { QuickDonationModal } from "@/components/quick-donation-modal";

export function DonationsClient({ 
  donations = [],
  settings = {} 
}: { 
  donations?: any[];
  settings?: Record<string, string>;
}) {
  const { language } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Total Completed Donation Amount (Calculated dynamically from real completed donations, default 0)
  const actualDonationSum = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const displayAmount = settings["donation_total_fund_override"] !== undefined && settings["donation_total_fund_override"] !== ""
    ? Number(settings["donation_total_fund_override"])
    : actualDonationSum;

  // 2. Total Donors Count (Calculated dynamically from real completed donations, default 0)
  const actualDonorCount = donations.length;
  const donorCount = settings["donation_total_donors_override"] !== undefined && settings["donation_total_donors_override"] !== ""
    ? settings["donation_total_donors_override"]
    : actualDonorCount;

  // 3. Total Families / Projects Supported (Dynamic setting, default 0)
  const familiesSupported = settings["stat_families_supported"] || settings["stat_volunteers"] || "0";
  const familiesSupportedLabel = (language === "bn" ? settings["stat_families_label_bn"] : settings["stat_families_label_en"]) || (
    language === "bn" ? "সহায়তাপ্রাপ্ত পরিবার ও প্রকল্প" : "Families & Projects Supported"
  );
  const familiesSupportedSub = (language === "bn" ? settings["stat_families_sub_bn"] : settings["stat_families_sub_en"]) || (
    language === "bn" ? "কুমিল্লা, চান্দিনা ও বীরখাল" : "Cumilla, Chandina, Birkhal"
  );

  const heroTitle = (language === "bn" ? settings["donation_hero_title_bn"] : settings["donation_hero_title_en"]) || (
    language === "bn" ? "অনুদানের পরিসংখ্যান ও তহবিল" : "Donation Fund & Analytics"
  );

  const heroDesc = (language === "bn" ? settings["donation_hero_desc_bn"] : settings["donation_hero_desc_en"]) || (
    language === "bn" 
      ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের মানবিক সহায়তা, শিক্ষা বৃত্তি, বৃক্ষরোপণ ও জরুরি ত্রাণ কার্যক্রমে যারা আর্থিক সহায়তা দিয়েছেন তাদের প্রতি আমরা আন্তরিক কৃতজ্ঞ।" 
      : "We express our sincere gratitude to all generous donors whose contributions power our education, healthcare, and humanitarian projects."
  );

  const bkashNumber = settings["donation_bkash_number"] || "01882447721";
  const bkashQr = settings["donation_bkash_qr"] || "";

  const nagadNumber = settings["donation_nagad_number"] || "01609296990";
  const nagadQr = settings["donation_nagad_qr"] || "";

  const bankInfo = (language === "bn" ? settings["donation_bank_info_bn"] : settings["donation_bank_info_en"]) || (
    language === "bn"
      ? "ব্যাংক: ইসলামী ব্যাংক বাংলাদেশ লিমিটেড\nহিসাবের নাম: বীরখাল সমাজ কল্যাণ যুব সংগঠন\nহিসাব নম্বর: ২০৫০৩৯২০১০০১২৩৪৫৬\nশাখা: চান্দিনা শাখা, কুমিল্লা"
      : "Bank: Islami Bank Bangladesh Ltd\nAccount Name: Birkhal Youth Welfare Org\nAccount No: 20503920100123456\nBranch: Chandina Branch, Cumilla"
  );

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="flex-grow w-full max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-10 space-y-16">
      
      {/* Header Section with Glassmorphism Card */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-off-white to-surface-variant/30 dark:from-surface-container-low dark:to-surface-container-highest shadow-sm border border-border p-8 md:p-14 text-center md:text-left">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface-container-lowest/80 backdrop-blur-md border border-border shadow-xs w-fit text-xs font-bold text-growth-green rounded-xl">
            <Heart className="w-4 h-4 text-red-600 fill-red-600 animate-pulse" />
            <span>{language === "bn" ? "মানবসেবা ও উন্নয়ন তহবিল" : "Humanitarian Welfare Fund"}</span>
          </div>

          <h1 className="font-headline-xl text-3xl md:text-5xl text-foreground font-bold tracking-tight">
            {heroTitle}
          </h1>

          <p className="font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed">
            {heroDesc}
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-growth-green hover:bg-[#236026] text-white font-bold px-6 py-3 text-sm flex items-center gap-2 transition-all shadow-md hover:-translate-y-0.5 cursor-pointer rounded-xl"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{language === "bn" ? "এখনই অনুদান প্রদান করুন" : "Donate Now Online"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Summary Counters: Total Donors & Impact */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Donors Count */}
        <div className="bg-surface-container-lowest dark:bg-surface-container-low p-8 shadow-sm border border-border flex items-center gap-6 group hover:shadow-md transition-all rounded-xl">
          <div className="p-5 bg-reliability-blue/10 text-reliability-blue group-hover:scale-110 transition-transform rounded-xl">
            <Users className="w-10 h-10" />
          </div>
          <div>
            <p className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-bold">
              {language === "bn" ? "মোট অনুদানকারী দাতা" : "Total Donors Count"}
            </p>
            <h2 className="font-headline-xl text-3xl md:text-5xl text-reliability-blue font-bold tracking-tight mt-1">
              {donorCount} <span className="text-xl font-normal text-on-surface-variant">{language === "bn" ? "জন" : "People"}</span>
            </h2>
            <span className="text-[11px] text-growth-green font-bold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {language === "bn" ? "সকল অনুদান যাচাইকৃত" : "Verified Contributions"}
            </span>
          </div>
        </div>

        {/* Total Collected Amount */}
        <div className="bg-surface-container-lowest dark:bg-surface-container-low p-8 shadow-sm border border-border flex items-center gap-6 group hover:shadow-md transition-all rounded-xl">
          <div className="p-5 bg-growth-green/10 text-growth-green group-hover:scale-110 transition-transform rounded-xl">
            <CircleDollarSign className="w-10 h-10" />
          </div>
          <div>
            <p className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-bold">
              {language === "bn" ? "মোট সংগৃহীত অনুদান তহবিল" : "Total Welfare Fund"}
            </p>
            <h2 className="font-headline-xl text-3xl md:text-5xl text-growth-green font-bold tracking-tight mt-1">
              ৳ {displayAmount.toLocaleString()}
            </h2>
            <span className="text-[11px] text-on-surface-variant font-medium mt-1 block">
              {language === "bn" ? "শতভাগ স্বচ্ছতা ও জবাবদিহিতা" : "100% Transparently Handled"}
            </span>
          </div>
        </div>
 
        {/* Total Families & Beneficiaries Supported */}
        <div className="bg-surface-container-lowest dark:bg-surface-container-low p-8 shadow-sm border border-border flex items-center gap-6 group hover:shadow-md transition-all sm:col-span-2 lg:col-span-1 rounded-xl">
          <div className="p-5 bg-impact-orange/10 text-impact-orange group-hover:scale-110 transition-transform rounded-xl">
            <HeartHandshake className="w-10 h-10" />
          </div>
          <div>
            <p className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-bold">
              {familiesSupportedLabel}
            </p>
            <h2 className="font-headline-xl text-3xl md:text-5xl text-impact-orange font-bold tracking-tight mt-1">
              {familiesSupported} <span className="text-xl font-normal text-on-surface-variant">{language === "bn" ? "পরিবার" : "Families"}</span>
            </h2>
            <span className="text-[11px] text-on-surface-variant font-medium mt-1 block">
              {familiesSupportedSub}
            </span>
          </div>
        </div>
      </section>

      {/* Official Payment Accounts Information */}
      <section className="bg-surface-container-lowest dark:bg-surface-container-low border border-border p-6 sm:p-10 shadow-sm space-y-8 rounded-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-growth-green/10 text-growth-green font-bold text-xs mb-2 border border-growth-green/20 rounded-xl">
            <Smartphone className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "অফিসিয়াল পেমেন্ট নম্বরসমূহ" : "Official Payment Accounts"}</span>
          </div>
          <h3 className="font-headline-lg text-2xl md:text-3xl font-bold text-foreground">
            {language === "bn" ? "সরাসরি অনুদান প্রেরণের মাধ্যম" : "Direct Ways to Send Your Donation"}
          </h3>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
            {language === "bn"
              ? "নিচের যেকোনো বিকাশ, নগদ বা ব্যাংক একাউন্টে আপনার অনুদান পাঠিয়ে তথ্য আমাদের জানান।"
              : "Send your donation via any of the verified channels below and confirm with us."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* bKash */}
          <div className="p-6 bg-surface dark:bg-background border border-border space-y-4 relative group flex flex-col justify-between rounded-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-pink-600">bKash (বিকাশ)</span>
                <span className="px-2 py-0.5 bg-pink-500/10 text-pink-600 text-[10px] font-bold rounded-md">Send Money</span>
              </div>
              <div className="font-headline-md text-xl sm:text-2xl font-bold text-foreground tracking-wider break-all">
                {bkashNumber}
              </div>

              {bkashQr && (
                <div className="relative w-36 h-36 mx-auto bg-white p-2 border border-border overflow-hidden rounded-xl">
                  <Image 
                    src={bkashQr} 
                    alt="bKash QR Code" 
                    fill 
                    unoptimized={bkashQr.startsWith("data:")}
                    className="object-contain rounded-lg" 
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => handleCopy(bkashNumber.split(" ")[0], "bkash")}
              className="w-full py-2.5 bg-pink-50 dark:bg-pink-950/40 text-pink-600 hover:bg-pink-600 hover:text-white font-bold text-xs border border-pink-200 dark:border-pink-900 flex items-center justify-center gap-2 transition-all cursor-pointer mt-4 rounded-xl"
            >
              {copiedKey === "bkash" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === "bkash" ? (language === "bn" ? "নম্বর কপি হয়েছে!" : "Copied!") : (language === "bn" ? "বিকাশ নম্বর কপি করুন" : "Copy bKash Number")}</span>
            </button>
          </div>

          {/* Nagad */}
          <div className="p-6 bg-surface dark:bg-background border border-border space-y-4 relative group flex flex-col justify-between rounded-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-orange-600">Nagad (নগদ)</span>
                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 text-[10px] font-bold rounded-md">Send Money</span>
              </div>
              <div className="font-headline-md text-xl sm:text-2xl font-bold text-foreground tracking-wider break-all">
                {nagadNumber}
              </div>

              {nagadQr && (
                <div className="relative w-36 h-36 mx-auto bg-white p-2 border border-border overflow-hidden rounded-xl">
                  <Image 
                    src={nagadQr} 
                    alt="Nagad QR Code" 
                    fill 
                    unoptimized={nagadQr.startsWith("data:")}
                    className="object-contain rounded-lg" 
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => handleCopy(nagadNumber.split(" ")[0], "nagad")}
              className="w-full py-2.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 hover:bg-orange-600 hover:text-white font-bold text-xs border border-orange-200 dark:border-orange-900 flex items-center justify-center gap-2 transition-all cursor-pointer mt-4 rounded-xl"
            >
              {copiedKey === "nagad" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === "nagad" ? (language === "bn" ? "নম্বর কপি হয়েছে!" : "Copied!") : (language === "bn" ? "নগদ নম্বর কপি করুন" : "Copy Nagad Number")}</span>
            </button>
          </div>

          {/* Bank Transfer */}
          <div className="p-6 bg-surface dark:bg-background border border-border space-y-4 relative group flex flex-col justify-between rounded-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-growth-green">{language === "bn" ? "ব্যাংক একাউন্ট" : "Bank Account"}</span>
                <span className="px-2 py-0.5 bg-growth-green/10 text-growth-green text-[10px] font-bold rounded-md">Bank Deposit</span>
              </div>
              <div className="text-xs space-y-1 text-on-surface-variant whitespace-pre-line font-mono bg-surface-container-low dark:bg-surface-container-lowest p-3 border border-border rounded-lg">
                {bankInfo}
              </div>
            </div>

            <button
              onClick={() => handleCopy(bankInfo, "bank")}
              className="w-full py-2.5 bg-growth-green/10 text-growth-green hover:bg-growth-green hover:text-white font-bold text-xs border border-growth-green/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-4 rounded-xl"
            >
              {copiedKey === "bank" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === "bank" ? (language === "bn" ? "বিবরণ কপি হয়েছে!" : "Copied!") : (language === "bn" ? "ব্যাংক তথ্য কপি করুন" : "Copy Bank Info")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Privacy & Governance Notice */}
      <section className="p-6 bg-surface-container-low dark:bg-surface-container-lowest border border-border flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl">
        <div className="w-12 h-12 bg-growth-green/10 text-growth-green flex items-center justify-center shrink-0 rounded-xl">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-xs text-on-surface-variant leading-relaxed">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-growth-green" />
            <span>{language === "bn" ? "দাতাদের আর্থিক তথ্যের পূর্ণ গোপনীয়তা ও স্বচ্ছতা সুরক্ষা" : "Donor Privacy & Transparency Protocol"}</span>
          </h4>
          <p>
            {language === "bn"
              ? "দাতাদের ব্যক্তিগত সম্মান ও নিরাপত্তা বজায় রাখতে সাধারণ পাবলিক পেজে নামের তালিকা ও আর্থিক লেনদেনের রেকর্ড উন্মুক্ত রাখা হয় না। সংগঠনের সকল অনুদানের পূর্ণাঙ্গ ভাউচার, ক্যাশলেজার ও অডিট হিসাব শুধুমাত্র অভ্যন্তরীণ অ্যাডমিন ড্যাশবোর্ড এবং কার্যনির্বাহী অডিট পরিষদের নিকট শতভাগ স্বচ্ছতার সাথে সংরক্ষিত থাকে।"
              : "To protect the privacy of generous individuals, detailed transaction records and donor phone numbers are stored exclusively in the secure executive dashboard and audited periodically."}
          </p>
        </div>
      </section>

      {/* Global Quick Donation Modal */}
      <QuickDonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Unified Footer */}
      <Footer settings={settings} />
    </div>
  );
}
