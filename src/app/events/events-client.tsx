"use client";

import { useLanguage } from "@/components/language-provider";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Search, 
  Radio, 
  ArrowRight, 
  Phone, 
  CheckCircle2, 
  Heart,
  CalendarCheck,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Footer } from "@/components/footer";

export function EventsPageClient({ 
  events, 
  settings = {} 
}: { 
  events: any[]; 
  settings?: Record<string, string>;
}) {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredEvents = events.filter((ev) => {
    const matchesSearch = 
      (ev.title && ev.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ev.location && ev.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ev.description && ev.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || ev.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
    <div className="flex-grow w-full max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-10 space-y-16">
      
      {/* Header Banner Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-off-white to-surface-variant/30 dark:from-surface-container-low dark:to-surface-container-highest shadow-sm border border-border p-8 md:p-14 text-center md:text-left">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface-container-lowest/80 backdrop-blur-md border border-border shadow-xs w-fit text-xs font-bold text-growth-green rounded-xl">
            <Radio className="w-4 h-4 text-growth-green animate-pulse" />
            <span>{language === "bn" ? "ইভেন্ট ও সামাজিক কার্যক্রম সূচি" : "Community Events & Activity Schedule"}</span>
          </div>

          <h1 className="font-headline-xl text-3xl md:text-5xl text-foreground font-bold tracking-tight">
            {language === "bn" ? "আমাদের সকল ইভেন্ট ও কর্মসূচি" : "Organization Events & Drives"}
          </h1>

          <p className="font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed">
            {language === "bn"
              ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের উদ্যোগে পরিচালিত চলমান, আসন্ন ও পূর্বের সফল সমাজসেবা ও উন্নয়নমূলক কর্মসূচির বিস্তারিত।"
              : "Explore our schedule of active welfare initiatives, upcoming charity drives, and past impact events."}
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest dark:bg-surface-container-low p-4 sm:p-6 border border-border rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === "bn" ? "ইভেন্টের নাম, স্থান বা বিষয় দিয়ে খুঁজুন..." : "Search events by title, location..."}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-surface dark:bg-background border border-border focus:outline-none focus:border-growth-green text-foreground rounded-xl"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-growth-green text-white shadow-xs"
                : "bg-surface-variant/60 dark:bg-white/5 text-on-surface-variant hover:text-foreground border border-border"
            }`}
          >
            {language === "bn" ? "সকল ইভেন্ট" : "All"} ({events.length})
          </button>
          <button
            onClick={() => setStatusFilter("ongoing")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "ongoing"
                ? "bg-green-600 text-white shadow-xs"
                : "bg-surface-variant/60 dark:bg-white/5 text-on-surface-variant hover:text-foreground border border-border"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>{language === "bn" ? "চলমান" : "Ongoing"}</span> ({events.filter(e => e.status === "ongoing").length})
          </button>
          <button
            onClick={() => setStatusFilter("upcoming")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              statusFilter === "upcoming"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-surface-variant/60 dark:bg-white/5 text-on-surface-variant hover:text-foreground border border-border"
            }`}
          >
            {language === "bn" ? "আসন্ন" : "Upcoming"} ({events.filter(e => e.status === "upcoming").length})
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              statusFilter === "completed"
                ? "bg-gray-700 text-white shadow-xs"
                : "bg-surface-variant/60 dark:bg-white/5 text-on-surface-variant hover:text-foreground border border-border"
            }`}
          >
            {language === "bn" ? "সম্পন্ন" : "Completed"} ({events.filter(e => e.status === "completed").length})
          </button>
        </div>

      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const isOngoing = event.status === "ongoing";
          const isUpcoming = event.status === "upcoming";
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
              {isOngoing && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-growth-green via-emerald-400 to-growth-green animate-pulse"></div>
              )}

              <div>
                {/* Status and Type Badges */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  {isOngoing ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/15 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                      <span>{language === "bn" ? "🟢 চলমান কার্যক্রম" : "Live / Ongoing"}</span>
                    </span>
                  ) : isUpcoming ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/15 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{language === "bn" ? "📅 আসন্ন ইভেন্ট" : "Upcoming"}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-500/15 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-full border border-gray-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === "bn" ? "✓ সম্পন্ন" : "Completed"}</span>
                    </span>
                  )}

                  <span className="text-[11px] font-bold text-on-surface-variant bg-surface-variant/70 dark:bg-white/5 px-2.5 py-1 rounded-md border border-border">
                    {getTypeLabel(event.type)}
                  </span>
                </div>

                {/* Event Image Banner if available */}
                {event.image && (
                  <div className="relative w-full aspect-video sm:h-44 rounded-xl overflow-hidden mb-4 border border-border/60 bg-black/5">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Date & Title */}
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

                {/* Meta Details */}
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

      {filteredEvents.length === 0 && (
        <div className="py-20 text-center text-on-surface-variant bg-surface-container-lowest dark:bg-surface-container-low border border-dashed border-border rounded-2xl">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-on-surface-variant/40" />
          <h3 className="font-bold text-lg text-foreground mb-1">
            {language === "bn" ? "কোনো ইভেন্ট পাওয়া যায়নি" : "No Events Found"}
          </h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            {language === "bn" 
              ? "এই মুহূর্তে নির্বাচিত ক্যাটাগরিতে কোনো ইভেন্ট নির্ধারিত নেই। শীঘ্রই নতুন সমাজকল্যাণমূলক কর্মসূচি আপডেট করা হবে।" 
              : "No events match your current filter. Please check back later for upcoming community updates."}
          </p>
        </div>
      )}

      {/* Unified Footer */}
      <Footer />
    </div>
  );
}
