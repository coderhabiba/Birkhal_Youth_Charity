"use client";

import { useLanguage } from "@/components/language-provider";
import { Users, Droplet, User as UserIcon, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { translateBanglaName, translateBanglaAddress } from "@/lib/bengali-transliteration";

export function MembersClient({ members }: { members: any[] }) {
  const { language } = useLanguage();

  return (
    <div className="flex-grow w-full max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-10 space-y-20">
      
      {/* Header Banner Section */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-off-white to-surface-variant/30 dark:from-surface-container-low dark:to-surface-container-highest shadow-sm border border-border p-8 md:p-12 text-center md:text-left">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface-container-lowest/80 backdrop-blur-md border border-border shadow-xs w-fit text-xs font-bold text-growth-green rounded-xl">
            <Users className="w-4 h-4 text-growth-green" />
            <span>{language === "bn" ? "নিবন্ধিত সম্মানিত সদস্য তালিকা" : "Verified General Members Directory"}</span>
          </div>
          <h1 className="font-headline-xl text-3xl md:text-5xl text-foreground font-bold tracking-tight">
            {language === "bn" ? "আমাদের সম্মানিত সদস্যবৃন্দ" : "Our Honored Members"}
          </h1>
          <p className="font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed">
            {language === "bn" 
              ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের গর্বিত ও নিবেদিতপ্রাণ সাধারণ সদস্যদের বিস্তারিত তালিকা।" 
              : "The roster of verified and dedicated members powering our youth organization."}
          </p>
        </div>
      </section>

      {/* Members Table Card */}
      <section className="bg-surface-container-lowest dark:bg-surface-container-low shadow-sm border border-border overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low dark:bg-surface-container border-b border-border">
                <th className="p-4 sm:p-5 font-bold text-xs text-foreground uppercase tracking-wider">
                  {language === "bn" ? "সদস্যের নাম ও ছবি" : "Member Name & Photo"}
                </th>
                <th className="p-4 sm:p-5 font-bold text-xs text-foreground uppercase tracking-wider">
                  {language === "bn" ? "পিতার নাম" : "Father's Name"}
                </th>
                <th className="p-4 sm:p-5 font-bold text-xs text-foreground uppercase tracking-wider">
                  {language === "bn" ? "রক্তের গ্রুপ" : "Blood Group"}
                </th>
                <th className="p-4 sm:p-5 font-bold text-xs text-foreground uppercase tracking-wider text-right">
                  {language === "bn" ? "ঠিকানা" : "Address"}
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id.toString()} className="border-b border-border hover:bg-surface-variant/30 transition-colors group">
                  <td className="p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      {member.photoUrl ? (
                        <div className="w-12 h-12 overflow-hidden shrink-0 border-2 border-border group-hover:border-growth-green transition-colors rounded-xl">
                          <img src={member.photoUrl} alt={member.nameEn} className="w-full h-full object-cover object-top" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-growth-green/10 flex items-center justify-center shrink-0 border-2 border-transparent group-hover:border-growth-green transition-colors text-growth-green font-bold rounded-xl">
                          <UserIcon className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-foreground text-base">
                          {language === "bn" 
                            ? (member.nameBn || member.nameEn) 
                            : (member.nameEn || translateBanglaName(member.nameBn || "", "en"))}
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                          {language === "bn" ? member.nameEn : member.nameBn}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 font-body-md text-xs md:text-sm text-foreground">
                    {language === "bn" 
                      ? (member.fatherHusbandName || member.fatherName || "-")
                      : (translateBanglaName(member.fatherHusbandName || member.fatherName || "", "en") || "-")}
                  </td>
                  <td className="p-4 sm:p-5">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold text-xs border border-red-200 dark:border-red-800 rounded-md">
                      <Droplet className="w-3 h-3 fill-current" />
                      {member.bloodGroup || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 font-body-md text-xs md:text-sm text-on-surface-variant text-right">
                    {translateBanglaAddress(member.presentAddress || member.permanentAddress || (language === "bn" ? "বীরখাল, চান্দিনা, কুমিল্লা" : "Birkhal, Chandina, Cumilla"), language)}
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-on-surface-variant">
                    {language === "bn" ? "এখনও কোনো অনুমোদিত সদস্য নেই।" : "No approved members found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Unified Footer */}
      <Footer />
    </div>
  );
}
