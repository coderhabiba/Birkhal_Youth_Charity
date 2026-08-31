"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { MapPin, Mail, Phone, Send, Clock, AlertCircle, PhoneCall, Sparkles, Navigation, CheckCircle2, Headphones } from "lucide-react";
import { Footer } from "@/components/footer";
import { HomeMap } from "@/components/home-map";

export function ContactClient({ settings = {} }: { settings?: Record<string, string> }) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const pageTitle = (language === "bn" ? settings["contact_hero_title_bn"] : settings["contact_hero_title_en"]) || (
    language === "bn" ? "যোগাযোগ ও সহায়তা কেন্দ্র" : "Get in Touch & Help Center"
  );

  const pageDesc = (language === "bn" ? settings["contact_hero_desc_bn"] : settings["contact_hero_desc_en"]) || (
    language === "bn"
      ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের কার্যক্রম সম্পর্কে যেকোনো তথ্য, অনুদান বিষয়ক পরামর্শ অথবা মানবিক সহায়তার জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।"
      : "We are here to answer any questions you may have about our youth initiatives and community programs. Reach out to us anytime."
  );

  const contactAddress = (language === "bn" ? settings["contact_address_bn"] : settings["contact_address_en"]) || (
    language === "bn" 
      ? (settings["contact_address"] || "বীরখাল, কাদুটি বাজার, চান্দিনা, কুমিল্লা") 
      : "Birkhal, Kaduti Bazar, Chandina, Cumilla"
  );

  const contactEmail = settings["contact_email"] || "birkhal.youth.org@gmail.com";
  const contactPhone = settings["contact_phone"] || "01882447721 / 01609296990";
  const officeHours = (language === "bn" ? settings["contact_office_hours_bn"] : settings["contact_office_hours_en"]) || (
    language === "bn" ? "শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - সন্ধ্যা ৬:০০" : "Saturday - Thursday: 9:00 AM - 6:00 PM"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow w-full max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-10 space-y-20">
      
      {/* Header Section with Glassmorphism Card (Exact same design as Home Hero) */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-off-white to-surface-variant/30 dark:from-surface-container-low dark:to-surface-container-highest shadow-sm border border-border">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-growth-green/10 blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-reliability-blue/10 blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

        <div className="p-8 md:p-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface-container-lowest/80 backdrop-blur-md border border-border shadow-xs w-fit text-xs font-bold text-growth-green rounded-xl">
            <PhoneCall className="w-4 h-4 text-growth-green" />
            <span>{language === "bn" ? "সরাসরি সহায়তা ও তথ্য কেন্দ্র" : "Direct Support & Information Center"}</span>
          </div>
          
          <h1 className="font-headline-xl text-3xl md:text-5xl text-foreground font-bold tracking-tight leading-tight">
            {pageTitle}
          </h1>
          
          <p className="font-body-lg text-base md:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
            {pageDesc}
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-surface-container-lowest dark:bg-surface-container-low p-8 md:p-10 shadow-sm border border-border flex flex-col justify-between space-y-6 rounded-xl">
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="font-headline-md text-2xl text-growth-green font-bold mb-1">
                {language === "bn" ? "যোগাযোগের ঠিকানা" : "Contact Details"}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {language === "bn" ? "বীরখাল সমাজ কল্যাণ যুব সংগঠন কার্যালয়" : "Birkhal Youth Central Office"}
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-growth-green/10 flex items-center justify-center shrink-0 text-growth-green border border-growth-green/20 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-label-md text-xs text-on-surface-variant font-bold mb-0.5 uppercase tracking-wider">
                  {language === "bn" ? "ঠিকানা" : "Address"}
                </p>
                <p className="font-body-md text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {contactAddress}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-growth-green/10 flex items-center justify-center shrink-0 text-growth-green border border-growth-green/20 rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-label-md text-xs text-on-surface-variant font-bold mb-0.5 uppercase tracking-wider">
                  {language === "bn" ? "ইমেইল" : "Email"}
                </p>
                <a href={`mailto:${contactEmail}`} className="font-body-md text-sm text-reliability-blue hover:underline break-all">
                  {contactEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-growth-green/10 flex items-center justify-center shrink-0 text-growth-green border border-growth-green/20 rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-label-md text-xs text-on-surface-variant font-bold mb-0.5 uppercase tracking-wider">
                  {language === "bn" ? "মোবাইল / হটলাইন" : "Mobile / Hotline"}
                </p>
                <p className="font-body-md text-sm font-bold text-foreground">
                  {contactPhone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-growth-green/10 flex items-center justify-center shrink-0 text-growth-green border border-growth-green/20 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-label-md text-xs text-on-surface-variant font-bold mb-0.5 uppercase tracking-wider">
                  {language === "bn" ? "অফিস সময়" : "Office Hours"}
                </p>
                <p className="font-body-md text-sm text-foreground">
                  {officeHours}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <a 
              href={`tel:${contactPhone}`} 
              className="p-4 bg-growth-green/10 hover:bg-growth-green/20 border border-growth-green/30 text-xs text-growth-green font-bold flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl transition-all group shadow-xs hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-growth-green text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                  <PhoneCall className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className="block text-foreground font-bold text-xs">
                    {language === "bn" ? "সরাসরি সহায়তা পেতে আমাদের হটলাইনে কল করুন।" : "Call our helpline for instant emergency aid."}
                  </span>
                  <span className="text-[11px] text-on-surface-variant font-medium">
                    {language === "bn" ? "জরুরি প্রয়োজনে সার্বক্ষণিক হটলাইন সেবা" : "24/7 Hotline support available"}
                  </span>
                </div>
              </div>
              <span className="bg-growth-green text-white px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs group-hover:bg-[#236026] transition-colors">
                <Headphones className="w-3.5 h-3.5" />
                <span>{contactPhone}</span>
              </span>
            </a>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="lg:col-span-7 bg-surface-container-lowest dark:bg-surface-container-low p-8 md:p-10 shadow-sm border border-border flex flex-col justify-between rounded-xl">
          <div>
            <div className="border-b border-border pb-4 mb-6">
              <h3 className="font-headline-md text-2xl text-foreground font-bold mb-1">
                {language === "bn" ? "আমাদের বার্তা পাঠান" : "Send us a Message"}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {language === "bn" ? "আপনার যে কোনো প্রশ্ন বা সহায়তার জন্য নিচের ফর্মটি পূরণ করুন" : "Fill out the form below and we'll reply as soon as possible"}
              </p>
            </div>
            
            {success && (
              <div className="bg-growth-green/10 text-growth-green p-4 mb-6 border border-growth-green/30 font-bold text-sm flex items-center gap-2 rounded-xl">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  {language === "bn" 
                    ? "আপনার মেসেজ সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।" 
                    : "Your message has been sent successfully! We will get back to you soon."}
                </span>
              </div>
            )}

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-600 p-4 mb-6 border border-red-200 text-sm font-bold flex items-center gap-2 rounded-xl">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="font-label-md text-xs text-foreground block font-bold">
                    {language === "bn" ? "আপনার নাম *" : "Your Name *"}
                  </label>
                  <input required type="text" id="name" name="name" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl" />
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="email" className="font-label-md text-xs text-foreground block font-bold">
                    {language === "bn" ? "ইমেইল *" : "Email Address *"}
                  </label>
                  <input required type="email" id="email" name="email" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl" />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="font-label-md text-xs text-foreground block font-bold">
                    {language === "bn" ? "মোবাইল নম্বর" : "Phone Number"}
                  </label>
                  <input type="tel" id="phone" name="phone" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl" />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="font-label-md text-xs text-foreground block font-bold">
                    {language === "bn" ? "বিষয় *" : "Subject *"}
                  </label>
                  <input required type="text" id="subject" name="subject" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="font-label-md text-xs text-foreground block font-bold">
                  {language === "bn" ? "মেসেজ *" : "Message *"}
                </label>
                <textarea required id="message" name="message" rows={5} className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto bg-growth-green hover:bg-[#236026] text-white font-bold text-sm px-8 py-3.5 flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-70 cursor-pointer rounded-xl"
              >
                <Send size={16} />
                {loading ? (language === "bn" ? "পাঠানো হচ্ছে..." : "Sending...") : (language === "bn" ? "মেসেজ পাঠান" : "Send Message")}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Live Interactive Location Map */}
      <HomeMap settings={settings} />

      {/* Reusable Unified Footer */}
      <Footer settings={settings} />
    </div>
  );
}
