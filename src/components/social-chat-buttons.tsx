"use client";

import { useLanguage } from "@/components/language-provider";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function SocialChatButtons({ settings = {} }: { settings?: Record<string, string> }) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [hovered, setHovered] = useState<"whatsapp" | "messenger" | null>(null);

  // Hide on dashboard routes or if disabled by admin
  if (pathname?.startsWith("/dashboard") || settings["floating_chat_enabled"] === "false") {
    return null;
  }

  // Official contact channels from dynamic settings
  const rawPhone = settings["social_whatsapp_number"] || settings["contact_phone"] || "01882447721";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  const whatsappNumber = cleanPhone.startsWith("88") ? cleanPhone : `88${cleanPhone}`;

  const whatsappMessage = encodeURIComponent(
    language === "bn"
      ? "আসসালামু আলাইকুম, আমি বীরখাল সমাজ কল্যাণ যুব সংগঠন সম্পর্কে জানতে ও সহায়তা করতে চাই।"
      : "Assalamu Alaikum, I would like to know more about Birkhal Youth Social Welfare Organization."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  
  // Facebook Page / Messenger URL from settings
  const messengerUrl = settings["social_messenger_url"] || settings["social_facebook"] || "https://facebook.com";

  return (
    <aside aria-label="Quick Chat" className="fixed bottom-20 md:bottom-8 left-4 md:left-6 z-40 flex flex-col gap-3">
      {/* WhatsApp Floating Action */}
      <div className="relative flex items-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered("whatsapp")}
          onMouseLeave={() => setHovered(null)}
          className="w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-[#25D366]/60 flex items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
          title="WhatsApp Chat"
          aria-label="Chat on WhatsApp"
        >
          {/* Pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 blur-sm group-hover:opacity-60 animate-pulse -z-10"></span>
          
          {/* Custom SVG WhatsApp Icon */}
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>

        {/* Hover Tooltip */}
        <div className="hidden sm:block absolute left-14 bg-zinc-900/95 backdrop-blur-md text-white text-xs font-bold py-1.5 px-3 whitespace-nowrap shadow-xl rounded-lg border border-white/10 transition-opacity duration-200 pointer-events-none opacity-0 group-hover:opacity-100">
          {language === "bn" ? "হোয়াটসঅ্যাপে চ্যাট করুন" : "Chat on WhatsApp"}
        </div>
      </div>

      {/* Facebook Messenger Floating Action */}
      <div className="relative flex items-center">
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered("messenger")}
          onMouseLeave={() => setHovered(null)}
          className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer drop-shadow-xl"
          title="Facebook Messenger"
          aria-label="Chat on Facebook Messenger"
        >
          {/* Pulse ring */}
          <span className="absolute inset-1 rounded-full bg-[#0084FF] opacity-25 blur-sm group-hover:opacity-50 animate-pulse -z-10"></span>

          {/* Standalone Official Meta Messenger Logo */}
          <svg className="w-12 h-12" viewBox="0 0 36 36" fill="none">
            <path
              d="M18 3C9.716 3 3 9.218 3 16.889c0 4.373 2.18 8.268 5.586 10.817V33l5.11-2.803c1.366.379 2.808.58 4.304.58 8.284 0 15-6.218 15-13.888C33 9.218 26.284 3 18 3Z"
              fill="url(#meta-msg-gradient)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.788 21.694l-4.221-4.504-8.242 4.504 9.064-9.625 4.325 4.503 8.138-4.503-9.064 9.625z"
              fill="white"
            />
            <defs>
              <linearGradient id="meta-msg-gradient" x1="3" y1="3" x2="33" y2="33" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00B2FF" />
                <stop offset="0.55" stopColor="#006AFF" />
                <stop offset="1" stopColor="#A800FF" />
              </linearGradient>
            </defs>
          </svg>
        </a>

        {/* Hover Tooltip */}
        <div className="hidden sm:block absolute left-14 bg-zinc-900/95 backdrop-blur-md text-white text-xs font-bold py-1.5 px-3 whitespace-nowrap shadow-xl rounded-lg border border-white/10 transition-opacity duration-200 pointer-events-none opacity-0 group-hover:opacity-100">
          {language === "bn" ? "মেসেঞ্জারে চ্যাট করুন" : "Chat on Messenger"}
        </div>
      </div>
    </aside>
  );
}
