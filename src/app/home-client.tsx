'use client';

import { useLanguage } from '@/components/language-provider';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  HeartHandshake,
  GraduationCap,
  Handshake as HandshakeIcon,
  Eye,
  Megaphone,
  Users,
  TreePine,
  Quote,
  Star,
  User,
  ArrowRight,
  ShieldCheck,
  Award,
  Heart,
  CheckCircle2,
  Sparkles,
  MapPin,
  Send,
  Loader2,
  Calendar,
  Layers,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const HomeCommitteeSlider = dynamic(() => import('@/components/home-committee-slider').then(mod => mod.HomeCommitteeSlider), { loading: () => <div className="h-96 flex items-center justify-center text-muted-foreground">Loading Committee...</div> });
const HomeMembersDirectory = dynamic(() => import('@/components/home-members-directory').then(mod => mod.HomeMembersDirectory), { loading: () => <div className="h-96 flex items-center justify-center text-muted-foreground">Loading Members...</div> });
const HomeGallery = dynamic(() => import('@/components/home-gallery').then(mod => mod.HomeGallery), { loading: () => <div className="h-96 flex items-center justify-center text-muted-foreground">Loading Gallery...</div> });
const HomeMap = dynamic(() => import('@/components/home-map').then(mod => mod.HomeMap), { loading: () => <div className="h-96 flex items-center justify-center text-muted-foreground">Loading Map...</div> });
const OrganizationRules = dynamic(() => import('@/components/organization-rules').then(mod => mod.OrganizationRules), { loading: () => <div className="h-96 flex items-center justify-center text-muted-foreground">Loading Rules...</div> });
const HomeReviewsSlider = dynamic(() => import('@/components/home-reviews-slider').then(mod => mod.HomeReviewsSlider), { loading: () => <div className="h-96 flex items-center justify-center text-muted-foreground">Loading Reviews...</div> });
const HomeEventsSection = dynamic(() => import('@/components/home-events-section').then(mod => mod.HomeEventsSection), { loading: () => <div className="h-96 flex items-center justify-center text-muted-foreground">Loading Events...</div> });

import { Footer } from '@/components/footer';

