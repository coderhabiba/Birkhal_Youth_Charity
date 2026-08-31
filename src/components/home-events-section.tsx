"use client";

import { useLanguage } from "@/components/language-provider";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  HeartHandshake, 
  ArrowRight, 
  Radio, 
  Phone, 
  CheckCircle2,
  Users,
  Megaphone
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export interface IHomeEvent {
  _id: string;
  title: string;
  date: string | Date;
  location: string;
  description: string;
  type: 'fundraiser' | 'workshop' | 'campaign' | 'meeting' | string;
  status: 'upcoming' | 'ongoing' | 'completed' | string;
  image?: string;
  contactPhone?: string;
}

export function HomeEventsSection({ 
  events = [],
  settings = {} 
}: { 
  events: IHomeEvent[];
  settings?: Record<string, string>;
}) {
  const { language } = useLanguage();

  // Filter only upcoming and ongoing events
  const activeEvents = events.filter(
    (e) => e.status === "upcoming" || e.status === "ongoing"
  );

  if (activeEvents.length === 0) {
    return null; // Gracefully hide when no active events are scheduled
  }

  const getTypeLabel = (type: string) => {
    if (language === "bn") {
      switch (type) {
        case "campaign":
          return "সামাজিক ক্যাম্পেইন";
        case "fundraiser":
          return "ত্রাণ ও তহবিল সংগ্রহ";
        case "workshop":
          return "প্রশিক্ষণ ও কর্মশালা";
        case "meeting":
          return "সাধারণ সভা";
        default:
          return "সমাজসেবামূলক কর্মসূচি";
      }
    }
    switch (type) {
      case "campaign":
        return "Social Campaign";
      case "fundraiser":
        return "Fundraiser";
      case "workshop":
        return "Workshop";
      case "meeting":
        return "Community Meeting";
      default:
        return "Charity Event";
    }
  };

  return (
    <section className="space-y-8 py-4 relative z-10">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-growth-green/10 text-growth-green text-xs font-bold rounded-full border border-growth-green/20">
            <Radio className="w-3.5 h-3.5 text-growth-green animate-pulse" />
            <span>{language === "bn" ? "আসন্ন ও চলমান কর্মসূচি" : "Upcoming & Live Events"}</span>
          </div>

          <h2 className="font-headline-xl text-2xl sm:text-4xl text-foreground font-bold tracking-tight">
            {language === "bn" 
              ? "আমাদের সমাজকল্যাণমূলক ইভেন্ট ও কার্যক্রম" 
              : "Active & Upcoming Community Events"}
          </h2>

          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {language === "bn"
              ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের পক্ষ থেকে পরিচালিত চলমান ও আসন্ন মানবিক সহায়তা, সচেতনতামূলক ক্যাম্পেইন ও সামাজিক কর্মসূচি।"
              : "Participate or support our ongoing and upcoming humanitarian drives and welfare campaigns."}
          </p>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-growth-green hover:underline shrink-0 group self-start md:self-auto"
        >
          <span>{language === "bn" ? "সকল ইভেন্ট ক্যালেন্ডার দেখুন" : "View All Events"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Active Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeEvents.map((event) => {
          const isOngoing = event.status === "ongoing";
          const eventDate = new Date(event.date);
          const formattedDate = !isNaN(eventDate.getTime()) 
            ? format(eventDate, "dd MMMM yyyy") 
            : String(event.date);
          const dayNum = !isNaN(eventDate.getTime()) ? format(eventDate, "dd") : "01";
          const monthName = !isNaN(eventDate.getTime()) ? format(eventDate, "MMM") : "Event";

          return (
            <div
              key={event._id}
              className={`bg-surface-container-lowest dark:bg-surface-container-low border ${
                isOngoing 
                  ? "border-growth-green shadow-md ring-1 ring-growth-green/20" 
                  : "border-border hover:border-growth-green/50"
              } rounded-2xl p-6 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden`}
            >
              {/* Ongoing glowing top indicator */}
              {isOngoing && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-growth-green via-emerald-400 to-growth-green animate-pulse"></div>
              )}

              <div>
                {/* Header with Badges */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  {/* Status Badge */}
                  {isOngoing ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/15 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                      <span>{language === "bn" ? "🟢 চলমান কার্যক্রম" : "Live / Ongoing"}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/15 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{language === "bn" ? "📅 আসন্ন ইভেন্ট" : "Upcoming Event"}</span>
                    </span>
                  )}

                  {/* Type Badge */}
                  <span className="text-[11px] font-bold text-on-surface-variant bg-surface-variant/70 dark:bg-white/5 px-2.5 py-1 rounded-md border border-border">
                    {getTypeLabel(event.type)}
                  </span>
                </div>

                {/* Date Banner Box & Title */}
                <div className="flex gap-4 items-start mb-3">
                  <div className="shrink-0 w-14 h-14 bg-growth-green/10 dark:bg-growth-green/20 border border-growth-green/30 rounded-xl flex flex-col items-center justify-center text-growth-green shadow-xs">
                    <span className="text-lg font-black leading-none">{dayNum}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{monthName}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline-md text-base sm:text-lg font-bold text-foreground group-hover:text-growth-green transition-colors leading-snug line-clamp-2">
                      {event.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-4">
                  {event.description}
                </p>

                {/* Meta details: Location & Date */}
                <div className="space-y-2 py-3 border-t border-border text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-growth-green shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-impact-orange shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  {event.contactPhone && (
                    <div className="flex items-center gap-2 text-foreground font-bold">
                      <Phone className="w-3.5 h-3.5 text-growth-green shrink-0" />
                      <a href={`tel:${event.contactPhone}`} className="hover:underline">
                        {event.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border flex items-center gap-3 mt-2">
                <Link
                  href="/contact"
                  className="flex-1 text-center py-2.5 px-3 bg-surface-variant/80 dark:bg-white/10 hover:bg-growth-green hover:text-white text-foreground text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {language === "bn" ? "অংশগ্রহণ / যোগাযোগ" : "Join / Contact"}
                </Link>
                <Link
                  href="/donations"
                  className="flex-1 text-center py-2.5 px-3 bg-growth-green hover:bg-[#236026] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {language === "bn" ? "সহায়তা করুন" : "Support"}
                </Link>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
