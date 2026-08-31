"use client";

import { useLanguage } from "@/components/language-provider";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MapPin, Mail, Phone, Heart, CheckCircle2, ShieldCheck } from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path></svg>
);
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);
const TiktokIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);

export function Footer({ settings = {} }: { settings?: Record<string, string> }) {
  const { language } = useLanguage();
  const [footerCustomPages, setFooterCustomPages] = useState<Array<{ slug: string; titleBn: string; titleEn: string }>>([]);

  useEffect(() => {
    fetch("/api/pages?published=true")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setFooterCustomPages(data.filter((p: any) => p.showInFooter));
      })
      .catch(() => {});
  }, []);

  const logoUrl = settings["logo_url"] || "/logo.png";
  const brandName = (language === "bn" ? settings["brand_name_bn"] : settings["brand_name_en"]) || (language === "bn" ? "বীরখাল সমাজ কল্যাণ যুব সংগঠন" : "Birkhal Youth Welfare Organization");

  const footerDesc = (language === "bn" ? settings["footer_desc_bn"] : settings["footer_desc_en"]) || (
    language === "bn" ? "একটি শক্তিশালী, সৎ, মানবিক ও স্বাবলম্বী সমাজ বিনির্মাণে বীরখাল যুবসমাজের নিরলস পথচলা।" : "Building a stronger, transparent, and empowered community together."
  )

  const contactEmail = settings["contact_email"] || "birkhal.youth.org@gmail.com";
  const contactPhone = settings["contact_phone"] || "01882447721 / 01609296990";
  
  const contactAddress = (language === "bn" ? settings["contact_address_bn"] : settings["contact_address_en"]) || (
    language === "bn" 
      ? (settings["contact_address"] || "বীরখাল, কাদুটি বাজার, চান্দিনা, কুমিল্লা")
      : "Birkhal, Kaduti Bazar, Chandina, Cumilla"
  );

  const copyrightText = (language === "bn" ? settings["footer_copyright_bn"] : settings["footer_copyright_en"]) || (
    language === "bn"
      ? `© ${new Date().getFullYear()} ${brandName}। সর্বস্বত্ব সংরক্ষিত।`
      : `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`
  );

  return (
    <footer className="mt-16 w-full bg-surface-container-lowest dark:bg-surface-container-low border border-border p-6 sm:p-8 md:p-10 rounded-xl shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 text-center md:text-left">
        
        {/* Brand Column (5 Cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-xs border border-border shrink-0">
              <Image 
                src={logoUrl} 
                alt="Logo" 
                fill
                className="object-contain p-0.5" 
                unoptimized={logoUrl.startsWith("data:")}
              />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg text-growth-green leading-tight">{brandName}</h4>
              <p className="text-[11px] text-on-surface-variant">চান্দিনা, কুমিল্লা | স্থাপিত: ২০১৫</p>
            </div>
          </div>
          
          <p className="text-xs sm:text-sm text-on-surface-variant opacity-90 max-w-sm mx-auto md:mx-0 leading-relaxed">
            {footerDesc}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 pt-1 text-xs font-bold text-growth-green">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === "bn" ? "১০০% স্বচ্ছ ও স্থানীয় কার্যক্রম" : "100% Transparent Local Charity"}</span>
          </div>
        </div>
        
        {/* Quick Links Column (3 Cols) */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">{language === "bn" ? "প্রয়োজনীয় লিংক" : "Quick Links"}</h4>
          <div className="flex flex-col gap-2 text-xs font-medium">
            <Link href="/" className="text-on-surface-variant hover:text-growth-green transition-colors">{language === "bn" ? "হোম পেজ" : "Home"}</Link>
            <Link href="/about" className="text-on-surface-variant hover:text-growth-green transition-colors">{language === "bn" ? "আমাদের পরিচিতি" : "About Us"}</Link>
            <Link href="/members" className="text-on-surface-variant hover:text-growth-green transition-colors">{language === "bn" ? "সকল সদস্যবৃন্দ" : "Members Directory"}</Link>
            <Link href="/donations" className="text-on-surface-variant hover:text-growth-green transition-colors">{language === "bn" ? "অনুদানের তালিকা" : "Donations Record"}</Link>
            <Link href="/registration" className="text-on-surface-variant hover:text-growth-green transition-colors">{language === "bn" ? "সদস্য ভর্তি ফরম" : "Join as Member"}</Link>

            {/* Custom dynamic pages created in dashboard with showInFooter */}
            {footerCustomPages.map(cp => (
              <Link key={cp.slug} href={`/p/${cp.slug}`} className="text-on-surface-variant hover:text-growth-green transition-colors">
                {language === "bn" ? cp.titleBn : cp.titleEn}
              </Link>
            ))}

            <Link href="/contact" className="text-on-surface-variant hover:text-growth-green transition-colors">{language === "bn" ? "যোগাযোগ ও ঠিকানা" : "Contact Office"}</Link>
          </div>
        </div>

        {/* Contact Details Column (4 Cols) */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">{language === "bn" ? "যোগাযোগ ও হটলাইন" : "Contact Information"}</h4>
          <div className="flex flex-col gap-2.5 text-xs font-medium text-left items-center md:items-start">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 shrink-0 text-growth-green mt-0.5" />
              <span className="text-on-surface-variant leading-relaxed">{contactAddress}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 shrink-0 text-growth-green" />
              <a href={`mailto:${contactEmail}`} className="text-growth-green hover:underline break-all">{contactEmail}</a>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 shrink-0 text-growth-green mt-0.5" />
              <span className="font-bold text-foreground">{contactPhone}</span>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="pt-2 flex items-center justify-center md:justify-start gap-2">
            <a href={settings["social_facebook"] || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface hover:bg-[#1877F2] text-on-surface-variant hover:text-white rounded-lg transition-all border border-border shadow-xs" title="Facebook">
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
            <a href={settings["social_youtube"] || "https://youtube.com"} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface hover:bg-[#FF0000] text-on-surface-variant hover:text-white rounded-lg transition-all border border-border shadow-xs" title="YouTube">
              <YoutubeIcon className="w-3.5 h-3.5" />
            </a>
            <a href={settings["social_instagram"] || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface hover:bg-[#E1306C] text-on-surface-variant hover:text-white rounded-lg transition-all border border-border shadow-xs" title="Instagram">
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a href={settings["social_x"] || "https://x.com"} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface hover:bg-black text-on-surface-variant hover:text-white rounded-lg transition-all border border-border shadow-xs" title="Twitter / X">
              <TwitterIcon className="w-3.5 h-3.5" />
            </a>
            <a href={settings["social_tiktok"] || "https://tiktok.com"} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface hover:bg-black text-on-surface-variant hover:text-white rounded-lg transition-all border border-border shadow-xs" title="TikTok">
              <TiktokIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
        <p>{copyrightText}</p>
        <p className="font-semibold text-growth-green flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{language === "bn" ? "স্বচ্ছতা, সততা ও মানবতার অঙ্গীকার" : "Transparent & Community Powered"}</span>
        </p>
      </div>
    </footer>
  );
}
