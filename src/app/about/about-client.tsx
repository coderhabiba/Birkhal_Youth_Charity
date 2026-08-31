"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import Image from "next/image";
import { 
  Flag, 
  Eye, 
  Users, 
  HeartHandshake, 
  Sprout, 
  ArrowRight, 
  ShieldCheck, 
  User as UserIcon,
  Phone,
  MapPin,
  Award
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { OrganizationRules } from "@/components/organization-rules";
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
  return translateBanglaBio(member.description || "", lang);
}

export function AboutClient({ 
  settings = {},
  committeeMembers = [] 
}: { 
  settings?: Record<string, string>;
  committeeMembers?: any[];
}) {
  const { language } = useLanguage();

  const heroTitle = (language === "bn" ? settings["about_hero_title_bn"] : settings["about_hero_title_en"]) || (
    language === "bn" ? "পরবর্তী প্রজন্মের নেতাদের ক্ষমতায়ন" : "Empowering the Next Generation of Leaders"
  );

  const heroDesc = (language === "bn" ? settings["about_hero_desc_bn"] : settings["about_hero_desc_en"]) || (
    language === "bn"
      ? "বীরখাল সমাজ কল্যাণ যুব সংগঠন কুমিল্লা, চান্দিনা এবং কাদুটি বাজারের যুবসমাজের মধ্যে প্রবৃদ্ধি, শিক্ষা এবং সামাজিক সম্পৃক্ততা বৃদ্ধির জন্য নিবেদিত। আমরা বিশ্বাসের ভিত্তি গড়ে তোলা এবং টেকসই উন্নয়নের সুযোগ প্রদানে বিশ্বাসী।"
      : "Birkhal Youth Organization is dedicated to fostering growth, education, and community engagement among the youth of Cumilla, Chandina, and Kaduti Bazar."
  );

  const missionTitle = (language === "bn" ? settings["about_mission_title_bn"] : settings["about_mission_title_en"]) || (
    language === "bn" ? "আমাদের লক্ষ্য" : "Our Mission"
  );

  const missionDesc = (language === "bn" ? settings["about_mission_desc_bn"] : settings["about_mission_desc_en"]) || (
    language === "bn"
      ? "সাশ্রয়ী মূল্যের শিক্ষা উপকরণ, দক্ষতা প্রশিক্ষণ এবং নাগরিক সম্পৃক্ততার প্ল্যাটফর্ম প্রদান করে স্থানীয় যুবসমাজের ক্ষমতায়ন করা। আমরা এমন একটি অন্তর্ভুক্তিমূলক পরিবেশ তৈরি করতে চাই যেখানে প্রতিটি তরুণ তাদের সম্ভাবনা আবিষ্কার করতে পারে এবং সমাজে অর্থপূর্ণ অবদান রাখতে পারে।"
      : "To empower local youth by providing accessible educational resources, skills training, and a platform for civic engagement. We strive to create an inclusive environment where every young person can discover their potential and contribute meaningfully to society."
  );

  const visionTitle = (language === "bn" ? settings["about_vision_title_bn"] : settings["about_vision_title_en"]) || (
    language === "bn" ? "আমাদের ভিশন" : "Our Vision"
  );

  const visionDesc = (language === "bn" ? settings["about_vision_desc_bn"] : settings["about_vision_desc_en"]) || (
    language === "bn"
      ? "একটি সমৃদ্ধ, আন্তঃসংযুক্ত সম্প্রদায় যেখানে ক্ষমতায়িত যুবসমাজ টেকসই উন্নয়ন, উদ্ভাবন এবং সামাজিক সম্প্রীতির নেতৃত্ব দেয়, এবং আশেপাশের অঞ্চলগুলির জন্য একটি মডেল হিসেবে কাজ করে।"
      : "A thriving, interconnected community where empowered youth lead the way in sustainable development, innovation, and social harmony, serving as a model for surrounding regions."
  );

  const val1Title = (language === "bn" ? settings["about_val1_title_bn"] : settings["about_val1_title_en"]) || (
    language === "bn" ? "স্বচ্ছতা ও বিশ্বাস" : "Transparency & Trust"
  );
  const val1Desc = (language === "bn" ? settings["about_val1_desc_bn"] : settings["about_val1_desc_en"]) || (
    language === "bn" ? "আমাদের সকল কার্যক্রম ও অর্থায়নে আমরা শতভাগ স্বচ্ছতা বজায় রাখি।" : "We maintain 100% transparency in all our operations and funding."
  );

  const val2Title = (language === "bn" ? settings["about_val2_title_bn"] : settings["about_val2_title_en"]) || (
    language === "bn" ? "ঐক্য ও সহযোগিতা" : "Unity & Collaboration"
  );
  const val2Desc = (language === "bn" ? settings["about_val2_desc_bn"] : settings["about_val2_desc_en"]) || (
    language === "bn" ? "একসাথে কাজ করার মাধ্যমেই আমরা সবচেয়ে বড় পরিবর্তন আনতে পারি।" : "Only by working together can we bring about the greatest change."
  );

  const val3Title = (language === "bn" ? settings["about_val3_title_bn"] : settings["about_val3_title_en"]) || (
    language === "bn" ? "টেকসই উন্নয়ন" : "Sustainable Growth"
  );
  const val3Desc = (language === "bn" ? settings["about_val3_desc_bn"] : settings["about_val3_desc_en"]) || (
    language === "bn" ? "দীর্ঘমেয়াদী ইতিবাচক প্রভাব তৈরি করার জন্য আমরা কাজ করে যাচ্ছি।" : "We are working to create long-term positive impacts."
  );

  // Fallback committee members if DB is empty
  const defaultCommittee = [
    {
      _id: "c-1",
      name: "মুহাম্মদ মোমিন হোসাইন",
      role: "সভাপতি (President)",
      address: "বীরখাল, চান্দিনা, কুমিল্লা",
      image: "/up-1.jpeg",
      isVerified: true
    },
    {
      _id: "c-2",
      name: "কাজী তানভীর হাসান",
      role: "সাধারণ সম্পাদক (General Secretary)",
      address: "কাদুটি বাজার, চান্দিনা, কুমিল্লা",
      image: "/up-2.jpeg",
      isVerified: true
    },
    {
      _id: "c-3",
      name: "মোঃ জহিরুল ইসলাম",
      role: "সহ-সভাপতি (Vice President)",
      address: "কাদুটি বাজার, চান্দিনা",
      image: "/up-3.jpeg",
      isVerified: true
    },
    {
      _id: "c-4",
      name: "মোঃ সাইফুল ইসলাম",
      role: "সাংগঠনিক সম্পাদক (Organizing Secretary)",
      address: "বীরখাল, চান্দিনা, কুমিল্লা",
      image: "/up-4.jpeg",
      isVerified: true
    },
    {
      _id: "c-5",
      name: "মোঃ তানভীর আহমেদ",
      role: "অর্থ সম্পাদক (Finance Secretary)",
      address: "বীরখাল, চান্দিনা, কুমিল্লা",
      image: "/up-5.jpeg",
      isVerified: true
    },
    {
      _id: "c-6",
      name: "মোঃ রাশেদুল হক",
      role: "প্রচার ও প্রকাশনা সম্পাদক",
      address: "বীরখাল, চান্দিনা, কুমিল্লা",
      image: "/up-6.jpeg",
      isVerified: true
    },
    {
      _id: "c-7",
      name: "মোঃ আব্দুল্লাহ আল মামুন",
      role: "সমাজকল্যাণ সম্পাদক",
      address: "মাইজখার, চান্দিনা",
      image: "/up-7.jpeg",
      isVerified: true
    },
    {
      _id: "c-8",
      name: "আলহাজ্ব মোঃ সামসুল হক",
      role: "প্রধান উপদেষ্টা",
      address: "বীরখাল, চান্দিনা, কুমিল্লা",
      image: "/up-15.jpeg",
      isVerified: true
    }
  ];

  const displayCommittee = committeeMembers.length > 0 ? committeeMembers : defaultCommittee;

  const [committeeTab, setCommitteeTab] = useState<"all" | "advisors" | "executive">("all");

  const filteredCommittee = displayCommittee.filter((member: any) => {
    const role = member.role || member.designation || "";
    if (committeeTab === "advisors") {
      return role.includes("উপদেষ্টা") || role.toLowerCase().includes("advisor");
    }
    if (committeeTab === "executive") {
      return !role.includes("উপদেষ্টা") && !role.toLowerCase().includes("advisor");
    }
    return true;
  });

  return (
    <div className="flex-grow w-full max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-10 space-y-16">
      
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-off-white to-surface-variant/30 dark:from-surface-container-low dark:to-surface-container-highest shadow-sm border border-border p-8 md:p-14 text-center md:text-left">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface-container-lowest/80 backdrop-blur-md border border-border shadow-xs w-fit text-xs font-bold text-growth-green rounded-xl">
            <Users className="w-4 h-4 text-growth-green" />
            <span>{language === "bn" ? "আমাদের পরিচিতি ও রূপরেখা" : "Who We Are & Purpose"}</span>
          </div>

          <h1 className="font-headline-xl text-3xl md:text-5xl text-foreground font-bold tracking-tight">
            {heroTitle}
          </h1>

          <p className="font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed">
            {heroDesc}
          </p>
        </div>
      </section>

      {/* Leadership & Executive Committee Section */}
      <section className="w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-growth-green/10 text-growth-green text-xs font-bold rounded-full border border-growth-green/20">
              {language === "bn" ? "সংগঠনের নেতৃত্ব" : "Leadership & Governance"}
            </span>
            <h2 className="font-headline-xl text-2xl md:text-4xl text-foreground font-bold tracking-tight">
              {language === "bn" ? "সম্মানিত পরিচালনা পরিষদ ও উপদেষ্টা" : "Executive Council & Advisory Board"}
            </h2>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-2xl">
              {language === "bn"
                ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের নীতি নির্ধারণ ও বাস্তবায়নে নিবেদিতপ্রাণ নেতৃবৃন্দ।"
                : "Dedicated leadership steering our community welfare and youth initiatives."}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-surface-container-low dark:bg-surface-container-lowest p-1.5 border border-border self-start md:self-auto rounded-xl">
            <button
              onClick={() => setCommitteeTab("all")}
              className={`px-4 py-2 font-bold text-xs transition-all cursor-pointer rounded-lg ${
                committeeTab === "all"
                  ? "bg-growth-green text-white shadow-xs"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              {language === "bn" ? `সকল পরিষদ (${displayCommittee.length})` : `All Council (${displayCommittee.length})`}
            </button>
            <button
              onClick={() => setCommitteeTab("advisors")}
              className={`px-4 py-2 font-bold text-xs transition-all cursor-pointer rounded-lg ${
                committeeTab === "advisors"
                  ? "bg-growth-green text-white shadow-xs"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              {language === "bn" ? "উপদেষ্টা পরিষদ" : "Advisors"}
            </button>
            <button
              onClick={() => setCommitteeTab("executive")}
              className={`px-4 py-2 font-bold text-xs transition-all cursor-pointer rounded-lg ${
                committeeTab === "executive"
                  ? "bg-growth-green text-white shadow-xs"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              {language === "bn" ? "কার্যনির্বাহী পরিষদ (৩৩)" : "Executive (33)"}
            </button>
          </div>
        </div>

        {/* Committee Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCommittee.map((member: any, idx: number) => {
            const memberRole = getRole(member, language);
            const memberName = getName(member, language);
            const memberAddress = getAddress(member, language) || (language === "bn" ? "বীরখাল, চান্দিনা, কুমিল্লা" : "Birkhal, Chandina, Cumilla");
            const memberDesc = getDescription(member, language);

            return (
              <div
                key={member._id || idx}
                className="bg-surface-container-lowest dark:bg-surface-container-low border border-border p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden rounded-xl"
              >
                {/* Top verified indicator */}
                <div className="w-full flex justify-between items-center mb-4">
                  <span className="px-2.5 py-0.5 bg-growth-green/10 text-growth-green text-[11px] font-bold border border-growth-green/20 rounded-md">
                    {(member.role || "").includes("উপদেষ্টা") || (memberRole || "").toLowerCase().includes("advisor")
                      ? (language === "bn" ? "উপদেষ্টা পরিষদ" : "Advisor") 
                      : (language === "bn" ? "কার্যনির্বাহী পরিষদ" : "Executive")}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-growth-green">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{language === "bn" ? "ভেরিফাইড" : "Verified"}</span>
                  </div>
                </div>

                {/* Photo Box */}
                <div className="relative w-32 h-32 mb-5">
                  <div className="w-full h-full overflow-hidden border-2 border-border group-hover:border-growth-green transition-colors shadow-sm relative bg-surface-variant/30 rounded-xl">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={memberName} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 rounded-xl" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-growth-green bg-growth-green/10 rounded-xl">
                        <UserIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-headline-md text-base sm:text-lg font-bold text-foreground group-hover:text-growth-green transition-colors mb-1.5">
                  {memberName}
                </h3>

                {/* Official Designation */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-growth-green text-white font-bold text-xs shadow-xs rounded-md">
                    {memberRole}
                  </span>
                </div>

                {/* Details & Location */}
                {memberDesc && (
                  <p className="text-xs text-on-surface-variant mb-3 line-clamp-2 italic opacity-85">
                    {memberDesc}
                  </p>
                )}

                {/* Address / Location */}
                <div className="w-full pt-3 border-t border-border mt-auto flex items-center justify-center gap-1.5 text-xs text-on-surface-variant font-medium">
                  <MapPin className="w-3.5 h-3.5 text-growth-green shrink-0" />
                  <span className="truncate">{memberAddress}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-surface-container-lowest dark:bg-surface-container-low p-8 shadow-sm border border-border flex flex-col gap-4 rounded-xl">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 flex items-center justify-center text-reliability-blue rounded-xl">
              <Flag className="w-7 h-7" />
            </div>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-foreground font-bold">
              {missionTitle}
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
              {missionDesc}
            </p>
          </div>
          
          {/* Vision Card */}
          <div className="bg-growth-green dark:bg-[#1A4B1D] p-8 shadow-sm flex flex-col gap-4 text-white rounded-xl">
            <div className="bg-white/20 w-14 h-14 flex items-center justify-center text-white rounded-xl">
              <Eye className="w-7 h-7" />
            </div>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-white font-bold">
              {visionTitle}
            </h2>
            <p className="font-body-md text-white/90 leading-relaxed text-sm md:text-base">
              {visionDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="w-full">
        <div className="text-center mb-10">
          <h2 className="font-headline-xl text-3xl md:text-4xl text-foreground font-bold mb-3">
            {language === "bn" ? "আমাদের মূল মূল্যবোধ" : "Our Core Values"}
          </h2>
          <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto text-sm md:text-base">
            {language === "bn"
              ? "যে নীতিগুলো আমাদের সকল কাজ এবং সিদ্ধান্তকে পরিচালিত করে।"
              : "The principles that guide all our actions, programs, and decisions."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest dark:bg-surface-container-low p-8 border border-border text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group rounded-xl">
            <div className="w-16 h-16 bg-impact-orange/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform rounded-xl">
              <HeartHandshake className="w-8 h-8 text-impact-orange" />
            </div>
            <h3 className="font-headline-md text-xl font-bold mb-3 text-foreground">
              {val1Title}
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              {val1Desc}
            </p>
          </div>
          
          <div className="bg-surface-container-lowest dark:bg-surface-container-low p-8 border border-border text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group rounded-xl">
            <div className="w-16 h-16 bg-reliability-blue/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform rounded-xl">
              <Users className="w-8 h-8 text-reliability-blue" />
            </div>
            <h3 className="font-headline-md text-xl font-bold mb-3 text-foreground">
              {val2Title}
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              {val2Desc}
            </p>
          </div>
          
          <div className="bg-surface-container-lowest dark:bg-surface-container-low p-8 border border-border text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group rounded-xl">
            <div className="w-16 h-16 bg-growth-green/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform rounded-xl">
              <Sprout className="w-8 h-8 text-growth-green" />
            </div>
            <h3 className="font-headline-md text-xl font-bold mb-3 text-foreground">
              {val3Title}
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              {val3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Official Organizational Code of Conduct & Policies */}
      <OrganizationRules />

      {/* Reusable Unified Footer */}
      <Footer settings={settings} />
    </div>
  );
}
