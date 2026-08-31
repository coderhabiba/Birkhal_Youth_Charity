"use client";

import { useLanguage } from "@/components/language-provider";
import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquarePlus, 
  CheckCircle2, 
  Send,
  Loader2,
  X,
  SlidersHorizontal,
  Flame,
  MessageSquareHeart,
  HeartHandshake,
  ThumbsUp,
  Infinity,
  Upload
} from "lucide-react";

export function HomeReviewsSlider({ 
  initialReviews = [],
  settings = {}
}: { 
  initialReviews: any[];
  settings?: Record<string, string>;
}) {
  const { language } = useLanguage();
  const [reviews] = useState<any[]>(initialReviews || []);
  const [viewMode, setViewMode] = useState<"marquee" | "carousel">("marquee");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError(language === "bn" ? "ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে হবে" : "Image size must be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayReviews = useMemo(() => reviews || [], [reviews]);
  const total = displayReviews.length;

  // Dynamic Average Rating
  const avgRating = useMemo(() => {
    if (total === 0) return "5.0";
    const sum = displayReviews.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
    return (sum / total).toFixed(1);
  }, [displayReviews, total]);

  // Safe repetition for seamless infinite marquee loop
  const { marqueeTrack1, marqueeTrack2 } = useMemo(() => {
    if (total === 0) return { marqueeTrack1: [], marqueeTrack2: [] };

    const half = Math.ceil(total / 2);
    const row1 = displayReviews.slice(0, half);
    const row2 = displayReviews.slice(half).length > 0 ? displayReviews.slice(half) : row1;

    // Multiply arrays so they have at least 8 items for a continuous flowing loop
    const multiplier1 = Math.max(1, Math.ceil(8 / row1.length));
    const multiplier2 = Math.max(1, Math.ceil(8 / row2.length));

    const t1 = Array(multiplier1).fill(row1).flat();
    const t2 = Array(multiplier2).fill(row2).flat();

    return { marqueeTrack1: t1, marqueeTrack2: t2 };
  }, [displayReviews, total]);

  const DURATION = 4500; // 4.5s
  const INTERVAL_STEP = 50;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  useEffect(() => {
    if (viewMode !== "carousel" || isPaused || total <= 1) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (INTERVAL_STEP / DURATION) * 100;
      });
    }, INTERVAL_STEP);

    return () => clearInterval(timer);
  }, [viewMode, isPaused, nextSlide, total]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, designation, rating, comment, image }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");

      setFormSuccess(true);
      setName("");
      setDesignation("");
      setComment("");
      setRating(5);
      setImage("");
      setTimeout(() => {
        setFormSuccess(false);
        setShowModal(false);
      }, 2500);
    } catch (err: any) {
      setFormError(err.message || "Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-8 py-8 relative w-full overflow-hidden">
      {/* Background Ambient Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-80 bg-gradient-to-r from-growth-green/5 via-impact-orange/10 to-reliability-blue/5 blur-3xl pointer-events-none -z-10 rounded-full"></div>

      {/* Header with Title & View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-impact-orange/10 text-impact-orange font-bold text-xs mb-3 rounded-full border border-impact-orange/20">
            <Flame className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "জনসাধারণের লাইভ মতামত" : "Live Community Testimonials"}</span>
            {total > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-impact-orange text-white text-[10px] rounded-full font-bold">
                {total}
              </span>
            )}
          </div>
          <h2 className="font-headline-xl text-3xl md:text-5xl text-foreground font-bold tracking-tight">
            {language === "bn" ? "সংগঠন সম্পর্কে মানুষের অভিমত" : "Voices from Our Community"}
          </h2>
          <p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-2xl mt-2">
            {language === "bn"
              ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের স্বচ্ছতা ও মানবসেবামূলক কার্যক্রম নিয়ে দাতা ও শুভাকাঙ্ক্ষীদের প্রকৃত প্রতিক্রিয়া।"
              : "Inspiring feedback and ratings from donors, local residents, and well-wishers."}
          </p>
        </div>

        {/* Action Controls & Style Toggle */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {total > 0 && (
            <div className="bg-surface-container-lowest dark:bg-surface-container-low p-1 border border-border rounded-xl shadow-xs flex items-center gap-1">
              <button
                onClick={() => setViewMode("marquee")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "marquee"
                    ? "bg-growth-green text-white shadow-xs"
                    : "text-on-surface-variant hover:text-foreground"
                }`}
              >
                <Infinity className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "ইনফিনিট ফ্লো" : "Infinite Stream"}</span>
              </button>
              <button
                onClick={() => setViewMode("carousel")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "carousel"
                    ? "bg-growth-green text-white shadow-xs"
                    : "text-on-surface-variant hover:text-foreground"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "কার্ড স্লাইডার" : "Card Slider"}</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-growth-green hover:bg-[#236026] text-white px-5 py-2.5 font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 rounded-xl cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{language === "bn" ? "মতামত দিন" : "Write Review"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ZERO DATA / EMPTY STATE                                                   */}
      {/* ========================================================================= */}
      {total === 0 ? (
        <div className="py-16 px-6 text-center bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-dashed border-border space-y-4 max-w-2xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-growth-green/10 text-growth-green flex items-center justify-center mx-auto border border-growth-green/20">
            <MessageSquareHeart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">
              {language === "bn" ? "এখনো কোনো অনুমোদিত মতামত প্রকাশিত হয়নি" : "No Published Reviews Yet"}
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
              {language === "bn" 
                ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের কার্যক্রম নিয়ে আপনার মূল্যবান অনুভূতি ও উৎসাহ সবার প্রথমে শেয়ার করুন!" 
                : "Be the first to share your thoughts, feedback, and encouragement with Birkhal Youth Organization!"}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-growth-green text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#236026] transition-all cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{language === "bn" ? "প্রথম মতামতটি আপনি দিন" : "Write the First Review"}</span>
          </button>
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* STYLE 1: DUAL-TRACK INFINITE FLOW MARQUEE                                 */}
          {/* ========================================================================= */}
          {viewMode === "marquee" && (
            <div className="relative w-full overflow-hidden py-4 group">
              {/* Left & Right Smooth Gradient Masks */}
              <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none"></div>

              {/* Row 1: Flowing Left */}
              <div className="flex gap-6 animate-marquee py-2">
                {marqueeTrack1.map((rev: any, idx: number) => (
                  <div
                    key={`m1-${rev._id || idx}-${idx}`}
                    className="w-[320px] sm:w-[380px] shrink-0 p-6 bg-surface-container-lowest dark:bg-surface-container-low border border-border hover:border-growth-green/60 shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl relative overflow-hidden flex flex-col justify-between group"
                  >
                    {/* Top Accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-impact-orange via-growth-green to-reliability-blue opacity-80"></div>
                    
                    {/* Decorative Background Quote Watermark */}
                    <Quote className="w-16 h-16 text-growth-green/5 dark:text-white/5 absolute -right-2 -bottom-2 pointer-events-none group-hover:scale-110 group-hover:text-growth-green/10 transition-all duration-500" />

                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5 text-impact-orange">
                            {[...Array(rev.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-impact-orange text-impact-orange" />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-impact-orange/90 font-mono">({rev.rating || 5}.0)</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-growth-green bg-growth-green/10 px-2 py-0.5 border border-growth-green/20 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{language === "bn" ? "ভেরিফায়েড" : "Verified"}</span>
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed line-clamp-4">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-3 relative z-10">
                      <div className="flex items-center gap-3 min-w-0">
                        {rev.image ? (
                          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border-2 border-growth-green/40 shadow-xs relative group-hover:scale-105 transition-transform bg-surface-variant">
                            <img src={rev.image} alt={rev.name} className="w-full h-full object-cover object-top" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-growth-green to-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                            {rev.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-foreground truncate flex items-center gap-1">
                            <span>{rev.name}</span>
                          </h4>
                          <p className="text-[11px] text-on-surface-variant truncate flex items-center gap-1">
                            <HeartHandshake className="w-3 h-3 text-growth-green shrink-0" />
                            <span>{rev.designation || (language === "bn" ? "শুভাকাঙ্ক্ষী" : "Supporter")}</span>
                          </p>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-surface-variant/80 dark:bg-white/5 flex items-center justify-center text-growth-green shrink-0 border border-border">
                        <MessageSquareHeart className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2: Flowing Right */}
              <div className="flex gap-6 animate-marquee-reverse py-2 mt-4">
                {marqueeTrack2.map((rev: any, idx: number) => (
                  <div
                    key={`m2-${rev._id || idx}-${idx}`}
                    className="w-[320px] sm:w-[380px] shrink-0 p-6 bg-surface-container-lowest dark:bg-surface-container-low border border-border hover:border-reliability-blue/60 shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl relative overflow-hidden flex flex-col justify-between group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-reliability-blue via-growth-green to-impact-orange opacity-80"></div>
                    
                    {/* Decorative Background Quote Watermark */}
                    <Quote className="w-16 h-16 text-reliability-blue/5 dark:text-white/5 absolute -right-2 -bottom-2 pointer-events-none group-hover:scale-110 group-hover:text-reliability-blue/10 transition-all duration-500" />

                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5 text-impact-orange">
                            {[...Array(rev.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-impact-orange text-impact-orange" />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-impact-orange/90 font-mono">({rev.rating || 5}.0)</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-reliability-blue bg-reliability-blue/10 px-2 py-0.5 border border-reliability-blue/20 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{language === "bn" ? "ভেরিফায়েড" : "Verified"}</span>
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed line-clamp-4">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-3 relative z-10">
                      <div className="flex items-center gap-3 min-w-0">
                        {rev.image ? (
                          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border-2 border-reliability-blue/40 shadow-xs relative group-hover:scale-105 transition-transform bg-surface-variant">
                            <img src={rev.image} alt={rev.name} className="w-full h-full object-cover object-top" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-reliability-blue to-cyan-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                            {rev.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-foreground truncate flex items-center gap-1">
                            <span>{rev.name}</span>
                          </h4>
                          <p className="text-[11px] text-on-surface-variant truncate flex items-center gap-1">
                            <HeartHandshake className="w-3 h-3 text-reliability-blue shrink-0" />
                            <span>{rev.designation || (language === "bn" ? "শুভাকাঙ্ক্ষী" : "Supporter")}</span>
                          </p>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-surface-variant/80 dark:bg-white/5 flex items-center justify-center text-reliability-blue shrink-0 border border-border">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-4">
                <p className="text-[11px] text-on-surface-variant">
                  {language === "bn" ? "💡 কার্ডে মাউস রাখলে মারকুই স্বয়ংক্রিয়ভাবে থেমে যাবে" : "💡 Hover over any card to pause stream"}
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STYLE 2: 3-CARD SWIPER CAROUSEL WITH INTERACTIVE CONTROLS                */}
          {/* ========================================================================= */}
          {viewMode === "carousel" && (
            <div 
              className="space-y-6"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Progress Bar */}
              <div className="w-full h-1 bg-surface-variant dark:bg-surface relative overflow-hidden rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-impact-orange via-growth-green to-reliability-blue transition-all duration-75 ease-linear rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Multi-Card Stage */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(total >= 3 ? [0, 1, 2] : Array.from({ length: total }, (_, i) => i)).map((offset) => {
                  const itemIdx = (currentIndex + offset) % total;
                  const rev = displayReviews[itemIdx];
                  if (!rev) return null;
                  const isCenter = offset === 0;

                  return (
                    <div
                      key={rev._id || itemIdx}
                      className={`p-6 sm:p-8 bg-surface-container-lowest dark:bg-surface-container-low border transition-all duration-500 rounded-xl flex flex-col justify-between space-y-4 relative overflow-hidden ${
                        isCenter
                          ? "border-2 border-growth-green shadow-xl scale-[1.02] bg-gradient-to-b from-growth-green/5 to-transparent"
                          : "border-border shadow-sm opacity-85 hover:opacity-100"
                      }`}
                    >
                      <Quote className="w-20 h-20 text-growth-green/5 absolute -right-3 -bottom-3 pointer-events-none" />

                      <div className="space-y-3 relative z-10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-impact-orange">
                            {[...Array(rev.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-impact-orange text-impact-orange" />
                            ))}
                          </div>
                          {isCenter && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-growth-green text-white rounded-md">
                              {language === "bn" ? "স্পটলাইট" : "Spotlight"}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-foreground italic leading-relaxed line-clamp-5">
                          "{rev.comment}"
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border flex items-center gap-3 relative z-10">
                        {rev.image ? (
                          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border-2 border-growth-green/40 shadow-xs relative bg-surface-variant">
                            <img src={rev.image} alt={rev.name} className="w-full h-full object-cover object-top" />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-growth-green to-impact-orange text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                            {rev.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-foreground truncate">{rev.name}</h4>
                          <p className="text-xs text-on-surface-variant truncate">{rev.designation || (language === "bn" ? "বীরখালবাসী ও দাতা" : "Donor / Resident")}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Carousel Navigation Footer */}
              {total > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5">
                    {displayReviews.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                          idx === currentIndex
                            ? "w-8 h-2.5 bg-growth-green shadow-xs"
                            : "w-2.5 h-2.5 bg-surface-variant hover:bg-on-surface-variant/50"
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevSlide}
                      className="w-10 h-10 border border-border bg-surface-container-lowest dark:bg-surface-container-low hover:bg-growth-green hover:text-white text-foreground flex items-center justify-center transition-all shadow-xs rounded-xl cursor-pointer"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-10 h-10 border border-border bg-surface-container-lowest dark:bg-surface-container-low hover:bg-growth-green hover:text-white text-foreground flex items-center justify-center transition-all shadow-xs rounded-xl cursor-pointer"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Review Submission Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface dark:bg-surface-container-lowest w-full max-w-lg shadow-2xl border border-border p-6 md:p-8 rounded-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6 sticky top-0 bg-surface dark:bg-surface-container-lowest z-10">
              <div>
                <h3 className="font-headline-md text-xl font-bold text-foreground">
                  {language === "bn" ? "সংগঠন সম্পর্কে আপনার মতামত দিন" : "Submit Your Feedback"}
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {language === "bn" ? "আপনার অনুভূতি ও পরামর্শ আমাদের সমাজসেবাকে আরও সমৃদ্ধ করবে।" : "Your encouragement empowers our ground-level charity works."}
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 text-on-surface-variant hover:text-foreground rounded-lg hover:bg-surface-variant transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess ? (
              <div className="p-6 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-base text-emerald-600">
                  {language === "bn" ? "ধন্যবাদ! আপনার মতামত সফলভাবে জমা হয়েছে।" : "Thank you! Your feedback was submitted successfully."}
                </h4>
                <p className="text-xs text-on-surface-variant">
                  {language === "bn" ? "অ্যাডমিন অনুমোদনের পর এটি ওয়েবসাইটে প্রদর্শিত হবে।" : "It will appear on the portal upon admin verification."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-bold rounded-xl border border-red-200">
                    {formError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">{language === "bn" ? "আপনার নাম *" : "Your Full Name *"}</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === "bn" ? "যেমন: মোহাম্মদ রহিম" : "e.g. John Doe"}
                    className="w-full bg-surface-variant/50 dark:bg-background border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-growth-green rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">{language === "bn" ? "পদবী / এলাকা / পেশা" : "Designation / Location"}</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder={language === "bn" ? "যেমন: বীরখাল গ্রামবাসী / প্রবাসী শুভাকাঙ্ক্ষী" : "e.g. Resident / Donor"}
                    className="w-full bg-surface-variant/50 dark:bg-background border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-growth-green rounded-xl"
                  />
                </div>

                {/* Photo Upload Option */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">
                    {language === "bn" ? "আপনার ছবি (ঐচ্ছিক)" : "Your Photo (Optional)"}
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-surface-variant/30 dark:bg-background/50 border border-border rounded-xl">
                    {image ? (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-growth-green shrink-0 shadow-xs">
                        <img src={image} alt="Preview" className="w-full h-full object-cover object-top" />
                        <button
                          type="button"
                          onClick={() => setImage("")}
                          className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-surface-variant dark:bg-surface-container border border-dashed border-border flex items-center justify-center text-on-surface-variant shrink-0">
                        <Upload className="w-5 h-5 opacity-60" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <input
                        type="file"
                        accept="image/*"
                        id="review-photo-upload"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="review-photo-upload"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest dark:bg-surface-container hover:bg-surface-variant text-foreground text-xs font-bold rounded-lg border border-border cursor-pointer transition-colors shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-growth-green" />
                        <span>{image ? (language === "bn" ? "ছবি পরিবর্তন করুন" : "Change Photo") : (language === "bn" ? "ছবি আপলোড করুন" : "Upload Photo")}</span>
                      </label>
                      <p className="text-[10px] text-on-surface-variant mt-1 truncate">
                        {language === "bn" ? "JPG, PNG বা WEBP (সর্বোচ্চ ৫ মেগাবাইট)" : "JPG, PNG or WEBP (Max 5MB)"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">{language === "bn" ? "রেটিং নির্বাচন করুন" : "Select Rating"}</label>
                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? "fill-impact-orange text-impact-orange" : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-on-surface-variant ml-2">({rating} / 5)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">{language === "bn" ? "আপনার মন্তব্য বা অভিজ্ঞতা *" : "Your Feedback Comment *"}</label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={language === "bn" ? "সংগঠনের কার্যক্রম সম্পর্কে আপনার অনুভূতি লিখুন..." : "Share your honest review..."}
                    className="w-full bg-surface-variant/50 dark:bg-background border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-growth-green rounded-xl"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-border text-foreground font-bold text-xs rounded-xl cursor-pointer hover:bg-surface-variant"
                  >
                    {language === "bn" ? "বাতিল" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-growth-green hover:bg-[#236026] text-white font-bold text-xs shadow-sm flex items-center gap-2 rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{submitting ? (language === "bn" ? "পাঠানো হচ্ছে..." : "Submitting...") : (language === "bn" ? "মতামত জমা দিন" : "Submit Feedback")}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
