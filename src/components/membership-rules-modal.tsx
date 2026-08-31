"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";
import { 
  Scale, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck,
  X
} from "lucide-react";
import Image from "next/image";

export function MembershipRulesModal({
  isOpen,
  onProceed,
}: {
  isOpen: boolean;
  onProceed: () => void;
}) {
  const { language } = useLanguage();
  const router = useRouter();
  const [showFullRules, setShowFullRules] = useState(false);

  if (!isOpen) return null;

  const rulesSummary = [
    { num: "১", bn: "মাদকজুয়া, সুদ-ঘুষ, পরনারী আসক্ত ও অনৈতিক কাজ থেকে নিজেকে বিরত রাখা।", en: "Strictly avoid narcotics, gambling, usury, bribery, and immoral conduct." },
    { num: "২", bn: "সদস্যদের সাথে শালীন ভাষা ব্যবহার ও পারস্পরিক একতা, সম্প্রীতি বজায় রাখা।", en: "Maintain respectful language, brotherly unity, and mutual harmony." },
    { num: "৩", bn: "আইনশৃঙ্খলা ও রাষ্ট্রবিরোধী কাজে জড়িত হলে তাৎক্ষণিক সদস্যপদ বাতিল।", en: "Zero tolerance for anti-state or illegal activities; immediate termination." },
    { num: "৪", bn: "সংগঠনের কার্যকরী উঠান বৈঠক ও অনলাইন মিটিংয়ে নিয়মিত উপস্থিত থাকা।", en: "Mandatory participation in official yard meetings and online conferences." },
    { num: "৫", bn: "অনুমতি ছাড়া ৩ মাসের বেশি যোগাযোগ বিচ্ছিন্ন থাকলে সদস্যপদ বাতিল।", en: "Unannounced absence exceeding 3 months leads to revocation." },
    { num: "৬", bn: "কমিটির মেয়াদকাল ২ বছর; ঐক্যমতের ভিত্তিতে বহাল বা পুনর্গঠন হবে।", en: "Executive term is 2 years; sustained or reconstituted by consensus." },
    { num: "৭", bn: "পদত্যাগ করতে চাইলে লিখিত আবেদন দিতে হবে এবং ৩ দিনের মধ্যে সিদ্ধান্ত জানানো হবে।", en: "Written resignation required; decision conveyed within 3 days." },
    { num: "৮", bn: "সকলের মতামতের ভিত্তিতে গৃহীত গণতান্ত্রিক সিদ্ধান্তই চূড়ান্ত বলে গণ্য হবে।", en: "Collective consensus and democratic decisions are final and binding." },
  ];

  const handleGoToRules = () => {
    router.push("/about#rules");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-surface-container-lowest dark:bg-surface-container-low border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-growth-green via-primary to-impact-orange"></div>

        {/* Modal Header */}
        <div className="p-6 pb-4 text-center border-b border-border bg-surface-off-white dark:bg-surface/40">
          <div className="flex justify-center mb-3">
            <Image 
              src="/logo.png" 
              alt="Birkhal Youth Logo" 
              width={64} 
              height={64} 
              className="object-contain drop-shadow-sm" 
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-growth-green/10 text-growth-green font-bold text-xs border border-growth-green/20 mb-2 rounded-xl">
            <Scale className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "গঠনতান্ত্রিক নীতিমালা যাচাই" : "Constitutional Policy Verification"}</span>
          </div>
          <h3 className="font-headline-lg text-xl sm:text-2xl font-bold text-foreground">
            {language === "bn" ? "আপনি কি সংগঠনের নীতিমালা পড়েছেন?" : "Have you read our Membership Policies?"}
          </h3>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-md mx-auto leading-relaxed">
            {language === "bn"
              ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের সদস্যপদ গ্রহণের পূর্বে ৮টি মূল গঠনতান্ত্রিক নীতিমালা ও আচরণবিধি জেনে নেওয়া বাধ্যতামূলক।"
              : "Abiding by our 8 constitutional clauses and code of conduct is strictly required for all applicants."}
          </p>
        </div>

        {/* Modal Body / Rules List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Quick Accordion Toggle */}
          <div className="border border-border bg-surface dark:bg-background/80 p-4 rounded-xl">
            <button
              onClick={() => setShowFullRules(!showFullRules)}
              className="w-full flex items-center justify-between font-bold text-xs sm:text-sm text-growth-green hover:underline cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{language === "bn" ? "একনজরে ৮টি মূল নীতিমালা দেখুন" : "Quick View: 8 Core Policy Clauses"}</span>
              </span>
              {showFullRules ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showFullRules && (
              <div className="mt-4 pt-3 border-t border-border space-y-2.5 animate-in fade-in duration-200">
                {rulesSummary.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-on-surface-variant">
                    <span className="w-5 h-5 bg-growth-green/10 text-growth-green font-bold flex items-center justify-center shrink-0 text-[11px] border border-growth-green/20 rounded-md">
                      {r.num}
                    </span>
                    <p className="leading-relaxed">
                      {language === "bn" ? r.bn : r.en}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5 leading-relaxed rounded-xl">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              {language === "bn"
                ? "নীতিমালা অমান্য করলে কিংবা সাংগঠনিক শৃঙ্খলা ভঙ্গ করলে সদস্যপদ বাতিল বলে গণ্য হবে।"
                : "Violation of any policy will lead to immediate cancellation of membership."}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 pt-4 bg-surface-off-white dark:bg-surface/50 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleGoToRules}
            className="w-full sm:w-auto px-5 py-3 border border-border bg-surface dark:bg-background text-foreground hover:bg-surface-variant font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer rounded-xl"
          >
            <BookOpen className="w-4 h-4 text-reliability-blue" />
            <span>{language === "bn" ? "না, নীতিমালা পড়তে চাই" : "Read Full Constitution"}</span>
          </button>

          <button
            type="button"
            onClick={onProceed}
            className="w-full sm:w-auto px-6 py-3 bg-growth-green hover:bg-[#236026] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer rounded-xl"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === "bn" ? "হ্যাঁ, আমি পড়েছি ও একমত" : "I Agree & Continue to Form"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
