"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { 
  ChevronDown, 
  ArrowRight, 
  HeartHandshake, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Image as ImageIcon,
  MapPin,
  Calendar,
  Share2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ISection {
  id: string;
  type: "hero" | "text_block" | "cards_grid" | "image_gallery" | "faq_accordion" | "cta_box";
  titleBn?: string;
  titleEn?: string;
  contentBn?: string;
  contentEn?: string;
  bannerImage?: string;
  buttonTextBn?: string;
  buttonTextEn?: string;
  buttonUrl?: string;
  items?: Array<{
    titleBn?: string;
    titleEn?: string;
    descBn?: string;
    descEn?: string;
    image?: string;
    link?: string;
  }>;
}

interface ICustomPageData {
  titleBn: string;
  titleEn: string;
  slug: string;
  subtitleBn?: string;
  subtitleEn?: string;
  bannerImage?: string;
  sections: ISection[];
}

export function CustomPageClient({ page }: { page: ICustomPageData }) {
  const { language } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const pageTitle = language === "bn" ? page.titleBn : page.titleEn;
  const pageSubtitle = language === "bn" ? page.subtitleBn : page.subtitleEn;

  return (
    <div className="flex-grow w-full max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10 space-y-16 animate-fade-in">
      
      {/* ========================================================================= */}
      {/* HERO BANNER SECTION                                                       */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-off-white to-surface-variant/30 dark:from-surface-container-low dark:to-surface-container-highest border border-border p-8 sm:p-12 md:p-16 shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-growth-green/10 blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-growth-green/10 text-growth-green font-bold text-xs rounded-lg border border-growth-green/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "বীরখাল যুব সংগঠন উদ্যোগ" : "Birkhal Youth Initiative"}</span>
          </div>

          <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            {pageTitle}
          </h1>

          {pageSubtitle && (
            <p className="font-body-lg text-base sm:text-lg text-on-surface-variant leading-relaxed">
              {pageSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DYNAMIC SECTIONS LOOP                                                     */}
      {/* ========================================================================= */}
      <div className="space-y-16">
        {page.sections.map((section, sIdx) => {
          const sTitle = language === "bn" ? section.titleBn : section.titleEn;
          const sContent = language === "bn" ? section.contentBn : section.contentEn;

          // -------------------------------------------------------------
          // TYPE 1: TEXT & STORY BLOCK
          // -------------------------------------------------------------
          if (section.type === "text_block") {
            return (
              <section key={section.id || sIdx} className="bg-surface-container-lowest dark:bg-surface-container-low p-8 sm:p-10 rounded-xl border border-border shadow-xs space-y-4">
                {sTitle && (
                  <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-foreground">
                    {sTitle}
                  </h2>
                )}
                {sContent && (
                  <div className="prose dark:prose-invert max-w-none text-sm sm:text-base text-on-surface-variant leading-relaxed whitespace-pre-line">
                    {sContent}
                  </div>
                )}
              </section>
            );
          }

          // -------------------------------------------------------------
          // TYPE 2: CARDS & FEATURES GRID
          // -------------------------------------------------------------
          if (section.type === "cards_grid") {
            return (
              <section key={section.id || sIdx} className="space-y-8">
                {sTitle && (
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-foreground">
                      {sTitle}
                    </h2>
                    {sContent && (
                      <p className="text-xs sm:text-sm text-on-surface-variant">
                        {sContent}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(section.items || []).map((item, itemIdx) => (
                    <div 
                      key={itemIdx}
                      className="bg-surface-container-lowest dark:bg-surface-container-low p-6 sm:p-7 rounded-xl border border-border shadow-xs hover:shadow-md hover:border-growth-green/40 transition-all space-y-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-growth-green/10 text-growth-green flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground">
                        {language === "bn" ? item.titleBn : item.titleEn}
                      </h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        {language === "bn" ? item.descBn : item.descEn}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          // -------------------------------------------------------------
          // TYPE 3: FAQ ACCORDION
          // -------------------------------------------------------------
          if (section.type === "faq_accordion") {
            return (
              <section key={section.id || sIdx} className="bg-surface-container-lowest dark:bg-surface-container-low p-8 sm:p-10 rounded-xl border border-border shadow-xs space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-xs font-bold">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{language === "bn" ? "প্রয়োজনীয় প্রশ্নোত্তর" : "FAQ & Inquiries"}</span>
                  </div>
                  {sTitle && (
                    <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-foreground">
                      {sTitle}
                    </h2>
                  )}
                  {sContent && (
                    <p className="text-xs sm:text-sm text-on-surface-variant">
                      {sContent}
                    </p>
                  )}
                </div>

                <div className="divide-y divide-border border-t border-border">
                  {(section.items || []).map((faq, fIdx) => {
                    const isOpen = openFaqIndex === fIdx;
                    return (
                      <div key={fIdx} className="py-4">
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                          className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-foreground hover:text-growth-green transition-colors cursor-pointer"
                        >
                          <span>{language === "bn" ? faq.titleBn : faq.titleEn}</span>
                          <ChevronDown className={`w-5 h-5 text-on-surface-variant transition-transform duration-200 ${isOpen ? "rotate-180 text-growth-green" : ""}`} />
                        </button>
                        {isOpen && (
                          <p className="mt-2.5 text-xs sm:text-sm text-on-surface-variant leading-relaxed animate-fade-in pl-2 border-l-2 border-growth-green">
                            {language === "bn" ? faq.descBn : faq.descEn}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          }

          // -------------------------------------------------------------
          // TYPE 4: CALL TO ACTION BOX
          // -------------------------------------------------------------
          if (section.type === "cta_box") {
            const btnText = language === "bn" ? section.buttonTextBn : section.buttonTextEn;
            const btnUrl = section.buttonUrl || "/donations";

            return (
              <section 
                key={section.id || sIdx}
                className="bg-gradient-to-r from-growth-green to-[#0f5424] text-white p-8 sm:p-12 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="space-y-2 text-center md:text-left">
                  <h2 className="font-headline-lg text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {sTitle || (language === "bn" ? "আমাদের কার্যক্রমে সহযোগিতা করুন" : "Support Our Cause")}
                  </h2>
                  <p className="text-xs sm:text-sm opacity-90 max-w-xl leading-relaxed">
                    {sContent || (language === "bn" ? "আপনার সামান্য দান অথবা সক্রিয় অংশগ্রহণ বীরখাল গ্রামের মানুষের মুখে হাসি ফোটাতে পারে।" : "Your valuable donation or active volunteer participation empowers our whole community.")}
                  </p>
                </div>

                <Link
                  href={btnUrl}
                  className="bg-white hover:bg-zinc-100 text-growth-green px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 shrink-0 transition-all hover:scale-105"
                >
                  <span>{btnText || (language === "bn" ? "অনুদানের তালিকা" : "Donate Now")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </section>
            );
          }

          return null;
        })}
      </div>

    </div>
  );
}