export function HomeClient({
  initialReviews,
  committeeMembers = [],
  generalMembers = [],
  settings = {},
  mediaList = [],
  eventsList = [],
}: {
  initialReviews: any[];
  committeeMembers?: any[];
  generalMembers?: any[];
  settings?: Record<string, string>;
  mediaList?: any[];
  eventsList?: any[];
}) {
  const { language } = useLanguage();
  const [reviews] = useState<any[]>(initialReviews);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.rating = rating.toString();

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setRating(5);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Content variables with authentic humanized fallbacks
  const heroBadge =
    (language === 'bn'
      ? settings['hero_badge_bn']
      : settings['hero_badge_en']) ||
    (language === 'bn'
      ? 'মানবতার সেবায় নিবেদিত যুবসমাজ'
      : 'Youth Dedicated to Humanity');

  const heroHeading =
    language === 'bn'
      ? settings['hero_heading_bn']
      : settings['hero_heading_en'];
  const heroDesc =
    (language === 'bn' ? settings['hero_desc_bn'] : settings['hero_desc_en']) ||
    (language === 'bn'
      ? 'বীরখাল সমাজ কল্যাণ যুব সংগঠন—একটি সৎ, মানবিক ও সামাজিক পরিবর্তনের অঙ্গীকার। স্থানীয় যুবসমাজের মেধা, দক্ষতা ও পারস্পরিক সহযোগিতায় গড়ে তুলছি একটি আলোকিত বীরখাল।'
      : 'Birkhal Youth Social Welfare Organization is dedicated to empowering our community, supporting education, green ecology, and rapid emergency aid with 100% transparency.');

  const causesTitle =
    (language === 'bn'
      ? settings['causes_title_bn']
      : settings['causes_title_en']) ||
    (language === 'bn'
      ? 'যেখানে আপনার অনুদান ব্যবহৃত হয়'
      : 'Where Your Support Goes');
  const causesDesc =
    (language === 'bn'
      ? settings['causes_desc_bn']
      : settings['causes_desc_en']) ||
    (language === 'bn'
      ? 'আমরা মাঠপর্যায়ে সরাসরি অসহায় মানুষের পাশে দাঁড়াই। আপনার প্রতিটি টাকা শতভাগ সততা ও স্বচ্ছতার সাথে আর্তমানবতার সেবায় ব্যবহৃত হয়।'
      : 'Direct ground-level support for families who need it most, managed with strict accountability.');

  const goalTitle =
    (language === 'bn'
      ? settings['goal_title_bn']
      : settings['goal_title_en']) ||
    (language === 'bn'
      ? 'আমাদের মূল উদ্দেশ্য ও লক্ষ্য'
      : 'Our Core Mission & Focus');
  const goalDesc =
    (language === 'bn' ? settings['goal_desc_bn'] : settings['goal_desc_en']) ||
    (language === 'bn'
      ? 'একটি শক্তিশালী, সুশিক্ষিত ও স্বাবলম্বী আদর্শ সমাজ বিনির্মাণে বীরখাল সমাজ কল্যাণ যুব সংগঠনের নিরলস পথচলা।'
      : 'Empowering our youth, advancing quality education, healthcare, and sustainable development.');

  const statVolunteers = settings['stat_volunteers'] || '0';
  const statVolunteersLabel =
    (language === 'bn'
      ? settings['stat_volunteers_label_bn']
      : settings['stat_volunteers_label_en']) ||
    (language === 'bn' ? 'পরিবারকে সরাসরি সহায়তা' : 'Families Supported');

  const statTrees = settings['stat_trees'] || '0';
  const statTreesLabel =
    (language === 'bn'
      ? settings['stat_trees_label_bn']
      : settings['stat_trees_label_en']) ||
    (language === 'bn' ? 'বৃক্ষরোপণ কর্মসূচি' : 'Trees Planted');

  const statStudents = settings['stat_students'] || '0';
  const statStudentsLabel =
    (language === 'bn'
      ? settings['stat_students_label_bn']
      : settings['stat_students_label_en']) ||
    (language === 'bn' ? 'শিক্ষার্থীকে মেধা বৃত্তি' : 'Students Sponsored');

  const normalizeImageUrl = (
    value?: string,
    fallback = '/ai_education.jpg',
  ) => {
    if (!value) return fallback;

    const legacyMap: Record<string, string> = {
      '/support1.jpeg': '/up-1.jpeg',
      '/support2.jpeg': '/ai_relief.jpg',
      '/support3.jpeg': '/ai_education.jpg',
      '/support4.jpeg': '/ai_plantation.jpg',
      '/about-banner.jpg': '/ai_medical.jpg',
      '/charity_banner.jpg': '/ai_education.jpg',
      '/donation-banner.jpg': '/ai_relief.jpg',
    };

    return legacyMap[value] || value;
  };

  const heroImage = normalizeImageUrl(
    settings['home_hero_image'],
    '/ai_education.jpg',
  );

  return (
    <div className="flex-grow w-full max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-8 space-y-24">
      {/* Hero Section with Floating Glass Badges (Apple/Stripe Style) */}
      {settings['section_hero_enabled'] !== 'false' && (
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-off-white via-surface to-surface-variant/30 dark:from-surface-container-low dark:via-surface-container dark:to-surface-container-highest shadow-md border border-border p-8 md:p-14 lg:p-16">
          {/* Ambient Background glow effects */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-growth-green/10 blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-reliability-blue/10 blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Typography & CTAs (5 cols) */}
            <div className="lg:col-span-5 space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest/90 dark:bg-black/40 backdrop-blur-md border border-border shadow-xs w-fit text-sm font-bold text-growth-green rounded-xl">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-growth-green opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 bg-growth-green"></span>
                </span>
                {heroBadge}
              </div>

              <div className="space-y-4">
                <h1 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl text-foreground font-bold leading-[1.14] tracking-tight">
                  {heroHeading ? (
                    heroHeading
                  ) : (
                    <>
                      {language === 'bn' ? 'আমাদের সমাজকে' : 'Empowering Our'}{' '}
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-growth-green via-emerald-600 to-reliability-blue">
                        {language === 'bn'
                          ? 'একসাথে শক্তিশালী করি'
                          : 'Community Together'}
                      </span>
                    </>
                  )}
                </h1>
                <p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-xl leading-relaxed">
                  {heroDesc}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3.5 items-start sm:items-center pt-1">
                <Link
                  href="/registration"
                  className="bg-growth-green hover:bg-[#236026] text-white font-bold px-7 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-growth-green/20 hover:shadow-xl hover:shadow-growth-green/30 hover:-translate-y-0.5 text-sm"
                >
                  <HeartHandshake size={18} />
                  {language === 'bn' ? 'সদস্য হোন' : 'Join Now'}
                </Link>
                <Link
                  href="/about"
                  className="bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-foreground font-bold px-7 py-3.5 rounded-xl flex items-center gap-2 transition-all border border-border backdrop-blur-sm hover:-translate-y-0.5 shadow-xs text-sm"
                >
                  {language === 'bn' ? 'আরও জানুন' : 'Learn More'}
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Social Proof Mini Bar */}
              <div className="pt-2 flex items-center gap-3 text-xs border-t border-border/60">
                <div className="flex -space-x-2 overflow-hidden shrink-0">
                  <div className="inline-flex h-8 w-8 rounded-full ring-2 ring-surface bg-growth-green text-white font-bold items-center justify-center text-[10px]">
                    {language === 'bn' ? 'বীর' : 'BY'}
                  </div>
                  <div className="inline-flex h-8 w-8 rounded-full ring-2 ring-surface bg-impact-orange text-white font-bold items-center justify-center text-[10px]">
                    {language === 'bn' ? 'খাল' : 'SO'}
                  </div>
                  <div className="inline-flex h-8 w-8 rounded-full ring-2 ring-surface bg-reliability-blue text-white font-bold items-center justify-center text-[10px]">
                    {language === 'bn' ? 'যুব' : 'WO'}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-foreground">
                    {language === 'bn'
                      ? 'বীরখাল সমাজ কল্যাণ যুব সংগঠন'
                      : 'Birkhal Youth Social Welfare Organization'}
                  </p>
                  <p className="text-[11px] text-growth-green font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-growth-green animate-ping"></span>
                    {language === 'bn'
                      ? 'মাঠপর্যায়ে মানবসেবায় সার্বক্ষণিক নিবেদিত'
                      : 'Dedicated to Community Service'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Expanded Hero Visual (7 cols) */}
            <div className="lg:col-span-7 relative w-full">
              <div className="relative h-[440px] sm:h-[500px] lg:h-[540px] w-full rounded-xl overflow-hidden shadow-2xl group z-10 border border-border/80 bg-surface-container">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent z-10 opacity-70 group-hover:opacity-85 transition-opacity duration-500"></div>
                <Image
                  src={heroImage}
                  alt="Birkhal Youth Members"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                  loading="eager"
                  unoptimized={normalizeImageUrl(
                    settings['home_hero_image'],
                    '/ai_education.jpg',
                  ).startsWith('data:')}
                  className="object-cover object-top w-full h-full group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Transparent Card 1 (Top Left) */}
                {settings['section_stats_enabled'] !== 'false' && (
                  <div className="absolute top-4 left-4 z-20 bg-transparent border border-white/40 p-2.5 sm:p-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:border-white/70 group/card animate-in fade-in slide-in-from-top-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-transparent text-white flex items-center justify-center border border-white/50 shrink-0 group-hover/card:scale-110 transition-transform">
                      <Users className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                    </div>
                    <div className="text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base sm:text-lg tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                          {statVolunteers}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_#ffffff]"></span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        {statVolunteersLabel}
                      </p>
                    </div>
                  </div>
                )}

                {/* Floating Transparent Card 2 (Top Right / Middle) */}
                {settings['section_stats_enabled'] !== 'false' && (
                  <div className="absolute top-20 sm:top-24 right-4 z-20 bg-transparent border border-white/40 p-2.5 sm:p-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:border-white/70 group/card animate-in fade-in slide-in-from-right-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-transparent text-white flex items-center justify-center border border-white/50 shrink-0 group-hover/card:scale-110 transition-transform">
                      <TreePine className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                    </div>
                    <div className="text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base sm:text-lg tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                          {statTrees}
                        </span>
                        <span className="text-[9px] font-bold text-white bg-transparent px-2 py-0.5 rounded-full border border-white/40 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          {language === 'bn' ? 'সবুজায়ন' : 'Ecology'}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        {statTreesLabel}
                      </p>
                    </div>
                  </div>
                )}

                {/* Floating Transparent Card 3 (Bottom Left) */}
                {settings['section_stats_enabled'] !== 'false' && (
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-20 bg-transparent border border-white/40 p-2.5 sm:p-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:border-white/70 group/card animate-in fade-in slide-in-from-bottom-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-transparent text-white flex items-center justify-center border border-white/50 shrink-0 group-hover/card:scale-110 transition-transform">
                      <GraduationCap className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                    </div>
                    <div className="text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base sm:text-lg tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                          {statStudents}
                        </span>
                        <span className="text-[9px] font-bold text-white bg-transparent px-2 py-0.5 rounded-full border border-white/40 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          {language === 'bn' ? 'শিক্ষা' : 'Education'}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        {statStudentsLabel}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* EXECUTIVE COMMITTEE SLIDER                                               */}
      {/* ========================================================================= */}
      {settings['section_committee_enabled'] !== 'false' && (
        <HomeCommitteeSlider
          committeeMembers={committeeMembers}
          settings={settings}
        />
      )}

      {/* ========================================================================= */}
      {/* UPCOMING & ONGOING LIVE COMMUNITY EVENTS                                  */}
      {/* ========================================================================= */}
      <HomeEventsSection events={eventsList} settings={settings} />

      {/* ========================================================================= */}
      {/* 4 CAUSES / WHERE YOUR SUPPORT GOES (Real Activity Photos)                 */}
      {/* ========================================================================= */}
      {settings['section_causes_enabled'] !== 'false' && (
        <section className="space-y-12 py-6 relative z-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3 py-1 bg-growth-green/10 text-growth-green text-xs font-bold rounded-full border border-growth-green/20 uppercase tracking-wider">
              {language === 'bn' ? 'আমাদের মূল কার্যক্রম' : 'Our Core Pillars'}
            </span>
            <h2 className="font-headline-xl text-3xl md:text-5xl text-foreground font-bold tracking-tight">
              {causesTitle}
            </h2>
            <p className="font-body-lg text-sm sm:text-base text-on-surface-variant">
              {causesDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Cause Card 1: Education */}
            <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-xl overflow-hidden shadow-xs hover:shadow-xl border border-border group transition-all duration-300 flex flex-col">
              <div className="h-52 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={normalizeImageUrl(
                    settings['cause_1_image'],
                    '/ai_education.jpg',
                  )}
                  alt="Education"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized={normalizeImageUrl(
                    settings['cause_1_image'],
                    '/ai_education.jpg',
                  ).startsWith('data:')}
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-growth-green text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  {language === 'bn' ? 'শিক্ষা সহায়তা' : 'Education'}
                </div>
              </div>
              <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-lg text-foreground group-hover:text-growth-green transition-colors">
                    {(language === 'bn'
                      ? settings['cause_1_title_bn']
                      : settings['cause_1_title_en']) ||
                      (language === 'bn'
                        ? 'সবার জন্য শিক্ষা ও উপকরণ'
                        : 'Education for All')}
                  </h4>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1.5">
                    {(language === 'bn'
                      ? settings['cause_1_desc_bn']
                      : settings['cause_1_desc_en']) ||
                      (language === 'bn'
                        ? 'দরিদ্র ও মেধাবী শিক্ষার্থীদের মাঝে বিনামূল্যে বই, খাতা, স্কুল ড্রেস ও মেধা বৃত্তি বিতরণ।'
                        : 'Providing free textbooks, uniforms, and educational scholarships for underprivileged children.')}
                  </p>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-growth-green">
                  <span>
                    {language === 'bn' ? 'সরাসরি মাঠপর্যায়ে' : 'Active Program'}
                  </span>
                  <Link
                    href="/donations"
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>{language === 'bn' ? 'অনুদান দিন' : 'Support'}</span>{' '}
                    &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Cause Card 2: Tree Plantation & Environment */}
            <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-xl overflow-hidden shadow-xs hover:shadow-xl border border-border group transition-all duration-300 flex flex-col">
              <div className="h-52 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={normalizeImageUrl(
                    settings['cause_2_image'],
                    '/ai_plantation.jpg',
                  )}
                  alt="Plantation & Environment"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized={normalizeImageUrl(
                    settings['cause_2_image'],
                    '/ai_plantation.jpg',
                  ).startsWith('data:')}
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-impact-orange text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  {language === 'bn' ? 'পরিবেশ ও বৃক্ষরোপণ' : 'Environment'}
                </div>
              </div>
              <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-lg text-foreground group-hover:text-growth-green transition-colors">
                    {(language === 'bn'
                      ? settings['cause_2_title_bn']
                      : settings['cause_2_title_en']) ||
                      (language === 'bn'
                        ? 'বীরখাল সবুজায়ন ও পরিবেশ রক্ষা'
                        : 'Plantation & Green Ecology')}
                  </h4>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1.5">
                    {(language === 'bn'
                      ? settings['cause_2_desc_bn']
                      : settings['cause_2_desc_en']) ||
                      (language === 'bn'
                        ? 'রাস্তার পাশে, শিক্ষা প্রতিষ্ঠানে ও গ্রামে ফলজ ও বনজ বৃক্ষরোপণ করে একটি সবুজ পরিবেশ গড়ে তোলা।'
                        : 'Mass tree plantation across village roads and institutions to ensure a sustainable green future.')}
                  </p>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-impact-orange">
                  <span>
                    {language === 'bn' ? 'চলমান উদ্যোগ' : 'Green Initiative'}
                  </span>
                  <Link
                    href="/donations"
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>{language === 'bn' ? 'অনুদান দিন' : 'Support'}</span>{' '}
                    &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Cause Card 3: Healthcare & Medical Aid */}
            <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-xl overflow-hidden shadow-xs hover:shadow-xl border border-border group transition-all duration-300 flex flex-col">
              <div className="h-52 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={normalizeImageUrl(
                    settings['cause_3_image'],
                    '/ai_medical.jpg',
                  )}
                  alt="Healthcare"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized={normalizeImageUrl(
                    settings['cause_3_image'],
                    '/ai_medical.jpg',
                  ).startsWith('data:')}
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-reliability-blue text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  {language === 'bn' ? 'চিকিৎসা ও সেবা' : 'Healthcare'}
                </div>
              </div>
              <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-lg text-foreground group-hover:text-growth-green transition-colors">
                    {(language === 'bn'
                      ? settings['cause_3_title_bn']
                      : settings['cause_3_title_en']) ||
                      (language === 'bn'
                        ? 'ফ্রি মেডিকেল ও চিকিৎসা সহায়তা'
                        : 'Healthcare & Medical Camps')}
                  </h4>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1.5">
                    {(language === 'bn'
                      ? settings['cause_3_desc_bn']
                      : settings['cause_3_desc_en']) ||
                      (language === 'bn'
                        ? 'দরিদ্র ও অসহায় রোগীদের বিনামূল্যে ওষুধ বিতরণ, চিকিৎসা তহবিল ও অ্যাম্বুলেন্স জরুরি সহায়তা।'
                        : 'Providing free essential medicines, health checkup camps, and emergency health grants.')}
                  </p>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-reliability-blue">
                  <span>
                    {language === 'bn' ? 'মানবিক সহায়তা' : 'Medical Fund'}
                  </span>
                  <Link
                    href="/donations"
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>{language === 'bn' ? 'অনুদান দিন' : 'Support'}</span>{' '}
                    &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Cause Card 4: Emergency Disaster Relief */}
            <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-xl overflow-hidden shadow-xs hover:shadow-xl border border-border group transition-all duration-300 flex flex-col">
              <div className="h-52 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={normalizeImageUrl(
                    settings['cause_4_image'],
                    '/ai_relief.jpg',
                  )}
                  alt="Emergency Relief"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized={normalizeImageUrl(
                    settings['cause_4_image'],
                    '/ai_relief.jpg',
                  ).startsWith('data:')}
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  {language === 'bn' ? 'জরুরি ত্রাণ' : 'Emergency Relief'}
                </div>
              </div>
              <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-lg text-foreground group-hover:text-growth-green transition-colors">
                    {(language === 'bn'
                      ? settings['cause_4_title_bn']
                      : settings['cause_4_title_en']) ||
                      (language === 'bn'
                        ? 'বন্যা ও দুর্যোগকালীন ত্রাণ তহবিল'
                        : 'Disaster & Emergency Relief')}
                  </h4>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1.5">
                    {(language === 'bn'
                      ? settings['cause_4_desc_bn']
                      : settings['cause_4_desc_en']) ||
                      (language === 'bn'
                        ? 'বন্যা, শীতবস্ত্র বিতরণ ও যেকোনো দুর্যোগে পানিবন্দী এবং বিপদগ্রস্ত মানুষের কাছে খাবার পৌঁছে দেওয়া।'
                        : 'Immediate relief packages, cooked food, and warm clothes distribution during natural calamities.')}
                  </p>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-red-600">
                  <span>
                    {language === 'bn' ? 'জরুরি তহবিল' : 'Emergency Fund'}
                  </span>
                  <Link
                    href="/donations"
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>{language === 'bn' ? 'অনুদান দিন' : 'Support'}</span>{' '}
                    &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* BENTO GRID: OUR GOAL, VALUES & PILLARS                                    */}
      {/* ========================================================================= */}
      {settings['section_goal_enabled'] !== 'false' && (
        <section className="space-y-10 relative">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3 py-1 bg-growth-green/10 text-growth-green text-xs font-bold rounded-full border border-growth-green/20 uppercase tracking-wider">
              {language === 'bn' ? 'আমাদের দর্শন' : 'Our Philosophy'}
            </span>
            <h2 className="font-headline-xl text-3xl md:text-5xl text-foreground font-bold tracking-tight">
              {goalTitle}
            </h2>
            <p className="font-body-lg text-sm sm:text-base text-on-surface-variant">
              {goalDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Big Feature Bento Card (8 Cols) */}
            <div className="md:col-span-8 bg-gradient-to-br from-growth-green/15 via-surface-container-lowest to-surface-container-lowest dark:from-growth-green/10 dark:via-surface-container-low dark:to-surface-container-low p-8 sm:p-10 rounded-xl relative overflow-hidden border border-border shadow-xs hover:border-growth-green/40 transition-all flex flex-col justify-between min-h-[340px]">
              <div className="space-y-4 max-w-xl z-10">
                <div className="p-3 bg-growth-green text-white rounded-xl w-fit shadow-md">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="font-headline-md text-2xl sm:text-3xl text-foreground font-extrabold tracking-tight">
                  {language === 'bn'
                    ? 'শতভাগ আর্থিক স্বচ্ছতা ও জবাবদিহিতা'
                    : '100% Financial Transparency & Trust'}
                </h3>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  {language === 'bn'
                    ? 'আমাদের প্রতিটি অনুদানের হিসাব প্রকাশ্য এবং প্রতি মাসের আয়-ব্যয়ের হিসাব সদস্য ও সাধারণ মানুষের জন্য উন্মুক্ত থাকে।'
                    : 'Every contribution is fully documented and audited. Monthly financial summaries are publicly viewable for all donors and members.'}
                </p>
              </div>

              <div className="pt-6 border-t border-border/80 flex flex-wrap items-center justify-between gap-4 z-10">
                <div className="flex items-center gap-2 text-xs font-bold text-growth-green">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {language === 'bn'
                      ? 'স্বচ্ছতা আমাদের অঙ্গীকার'
                      : 'Verified Charity Records'}
                  </span>
                </div>
                <Link
                  href="/donations"
                  className="text-xs font-bold text-foreground hover:text-growth-green flex items-center gap-1 transition-colors"
                >
                  <span>
                    {language === 'bn'
                      ? 'অনুদান বিবরণী দেখুন'
                      : 'View Accounts'}
                  </span>{' '}
                  &rarr;
                </Link>
              </div>
            </div>

            {/* Side Card 1 (4 Cols) */}
            <div className="md:col-span-4 bg-surface-container-lowest dark:bg-surface-container-low p-8 rounded-xl border border-border shadow-xs hover:border-reliability-blue/40 transition-all flex flex-col justify-between min-h-[340px]">
              <div className="space-y-4">
                <div className="p-3 bg-reliability-blue/10 text-reliability-blue rounded-2xl w-fit">
                  <HandshakeIcon className="w-7 h-7" />
                </div>
                <h3 className="font-headline-md text-xl sm:text-2xl text-foreground font-bold">
                  {language === 'bn'
                    ? 'ঐক্য ও সহযোগিতা'
                    : 'Unity & Brotherhood'}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {language === 'bn'
                    ? 'গ্রামের সকল স্তরের মানুষকে সাথে নিয়ে একটি সুশৃঙ্খল ও ভেদাভেদহীন সমাজ গঠন করাই আমাদের লক্ষ্য।'
                    : 'Uniting volunteers and residents across all backgrounds to build a harmonious village community.'}
                </p>
              </div>
              <div className="pt-4 text-xs font-bold text-reliability-blue">
                {language === 'bn'
                  ? 'একতাই আমাদের শক্তি'
                  : 'United for Positive Change'}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* ALL REGISTERED GENERAL MEMBERS DIRECTORY                                   */}
      {/* ========================================================================= */}
      {settings['section_members_enabled'] !== 'false' && (
        <HomeMembersDirectory
          generalMembers={generalMembers}
          settings={settings}
        />
      )}

      {/* ========================================================================= */}
      {/* MOMENTS & PHOTO GALLERY (Real Action Pictures)                            */}
      {/* ========================================================================= */}
      {settings['section_gallery_enabled'] !== 'false' && (
        <HomeGallery mediaList={mediaList} settings={settings} />
      )}

      {/* ========================================================================= */}
      {/* CONSTITUTIONAL POLICIES & CODE OF CONDUCT                                 */}
      {/* ========================================================================= */}
      {settings['section_rules_enabled'] !== 'false' && (
        <OrganizationRules settings={settings} />
      )}

      {/* ========================================================================= */}
      {/* REVIEWS & COMMUNITY FEEDBACK (MODERN HIGH-END SLIDER)                     */}
      {/* ========================================================================= */}
      {settings['section_reviews_enabled'] !== 'false' && (
        <HomeReviewsSlider initialReviews={reviews} settings={settings} />
      )}

      {/* ========================================================================= */}
      {/* GEOGRAPHIC LOCATION & CONTACT MAP                                         */}
      {/* ========================================================================= */}
      <HomeMap settings={settings} />

      {/* ========================================================================= */}
      {/* PLATFORM FOOTER                                                          */}
      {/* ========================================================================= */}
      <Footer settings={settings} />
    </div>
  );
}
