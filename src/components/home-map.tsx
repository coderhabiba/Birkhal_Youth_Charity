"use client";

import { useLanguage } from "@/components/language-provider";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink, 
  Navigation, 
  Compass,
  CheckCircle2
} from "lucide-react";

export function HomeMap({ settings = {} }: { settings?: Record<string, string> }) {
  const { language } = useLanguage();

  const address = (language === "bn" ? settings["contact_address_bn"] : settings["contact_address_en"]) || (
    language === "bn" 
      ? (settings["contact_address"] || "বীরখাল, কাদুটি বাজার, চান্দিনা, কুমিল্লা") 
      : "Birkhal, Kaduti Bazar, Chandina, Cumilla"
  );

  const phone = settings["contact_phone"] || "01882447721 / 01609296990";
  const email = settings["contact_email"] || "birkhal.youth.org@gmail.com";
  const officeHours = (language === "bn" ? settings["contact_office_hours_bn"] : settings["contact_office_hours_en"]) || (
    language === "bn" ? "শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - সন্ধ্যা ৬:০০" : "Saturday - Thursday: 9:00 AM - 6:00 PM"
  );

  // Google Maps embed URL for Kaduti Bazar / Chandina / Birkhal area, Cumilla
  const googleMapUrl = "https://www.google.com/maps?q=Kaduti+Bazar,+Chandina,+Cumilla,+Bangladesh&output=embed";
  const googleMapsDirectionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Kaduti+Bazar,+Chandina,+Cumilla,+Bangladesh";

  return (
    <section className="relative w-full py-16 border-t border-border">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-reliability-blue/10 text-reliability-blue font-bold text-xs mb-3 border border-reliability-blue/20 rounded-xl">
            <Compass className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "ভৌগোলিক অবস্থান ও লাইভ ম্যাপ" : "Location & Live Map"}</span>
          </div>
          <h2 className="font-headline-xl text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            {language === "bn" ? "আমাদের কার্যালয় ও অবস্থান" : "Our Location & Office"}
          </h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mt-2 text-base">
            {language === "bn"
              ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের প্রধান কার্যালয়ের অবস্থান ও সরাসরি যোগাযোগ সংক্রান্ত তথ্য।"
              : "Locate our central office in Cumilla on the interactive live map and find direct navigation routes."}
          </p>
        </div>

        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-growth-green hover:bg-[#236026] text-white px-5 py-2.5 font-bold text-xs shadow-sm transition-all flex items-center gap-2 self-start md:self-auto shrink-0 cursor-pointer rounded-xl"
        >
          <Navigation className="w-4 h-4" />
          <span>{language === "bn" ? "গুগল ম্যাপে দিকনির্দেশনা (Directions)" : "Get Directions on Google Maps"}</span>
        </a>
      </div>

      {/* Map + Location Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Live Interactive Map Box */}
        <div className="lg:col-span-8 bg-surface-container-low dark:bg-surface-container-lowest border border-border overflow-hidden shadow-md relative min-h-[380px] lg:min-h-[460px] rounded-xl">
          

          <iframe
            title="Birkhal Youth Location Map"
            src={googleMapUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "380px", height: "100%" }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[15%] contrast-[105%] hover:grayscale-0 transition-all duration-300 rounded-xl"
          ></iframe>
        </div>

        {/* Office Details Card */}
        <div className="lg:col-span-4 bg-surface-container-lowest dark:bg-surface-container-low border border-border p-6 md:p-8 shadow-md flex flex-col justify-between space-y-6 rounded-xl">
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="font-headline-md text-xl font-bold text-growth-green mb-1">
                {language === "bn" ? "বীরখাল যুব সংগঠন কার্যালয়" : "Birkhal Youth HQ"}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {language === "bn" ? "কেন্দ্রীয় কার্যালয় ও সেবা কেন্দ্র" : "Central Office & Community Center"}
              </p>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-growth-green/10 flex items-center justify-center shrink-0 text-growth-green border border-growth-green/20 rounded-lg">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider mb-1">
                  {language === "bn" ? "ঠিকানা" : "Address"}
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {address}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-growth-green/10 flex items-center justify-center shrink-0 text-growth-green border border-growth-green/20 rounded-lg">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider mb-1">
                  {language === "bn" ? "হটলাইন / মোবাইল" : "Helpline & Mobile"}
                </h4>
                <p className="text-xs font-bold text-foreground">
                  {phone}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-growth-green/10 flex items-center justify-center shrink-0 text-growth-green border border-growth-green/20 rounded-lg">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider mb-1">
                  {language === "bn" ? "ইমেইল" : "Email"}
                </h4>
                <a href={`mailto:${email}`} className="text-xs text-reliability-blue hover:underline break-all">
                  {email}
                </a>
              </div>
            </div>

            {/* Office Hours */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-growth-green/10 flex items-center justify-center shrink-0 text-growth-green border border-growth-green/20 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider mb-1">
                  {language === "bn" ? "অফিস সময়সূচী" : "Office Hours"}
                </h4>
                <p className="text-xs text-on-surface-variant">
                  {officeHours}
                </p>
              </div>
            </div>
          </div>

          {/* Card Action Link */}
          <div className="pt-4 border-t border-border">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-surface-variant dark:bg-surface hover:bg-growth-green hover:text-white text-foreground font-bold text-xs border border-border flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-xl"
            >
              <span>{language === "bn" ? "ম্যাপে রুট ও দিকনির্দেশনা দেখুন" : "View Live Route on Map"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
