"use client";

import { useLanguage } from "@/components/language-provider";
import { 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  Scale, 
  Users, 
  Calendar, 
  FileText, 
  Sparkles,
  AlertOctagon
} from "lucide-react";

export function OrganizationRules({ settings = {} }: { settings?: Record<string, string> }) {
  const { language } = useLanguage();

  const rulesHeading = (language === "bn" ? settings["rules_heading_bn"] : settings["rules_heading_en"]) || (
    language === "bn" ? "সাংগঠনিক নীতিমালা ও আচরণবিধি" : "Constitutional Policies & Code of Conduct"
  );

  const rulesDesc = (language === "bn" ? settings["rules_desc_bn"] : settings["rules_desc_en"]) || (
    language === "bn"
      ? "একটি সুন্দর আদর্শ সমাজ বিনির্মাণে ও আর্ত মানবতার সেবায় বীরখাল সমাজ কল্যাণ যুব সংগঠনের আনুষ্ঠানিক গঠনতান্ত্রিক নীতিমালা।"
      : "Official constitutional guidelines and code of conduct governing Birkhal Social Welfare Youth Organization."
  );

  const rules = [
    {
      id: 1,
      numBn: "১",
      titleBn: "নৈতিক ও সামাজিক অনুশাসন",
      titleEn: "Moral & Ethical Discipline",
      descBn: "মাদকজুয়া, সুদ-ঘুষ, পরনারী আসক্ত ও ইসলাম বিরোধী যে কোন কাজ থেকে নিজেকে বিরত রাখতে হবে এবং অন্যকে বিরত থাকার জন্য উৎসাহিত করতে হবে।",
      descEn: "Members must strictly refrain from narcotics, gambling, usury, bribery, unlawful conduct, and any immoral acts, while actively encouraging others to stay righteous.",
      icon: Scale,
      color: "text-growth-green",
      bg: "bg-growth-green/10",
      border: "border-growth-green/20"
    },
    {
      id: 2,
      numBn: "২",
      titleBn: "পারস্পরিক সম্প্রীতি ও শ্রদ্ধাবোধ",
      titleEn: "Mutual Harmony & Respect",
      descBn: "সংগঠনের সম্মানিত সদস্যদের মধ্যে একে অপরের সাথে মুখের ভাষা খারাপ করা থেকে বিরত থাকতে হবে এবং পারস্পরিক একতা, সৌহার্দ্য, সম্প্রীতি ও সহমর্মিতা বজায় রাখতে হবে। একে অন্যের মতামতকে প্রাধান্য দিতে হবে।",
      descEn: "Members must avoid offensive language, preserve unity, brotherly harmony, and empathy, and prioritize mutual respect and constructive discussion.",
      icon: Users,
      color: "text-reliability-blue",
      bg: "bg-reliability-blue/10",
      border: "border-reliability-blue/20"
    },
    {
      id: 3,
      numBn: "৩",
      titleBn: "আইন ও শৃঙ্খলা বিরোধী কাজে সদস্যপদ বাতিল",
      titleEn: "Zero Tolerance for Law Violations",
      descBn: "সংগঠনের কোন সদস্য রাষ্ট্র ও আইন শৃঙ্খলা বিরোধী কোন কাজে জড়িত হলে এবং নারী ঘটিত কোন কেলেঙ্কারীতে জড়িয়ে পরলে তার সদস্য পদ বাতিল হবে।",
      descEn: "Any member involved in anti-state, unlawful, or scandalous activities will face immediate and permanent membership termination.",
      icon: AlertOctagon,
      color: "text-red-600",
      bg: "bg-red-500/10",
      border: "border-red-500/20"
    },
    {
      id: 4,
      numBn: "৪",
      titleBn: "কার্যকরী সভা ও মিটিংয়ে উপস্থিতি",
      titleEn: "Attendance in Meetings & Duties",
      descBn: "সংগঠনের সম্মানিত সদস্যগণ সংগঠনের যে কোনো কার্যকরী উঠান বৈঠক অথবা অনলাইন মিটিংয়ে অবশ্যই উপস্থিত থাকতে হবে। কোন কারণে অনুপস্থিত থাকলে নিজ দায়িত্বে মিটিংয়ের সিদ্ধান্ত সমূহ জেনে নিয়ে সে অনুযায়ী ভূমিকা রাখতে হবে।",
      descEn: "Members must attend all official yard meetings and online conferences. In case of unavoidable absence, they must proactively learn the decisions and fulfill their role.",
      icon: Calendar,
      color: "text-impact-orange",
      bg: "bg-impact-orange/10",
      border: "border-impact-orange/20"
    },
    {
      id: 5,
      numBn: "৫",
      titleBn: "অনুমতিবিহীন দীর্ঘ অনুপস্থিতি",
      titleEn: "Unannounced Absence Policy",
      descBn: "কমিটির কোন সদস্য অনুমতি ব্যতীত সংগঠনের সাথে তিন মাসের অধিককাল সময় যোগাযোগ বিচ্ছিন্ন রাখলে তার সদস্য পদ বাতিল বলে গণ্য হবে।",
      descEn: "If any committee member remains disconnected from organizational communication for more than three months without official permission, their post will be revoked.",
      icon: ShieldCheck,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
    {
      id: 6,
      numBn: "৬",
      titleBn: "কমিটির মেয়াদকাল ও পুনর্গঠন",
      titleEn: "Tenure & Reconstitution of Committee",
      descBn: "কমিটি গঠন করার মেয়াদকাল থাকবে দুই বছর। নির্ধারিত মেয়াদ শেষ হলে সকল কমিটির ঐক্যমতের ভিত্তিতে চাইলে পূর্বে গঠিত কমিটি বহাল রাখতে পারবে অন্যথায় নতুন কমিটি গঠন করতে হবে।",
      descEn: "The executive committee term is 2 years. Upon completion, the committee can be sustained by unanimous consensus, or a fresh committee will be elected.",
      icon: BookOpen,
      color: "text-growth-green",
      bg: "bg-growth-green/10",
      border: "border-growth-green/20"
    },
    {
      id: 7,
      numBn: "৭",
      titleBn: "পদত্যাগ ও সিদ্ধান্ত প্রক্রিয়া",
      titleEn: "Resignation & Processing Protocol",
      descBn: "কোন কমিটি সদস্য পদত্যাগ করতে চাইলে তা অবশ্যই লিখিত ভাবে কমিটি গ্রুপে দিতে হবে এবং প্রচার বিষয়ক সম্পাদক উপদেষ্টা সহ সকল কমিটিদের অবগত করবে। তিন দিনের মধ্যে সকল কমিটিদের পক্ষ থেকে চূড়ান্ত সিদ্ধান্ত জানাতে হবে।",
      descEn: "Resignation requests must be submitted in writing. The publicity secretary will inform the advisory council, and a final decision will be issued within 3 days.",
      icon: FileText,
      color: "text-reliability-blue",
      bg: "bg-reliability-blue/10",
      border: "border-reliability-blue/20"
    },
    {
      id: 8,
      numBn: "৮",
      titleBn: "সর্বসম্মত চূড়ান্ত সিদ্ধান্ত",
      titleEn: "Finality of Collective Consensus",
      descBn: "সকলের মতামতের ভিত্তিতে যে সিদ্ধান্ত গৃহীত হবে তা-ই চূড়ান্ত বলে গণ্য হবে।",
      descEn: "Decisions reached through collective discussion, democratic vote, and mutual consensus shall be considered absolute and final.",
      icon: CheckCircle2,
      color: "text-growth-green",
      bg: "bg-growth-green/10",
      border: "border-growth-green/20"
    }
  ];

  return (
    <section className="relative w-full py-8" id="rules">
      {/* Official Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-growth-green/10 text-growth-green font-bold text-xs rounded-xl border border-growth-green/20">
          <Scale className="w-3.5 h-3.5" />
          <span>{language === "bn" ? "কার্যকরী ২০২৬ ইং থেকে" : "Effective from 2026"}</span>
        </div>
        
        <h2 className="font-headline-xl text-3xl md:text-5xl font-bold text-foreground tracking-tight">
          {rulesHeading}
        </h2>
        
        <p className="font-body-lg text-sm md:text-base text-on-surface-variant leading-relaxed">
          {rulesDesc}
        </p>
      </div>

      {/* Grid of 8 Official Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <div
              key={rule.id}
              className="bg-surface-container-lowest dark:bg-surface-container-low p-6 sm:p-7 rounded-xl border border-border shadow-xs hover:shadow-md transition-all flex items-start gap-4 sm:gap-5"
            >
              <div className={`p-3 rounded-lg ${rule.bg} ${rule.color} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 flex-grow">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-foreground">
                    {language === "bn" ? rule.titleBn : rule.titleEn}
                  </h3>
                  <span className="text-xs font-bold text-on-surface-variant/70 font-mono px-2.5 py-0.5 bg-surface-variant/60 dark:bg-surface-variant/30 border border-border/40 rounded-md">
                    {language === "bn" ? `ধারা ${rule.numBn}` : `Clause ${rule.id}`}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {language === "bn" ? rule.descBn : rule.descEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
