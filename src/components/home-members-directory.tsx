"use client";

import { useLanguage } from "@/components/language-provider";
import { useState } from "react";
import { 
  Users, 
  MapPin, 
  Search,
  User as UserIcon, 
  ArrowRight,
  Droplet
} from "lucide-react";
import Link from "next/link";
import { translateBanglaName, translateBanglaAddress } from "@/lib/bengali-transliteration";

export function HomeMembersDirectory({ 
  generalMembers = [],
  settings = {}
}: { 
  generalMembers: any[];
  settings?: Record<string, string>;
}) {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodFilter, setBloodFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(8);

  const membersHeading = (language === "bn" ? settings["members_heading_bn"] : settings["members_heading_en"]) || (
    language === "bn" ? "সংগঠনের সকল নিবেদিত সদস্যবৃন্দ" : "All Registered General Members"
  );
  const membersDesc = (language === "bn" ? settings["members_desc_bn"] : settings["members_desc_en"]) || (
    language === "bn"
      ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের নিবন্ধিত ও অনুমোদিত সকল সম্মানিত সদস্য ও স্বেচ্ছাসেবী তালিকা।"
      : "Meet the dynamic youth volunteers and members building a stronger future."
  );

  // Fallback demo members if DB has none to ensure stunning live visual demonstration
  const displayMembers = generalMembers.length > 0 ? generalMembers : [
    {
      _id: "demo-m1",
      nameBn: "মো: আরিফুল ইসলাম",
      nameEn: "Md. Ariful Islam",
      bloodGroup: "B+",
      presentAddress: "বীরখাল পূর্বপাড়া, চান্দিনা, কুমিল্লা",
      permanentAddress: "বীরখাল, চান্দিনা, কুমিল্লা",
      mobileNumber: "",
      email: "ariful@example.com",
      status: "approved",
      photoUrl: "/up-1.jpeg"
    },
    {
      _id: "demo-m2",
      nameBn: "মো: কামরুল হাসান",
      nameEn: "Md. Kamrul Hasan",
      bloodGroup: "O+",
      presentAddress: "কাদুটি বাজার, চান্দিনা, কুমিল্লা",
      permanentAddress: "কাদুটি, চান্দিনা, কুমিল্লা",
      mobileNumber: "",
      email: "kamrul@example.com",
      status: "approved",
      photoUrl: "/up-2.jpeg"
    },
    {
      _id: "demo-m3",
      nameBn: "আব্দুর রহমান",
      nameEn: "Abdur Rahman",
      bloodGroup: "A+",
      presentAddress: "বীরখাল উত্তরপাড়া, চান্দিনা",
      permanentAddress: "বীরখাল, চান্দিনা",
      mobileNumber: "",
      email: "abdur@example.com",
      status: "approved",
      photoUrl: "/up-3.jpeg"
    },
    {
      _id: "demo-m4",
      nameBn: "মোঃ জহিরুল ইসলাম",
      nameEn: "Md. Jahirul Islam",
      bloodGroup: "AB+",
      presentAddress: "বীরখাল মধ্যপাড়া, চান্দিনা",
      permanentAddress: "বীরখাল, চান্দিনা",
      mobileNumber: "",
      status: "approved",
      photoUrl: "/up-4.jpeg"
    },
    {
      _id: "demo-m5",
      nameBn: "মোঃ সাইফুল ইসলাম",
      nameEn: "Md. Saiful Islam",
      bloodGroup: "O+",
      presentAddress: "বীরখাল দক্ষিণপাড়া, চান্দিনা",
      permanentAddress: "বীরখাল, চান্দিনা",
      mobileNumber: "",
      status: "approved",
      photoUrl: "/up-5.jpeg"
    },
    {
      _id: "demo-m6",
      nameBn: "মোঃ তানভীর আহমেদ",
      nameEn: "Md. Tanvir Ahmed",
      bloodGroup: "A-",
      presentAddress: "কাদুটি বাজার, চান্দিনা",
      permanentAddress: "কাদুটি, চান্দিনা",
      mobileNumber: "",
      status: "approved",
      photoUrl: "/up-6.jpeg"
    },
    {
      _id: "demo-m7",
      nameBn: "মো: জাহিদুল ইসলাম",
      nameEn: "Md. Zahidul Islam",
      bloodGroup: "B+",
      presentAddress: "বীরখাল পশ্চিমপাড়া, চান্দিনা",
      permanentAddress: "বীরখাল, চান্দিনা",
      mobileNumber: "01800000000",
      status: "approved",
      photoUrl: "/up-7.jpeg"
    },
    {
      _id: "demo-m8",
      nameBn: "মোঃ রাশেদুল হক",
      nameEn: "Md. Rashedul Haque",
      bloodGroup: "O-",
      presentAddress: "বীরখাল, চান্দিনা, কুমিল্লা",
      permanentAddress: "বীরখাল, চান্দিনা",
      mobileNumber: "01700000000",
      status: "approved",
      photoUrl: "/up-8.jpeg"
    }
  ];

  const filteredMembers = displayMembers.filter((m) => {
    const nameMatch = 
      (m.nameEn && m.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.nameBn && m.nameBn.includes(searchTerm)) ||
      (m.presentAddress && m.presentAddress.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const bloodMatch = bloodFilter === "all" || m.bloodGroup === bloodFilter;

    return nameMatch && bloodMatch;
  });

  return (
    <section className="relative w-full py-16 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-reliability-blue/10 text-reliability-blue font-bold text-xs mb-3 border border-reliability-blue/20 rounded-xl">
            <Users className="w-3.5 h-3.5" />
            {language === "bn" ? "নিবন্ধিত সাধারণ সদস্যবৃন্দ" : "Registered General Members"}
          </div>
          <h2 className="font-headline-xl text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            {membersHeading}
          </h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mt-2 text-base">
            {membersDesc}
          </p>
        </div>

        <Link
          href="/registration"
          className="bg-growth-green hover:bg-[#236026] text-white px-6 py-3 font-bold text-sm shadow-md transition-all flex items-center gap-2 self-start md:self-auto hover:-translate-y-0.5 shrink-0 rounded-xl"
        >
          <span>{language === "bn" ? "নতুন সদস্য নিবন্ধন" : "Register as Member"}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Search and Blood Filter Bar */}
      <div className="bg-surface-container-lowest dark:bg-surface-container-low p-4 border border-border flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 shadow-sm rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === "bn" ? "সদস্যের নাম বা এলাকা দিয়ে খুঁজুন..." : "Search member by name or village..."}
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface dark:bg-background border border-border focus:outline-none focus:border-growth-green text-foreground rounded-lg"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-bold shrink-0">
            <Droplet className="w-3.5 h-3.5 text-red-500" />
            <span>{language === "bn" ? "রক্তের গ্রুপ:" : "Blood Group:"}</span>
          </div>
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="text-xs bg-surface dark:bg-background border border-border px-3 py-2 text-foreground font-bold focus:outline-none w-full sm:w-auto cursor-pointer rounded-lg"
          >
            <option value="all">{language === "bn" ? "সকল গ্রুপ (All)" : "All Blood Groups"}</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
      </div>

      {/* Members Grid Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMembers.slice(0, visibleCount).map((member, idx) => {
          const displayName = language === "bn" 
            ? (member.nameBn || member.nameEn || "সদস্য") 
            : (member.nameEn || translateBanglaName(member.nameBn || "", "en"));
          const secondaryName = language === "bn" 
            ? member.nameEn 
            : member.nameBn;
          const designation = language === "bn" ? "সাধারণ সদস্য" : "General Member";
          const rawAddress = member.presentAddress || member.permanentAddress || (language === "bn" ? "বীরখাল, চান্দিনা, কুমিল্লা" : "Birkhal, Chandina, Cumilla");
          const address = translateBanglaAddress(rawAddress, language);

          return (
            <div
              key={member._id || idx}
              className="bg-surface-container-lowest dark:bg-surface-container-low border border-border hover:border-growth-green/50 p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden rounded-xl"
            >
              <div>
                {/* Photo & Blood Group Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-growth-green/30 bg-surface-variant dark:bg-surface shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={displayName}
                        className="w-full h-full object-cover object-top rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-variant text-foreground font-bold text-lg rounded-xl">
                        {displayName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {member.bloodGroup && (
                    <div className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-800/40 flex items-center gap-1 shadow-xs rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      <span>{member.bloodGroup}</span>
                    </div>
                  )}
                </div>

                {/* Name & Designation */}
                <div className="space-y-1 mb-3">
                  <h3 className="font-headline-md text-base font-bold text-foreground group-hover:text-growth-green transition-colors truncate" title={displayName}>
                    {displayName}
                  </h3>
                  {secondaryName && (
                    <p className="text-xs text-on-surface-variant truncate opacity-80">{secondaryName}</p>
                  )}
                  <div className="inline-block mt-1 px-2 py-0.5 bg-growth-green/10 text-growth-green text-[11px] font-bold border border-growth-green/20 rounded-md">
                    {designation}
                  </div>
                </div>
              </div>

              {/* Address & Contact info */}
              <div className="pt-3 border-t border-border space-y-1.5 text-xs text-on-surface-variant mt-2">
                <div className="flex items-start gap-1.5 leading-snug">
                  <MapPin className="w-3.5 h-3.5 text-growth-green shrink-0 mt-0.5" />
                  <span className="line-clamp-2 text-[11px]">{address}</span>
                </div>
                {/* {member.mobileNumber && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground opacity-90">
                    <Phone className="w-3 h-3 text-growth-green" />
                    <span>{member.mobileNumber}</span>
                  </div>
                )} */}
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="py-16 text-center text-on-surface-variant bg-surface-container-lowest dark:bg-surface-container-low border border-dashed border-border rounded-xl">
          <p className="text-sm">{language === "bn" ? "কোনো সদস্য পাওয়া যায়নি।" : "No members found matching your search."}</p>
        </div>
      )}

      {/* View More / View All Members Button */}
      <div className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
        {filteredMembers.length > visibleCount && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="px-6 py-2.5 bg-surface-variant dark:bg-surface text-foreground font-bold text-xs border border-border hover:bg-surface-variant/80 transition-all cursor-pointer shadow-xs rounded-xl"
          >
            {language === "bn" ? "আরও সদস্য দেখুন (+৮)" : "Show More Members (+8)"}
          </button>
        )}
        <Link
          href="/members"
          className="px-6 py-2.5 bg-growth-green hover:bg-[#236026] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer rounded-xl"
        >
          <span>{language === "bn" ? "সকল নিবন্ধিত সদস্যের পূর্ণ তালিকা দেখুন →" : "View All Members Directory →"}</span>
        </Link>
      </div>
    </section>
  );
}
