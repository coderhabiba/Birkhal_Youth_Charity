'use client';

import { useLanguage } from '@/components/language-provider';
import {
  HeartHandshake,
  Users,
  Calendar,
  Settings,
  Image as ImageIcon,
  UserCheck,
  DollarSign,
  Activity,
  Layers,
  Sliders,
  ShieldAlert,
  ArrowUpRight,
  CreditCard,
  CalendarDays,
  TrendingUp,
  Heart,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  FileText,
  Calculator,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
const DashboardDonationChart = dynamic(() => import('@/components/dashboard-donation-chart').then(mod => mod.DashboardDonationChart), { loading: () => <div className="h-96 flex items-center justify-center bg-surface-container-lowest rounded-xl border border-border shadow-sm text-muted-foreground">Loading Analytics Chart...</div> });

export function DashboardOverviewClient({
  stats,
  recentRegistrations,
  donations = [],
}: {
  stats: any;
  recentRegistrations: any[];
  donations?: any[];
}) {
  const { language } = useLanguage();

  const totalDonations = Number(stats?.totalDonations) || 0;
  const totalExpenses = Number(stats?.totalExpenses) || 0;
  const netBalance = stats?.netBalance !== undefined ? Number(stats.netBalance) : (totalDonations - totalExpenses);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Quick Action Shortcuts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-growth-green/10 text-growth-green border border-growth-green/20">
              {language === 'bn' ? 'লাইভ কন্ট্রোল রুম' : 'Live Control Hub'}
            </span>
          </div>
          <h1 className="font-headline-lg text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            {language === 'bn' ? 'ড্যাশবোর্ড ওভারভিউ' : 'Dashboard Overview'}
          </h1>
          <p className="text-on-surface-variant font-body-md text-sm mt-1">
            {language === 'bn'
              ? 'বীরখাল সমাজ কল্যাণ যুব সংগঠনের সম্পূর্ণ কার্যক্রম, অনুদান ও সদস্য অ্যানালিটিক্স।'
              : "Comprehensive glance at Birkhal Youth's community metrics and activities."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/calculator"
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>
              {language === 'bn' ? 'আয়-ব্যয় হিসাব ও ক্যালকুলেটর' : 'Income & Expenses'}
            </span>
          </Link>
          <Link
            href="/dashboard/members"
            className="bg-growth-green hover:bg-[#1b501f] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-growth-green/20 hover:shadow-lg hover:shadow-growth-green/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              {language === 'bn' ? 'সদস্য অনুমোদন' : 'Review Members'}
            </span>
          </Link>
          <Link
            href="/dashboard/donations"
            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>
              {language === 'bn' ? 'নতুন অনুদান যোগ' : 'Add Donation'}
            </span>
          </Link>
        </div>
      </div>

      {/* 6 Key Metric Cards - Full Financial Overview & Activities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Metric 1: Total Donations / Income (Emerald Growth Green) */}
        <Link
          href="/dashboard/donations"
          className="bg-surface-container-lowest dark:bg-surface-container-low p-4 sm:p-5 rounded-xl border border-border shadow-xs hover:shadow-md hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 text-emerald-600 fill-emerald-600" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ArrowUpRight className="w-2.5 h-2.5" />
                <span>{language === 'bn' ? 'আয় / অনুদান' : 'Income'}</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant truncate">
              {language === 'bn' ? 'মোট অনুদান' : 'Total Donations'}
            </p>
            <p className="text-xl xl:text-2xl font-black text-foreground mt-1">
              ৳{totalDonations.toLocaleString()}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-growth-green mt-2 font-bold truncate">
            {language === 'bn' ? 'সংগৃহীত অনুদান' : 'Total Income'}
          </p>
        </Link>

        {/* Metric 2: Total Expenses (Crimson / Rose Red) */}
        <Link
          href="/dashboard/calculator"
          className="bg-surface-container-lowest dark:bg-surface-container-low p-4 sm:p-5 rounded-xl border border-border shadow-xs hover:shadow-md hover:border-rose-500/40 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                <TrendingDown className="w-5 h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>{language === 'bn' ? 'ব্যয়' : 'Expense'}</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant truncate">
              {language === 'bn' ? 'মোট ব্যয়' : 'Total Expenses'}
            </p>
            <p className="text-xl xl:text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
              ৳{totalExpenses.toLocaleString()}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-rose-600/90 mt-2 font-bold truncate">
            {language === 'bn' ? 'যাবতীয় খরচ' : 'Documented Expenses'}
          </p>
        </Link>

        {/* Metric 3: Net Remaining Fund / Balance (Royal Sapphire / Indigo) */}
        <Link
          href="/dashboard/calculator"
          className="bg-surface-container-lowest dark:bg-surface-container-low p-4 sm:p-5 rounded-xl border-2 border-indigo-500/30 shadow-xs hover:shadow-md hover:border-indigo-500/60 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                netBalance >= 0 ? 'text-emerald-600 bg-emerald-500/10' : 'text-rose-600 bg-rose-500/10'
              }`}>
                <span>{netBalance >= 0 ? (language === 'bn' ? 'উদ্বৃত্ত' : 'Surplus') : (language === 'bn' ? 'ঘাটতি' : 'Deficit')}</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant truncate">
              {language === 'bn' ? 'অবশিষ্ট তহবিল' : 'Net Balance'}
            </p>
            <p className={`text-xl xl:text-2xl font-black mt-1 ${
              netBalance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              ৳{netBalance.toLocaleString()}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-indigo-600 dark:text-indigo-400 mt-2 font-bold truncate">
            {language === 'bn' ? 'অনুদান - ব্যয়' : 'Income minus Expense'}
          </p>
        </Link>

        {/* Metric 4: Total Members (Royal Sapphire Blue) */}
        <Link
          href="/dashboard/members"
          className="bg-surface-container-lowest dark:bg-surface-container-low p-4 sm:p-5 rounded-xl border border-border shadow-xs hover:shadow-md hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Activity className="w-2.5 h-2.5" />
                <span>{language === 'bn' ? 'সক্রিয়' : 'Active'}</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant truncate">
              {language === 'bn' ? 'অনুমোদিত সদস্য' : 'Approved Members'}
            </p>
            <p className="text-xl xl:text-2xl font-black text-foreground mt-1">
              {stats.totalMembers}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-on-surface-variant/80 mt-2 truncate">
            {language === 'bn' ? 'অনুমোদিত সদস্য' : 'Active Members'}
          </p>
        </Link>

        {/* Metric 5: Active Events (Warm Amber Gold) */}
        <Link
          href="/dashboard/events"
          className="bg-surface-container-lowest dark:bg-surface-container-low p-4 sm:p-5 rounded-xl border border-border shadow-xs hover:shadow-md hover:border-amber-500/40 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <CalendarDays className="w-5 h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                {language === 'bn' ? 'ইভেন্ট' : 'Events'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant truncate">
              {language === 'bn' ? 'আসন্ন ইভেন্ট' : 'Active Events'}
            </p>
            <p className="text-xl xl:text-2xl font-black text-foreground mt-1">
              {stats.activeEvents}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-on-surface-variant/80 mt-2 truncate">
            {language === 'bn' ? 'মাঠপর্যায়ের উদ্যোগ' : 'Upcoming Campaigns'}
          </p>
        </Link>

        {/* Metric 6: Pending Member Approvals (Alert Amber) */}
        <Link
          href="/dashboard/members"
          className="bg-surface-container-lowest dark:bg-surface-container-low p-4 sm:p-5 rounded-xl border-2 border-amber-500/40 shadow-xs hover:shadow-md hover:border-amber-500/60 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full animate-pulse">
                {language === 'bn' ? 'পেন্ডিং' : 'Pending'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant truncate">
              {language === 'bn' ? 'অপেক্ষায় সদস্য' : 'Pending'}
            </p>
            <p className="text-xl xl:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {stats.pendingMembers}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-amber-600/90 mt-2 font-bold truncate">
            {language === 'bn' ? 'পর্যালোচনা প্রয়োজন' : 'Needs Review'}
          </p>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* DYNAMIC LINE CHART: DONATION TRAJECTORY & FINANCIAL ANALYTICS             */}
      {/* ========================================================================= */}
      <DashboardDonationChart donations={donations} />

      {/* Recent Registrations & Quick Actions Cluster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Registrations (2 cols) */}
        <div className="lg:col-span-2 bg-surface-container-lowest dark:bg-surface-container-low p-6 sm:p-8 rounded-xl shadow-xs border border-border">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-growth-green" />
              <span>
                {language === 'bn'
                  ? 'সাম্প্রতিক সদস্য নিবন্ধনসমূহ'
                  : 'Recent Member Registrations'}
              </span>
            </h2>
            <Link
              href="/dashboard/members"
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>
                {language === 'bn' ? 'সব সদস্য দেখুন' : 'View all members'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentRegistrations.length > 0 ? (
            <div className="divide-y divide-border">
              {recentRegistrations.map(member => (
                <div
                  key={member._id}
                  className="py-3.5 flex justify-between items-center hover:bg-surface-variant/30 rounded-lg px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-growth-green/10 text-growth-green flex items-center justify-center font-bold text-sm border border-growth-green/20 shrink-0">
                      {member.nameEn ? member.nameEn.charAt(0) : 'M'}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {language === 'bn'
                          ? member.nameBn || member.nameEn
                          : member.nameEn || member.nameBn}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {member.mobileNumber}{' '}
                        {member.bloodGroup
                          ? `• Blood: ${member.bloodGroup}`
                          : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        member.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : member.status === 'rejected'
                            ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}
                    >
                      {member.status === 'approved'
                        ? language === 'bn'
                          ? 'অনুমোদিত'
                          : 'Approved'
                        : member.status === 'rejected'
                          ? language === 'bn'
                            ? 'বাতিল'
                            : 'Rejected'
                          : language === 'bn'
                            ? 'পেন্ডিং'
                            : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant py-8 text-center">
              {language === 'bn'
                ? 'কোনো নতুন নিবন্ধন পাওয়া যায়নি।'
                : 'No recent registrations found.'}
            </p>
          )}
        </div>

        {/* Management Quick Shortcuts (1 col) */}
        <div className="bg-surface-container-lowest dark:bg-surface-container-low p-6 sm:p-8 rounded-xl shadow-xs border border-border flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-border flex items-center gap-2">
              <Sliders className="w-5 h-5 text-growth-green" />
              <span>
                {language === 'bn'
                  ? 'কন্ট্রোল প্যানেল শর্টকাট'
                  : 'Quick Management'}
              </span>
            </h2>
            <div className="space-y-2.5">
              <Link
                href="/dashboard/calculator"
                className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-purple-500/40 bg-surface dark:bg-background transition-all text-xs sm:text-sm font-bold text-foreground group shadow-2xs"
              >
                <span className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <span>
                    {language === 'bn'
                      ? 'আয়-ব্যয় হিসাব ও ক্যালকুলেটর'
                      : 'Financial Ledger & Calculator'}
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
              </Link>

              <Link
                href="/dashboard/donations"
                className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-red-500/40 bg-surface dark:bg-background transition-all text-xs sm:text-sm font-bold text-foreground group shadow-2xs"
              >
                <span className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-600">
                    <Heart className="w-4 h-4 fill-red-500" />
                  </div>
                  <span>
                    {language === 'bn'
                      ? 'অনুদান রেকর্ড ও তালিকা'
                      : 'Record Donation'}
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />
              </Link>

              <Link
                href="/dashboard/events"
                className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-growth-green/40 bg-surface dark:bg-background transition-all text-xs sm:text-sm font-bold text-foreground group shadow-2xs"
              >
                <span className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-growth-green/10 text-growth-green">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <span>
                    {language === 'bn'
                      ? 'নতুন ইভেন্ট তৈরি ও শিডিউল'
                      : 'Manage Events'}
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-growth-green" />
              </Link>

              <Link
                href="/dashboard/committee"
                className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-blue-500/40 bg-surface dark:bg-background transition-all text-xs sm:text-sm font-bold text-foreground group shadow-2xs"
              >
                <span className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>
                    {language === 'bn'
                      ? 'কমিটি ও উপদেষ্টা পর্ষদ'
                      : 'Manage Committee'}
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
              </Link>

              <Link
                href="/dashboard/content"
                className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-amber-500/40 bg-surface dark:bg-background transition-all text-xs sm:text-sm font-bold text-foreground group shadow-2xs"
              >
                <span className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>
                    {language === 'bn'
                      ? 'ওয়েবসাইট কন্টেন্ট এডিটর'
                      : 'Edit Page Content'}
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" />
              </Link>

              <Link
                href="/dashboard/media"
                className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-purple-500/40 bg-surface dark:bg-background transition-all text-xs sm:text-sm font-bold text-foreground group shadow-2xs"
              >
                <span className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span>
                    {language === 'bn'
                      ? 'মিডিয়া ও ছবি আপলোড'
                      : 'Media Library'}
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
              </Link>

              <Link
                href="/dashboard/settings"
                className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-growth-green/40 bg-surface dark:bg-background transition-all text-xs sm:text-sm font-bold text-foreground group shadow-2xs"
              >
                <span className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface-variant text-on-surface-variant">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span>
                    {language === 'bn'
                      ? 'লোগো ও প্ল্যাটফর্ম সেটিংস'
                      : 'Platform Settings'}
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-growth-green" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
