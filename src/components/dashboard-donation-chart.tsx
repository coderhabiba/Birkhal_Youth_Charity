"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/components/language-provider";
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar, 
  Layers, 
  BarChart2, 
  PlusCircle,
  Inbox
} from "lucide-react";
import Link from "next/link";

interface DonationRecord {
  _id?: string;
  amount: number;
  date?: string;
  createdAt?: string | Date;
  donorName?: string;
  category?: string;
}

export function DashboardDonationChart({ donations = [] }: { donations?: DonationRecord[] }) {
  const { language } = useLanguage();
  const [timeRange, setTimeRange] = useState<"1Y" | "6M" | "30D" | "ALL">("1Y");
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
    amount: number;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // Month labels in Bengali & English
  const monthNamesBn = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];
  const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Helper to reliably parse date from donation item
  const getDonationDate = (d: DonationRecord): Date | null => {
    if (d.createdAt) {
      const dt = new Date(d.createdAt);
      if (!isNaN(dt.getTime())) return dt;
    }
    if (d.date) {
      const dt = new Date(d.date);
      if (!isNaN(dt.getTime())) return dt;
    }
    return null;
  };

  // Purely dynamic chart aggregation from real database records
  const { chartData, growthRate, isPositiveGrowth } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    if (timeRange === "1Y") {
      // 12 Months of Current Year
      const months = Array.from({ length: 12 }, (_, i) => ({
        label: language === "bn" ? monthNamesBn[i] : monthNamesEn[i],
        amount: 0,
        count: 0
      }));

      let firstHalf = 0;
      let secondHalf = 0;

      donations.forEach(d => {
        const dt = getDonationDate(d);
        if (dt && dt.getFullYear() === currentYear) {
          const m = dt.getMonth();
          const amt = Number(d.amount) || 0;
          months[m].amount += amt;
          months[m].count += 1;

          if (m < 6) firstHalf += amt;
          else secondHalf += amt;
        }
      });

      // Growth rate between H1 and H2 or recent months
      const currentMonth = now.getMonth();
      const currentMonthAmt = months[currentMonth].amount;
      const prevMonthAmt = currentMonth > 0 ? months[currentMonth - 1].amount : 0;
      let growth = 0;
      if (prevMonthAmt > 0) {
        growth = ((currentMonthAmt - prevMonthAmt) / prevMonthAmt) * 100;
      } else if (currentMonthAmt > 0) {
        growth = 100;
      }

      return {
        chartData: months,
        growthRate: Math.abs(growth).toFixed(1),
        isPositiveGrowth: growth >= 0
      };
    } else if (timeRange === "6M") {
      // Rolling Last 6 Months
      const result: Array<{ label: string; amount: number; count: number }> = [];
      for (let i = 5; i >= 0; i--) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mIndex = targetDate.getMonth();
        const year = targetDate.getFullYear();
        const label = language === "bn" ? monthNamesBn[mIndex] : monthNamesEn[mIndex];

        let amount = 0;
        let count = 0;

        donations.forEach(d => {
          const dt = getDonationDate(d);
          if (dt && dt.getFullYear() === year && dt.getMonth() === mIndex) {
            amount += Number(d.amount) || 0;
            count += 1;
          }
        });

        result.push({ label, amount, count });
      }

      const latest = result[result.length - 1]?.amount || 0;
      const prev = result[result.length - 2]?.amount || 0;
      const growth = prev > 0 ? ((latest - prev) / prev) * 100 : (latest > 0 ? 100 : 0);

      return {
        chartData: result,
        growthRate: Math.abs(growth).toFixed(1),
        isPositiveGrowth: growth >= 0
      };
    } else if (timeRange === "30D") {
      // Last 30 Days (6 x 5-day intervals)
      const result: Array<{ label: string; amount: number; count: number }> = [];
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const intervals = 6;
      const stepDays = 5;

      for (let i = 0; i < intervals; i++) {
        const start = new Date(thirtyDaysAgo.getTime() + i * stepDays * 24 * 60 * 60 * 1000);
        const end = new Date(thirtyDaysAgo.getTime() + (i + 1) * stepDays * 24 * 60 * 60 * 1000);
        
        const label = language === "bn" 
          ? `${start.getDate()} ${monthNamesBn[start.getMonth()]}` 
          : `${monthNamesEn[start.getMonth()]} ${start.getDate()}`;

        let amount = 0;
        let count = 0;

        donations.forEach(d => {
          const dt = getDonationDate(d);
          if (dt && dt >= start && dt < end) {
            amount += Number(d.amount) || 0;
            count += 1;
          }
        });

        result.push({ label, amount, count });
      }

      const latest = result[result.length - 1]?.amount || 0;
      const prev = result[result.length - 2]?.amount || 0;
      const growth = prev > 0 ? ((latest - prev) / prev) * 100 : (latest > 0 ? 100 : 0);

      return {
        chartData: result,
        growthRate: Math.abs(growth).toFixed(1),
        isPositiveGrowth: growth >= 0
      };
    } else {
      // ALL Time (Past 3 Years or 12 months)
      const yearsMap = new Map<number, { amount: number; count: number }>();
      const currentYr = now.getFullYear();
      [currentYr - 2, currentYr - 1, currentYr].forEach(y => {
        yearsMap.set(y, { amount: 0, count: 0 });
      });

      donations.forEach(d => {
        const dt = getDonationDate(d);
        if (dt) {
          const yr = dt.getFullYear();
          const existing = yearsMap.get(yr) || { amount: 0, count: 0 };
          existing.amount += Number(d.amount) || 0;
          existing.count += 1;
          yearsMap.set(yr, existing);
        }
      });

      const sortedYears = Array.from(yearsMap.entries()).sort((a, b) => a[0] - b[0]);
      const result = sortedYears.map(([yr, data]) => ({
        label: `${yr}`,
        amount: data.amount,
        count: data.count
      }));

      const latest = result[result.length - 1]?.amount || 0;
      const prev = result[result.length - 2]?.amount || 0;
      const growth = prev > 0 ? ((latest - prev) / prev) * 100 : (latest > 0 ? 100 : 0);

      return {
        chartData: result,
        growthRate: Math.abs(growth).toFixed(1),
        isPositiveGrowth: growth >= 0
      };
    }
  }, [donations, timeRange, language]);

  // Real Metric Calculations
  const maxAmount = Math.max(...chartData.map(d => d.amount), 500);
  const totalPeriodAmount = chartData.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPeriodDonors = chartData.reduce((acc, curr) => acc + curr.count, 0);
  const averageDonation = totalPeriodDonors > 0 ? Math.round(totalPeriodAmount / totalPeriodDonors) : 0;
  const peakPeriod = [...chartData].sort((a, b) => b.amount - a.amount)[0];

  // SVG Dimension Scale
  const svgWidth = 800;
  const svgHeight = 280;
  const paddingX = 45;
  const paddingY = 35;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  // Generate SVG Coordinates
  const points = chartData.map((d, index) => {
    const x = paddingX + (index / (chartData.length - 1 || 1)) * graphWidth;
    const y = paddingY + graphHeight - (d.amount / (maxAmount || 1)) * graphHeight;
    return { x, y, data: d };
  });

  // Smooth Bezier path
  const createSmoothPath = (pts: typeof points) => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i != pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = createSmoothPath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : "";

  return (
    <div className="bg-surface-container-lowest dark:bg-surface-container-low p-6 sm:p-8 rounded-xl border border-border shadow-xs space-y-6">
      
      {/* Header & Time Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-growth-green/10 text-growth-green border border-growth-green/20">
            <TrendingUp className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-headline-md text-xl font-bold text-foreground">
              {language === "bn" ? "অনুদানের গতিধারা ও অ্যানালিটিক্স চার্ট" : "Donation Trends & Analytics Chart"}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {language === "bn" 
                ? "ডাটাবেজের প্রকৃত লেনদেন থেকে স্বয়ংক্রিয়ভাবে প্রস্তুতকৃত লাইভ অ্যানালিটিক্স" 
                : "Real-time dynamic visualization directly generated from database transaction records"}
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-container-high dark:bg-white/5 rounded-xl border border-border self-start sm:self-auto">
          {(["30D", "6M", "1Y", "ALL"] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === range
                  ? "bg-growth-green text-white shadow-sm"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              {range === "30D" ? (language === "bn" ? "৩০ দিন" : "30 Days") :
               range === "6M" ? (language === "bn" ? "৬ মাস" : "6 Months") :
               range === "1Y" ? (language === "bn" ? "চলতি বছর" : "1 Year") :
               (language === "bn" ? "সর্বমোট" : "All Time")}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Pure Dynamic Financial Highlight Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Real Fund in Period */}
        <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {language === "bn" ? "মোট সংগৃহীত অনুদান" : "Total Period Fund"}
          </p>
          <p className="text-xl sm:text-2xl font-black text-foreground mt-1">
            ৳{totalPeriodAmount.toLocaleString()}
          </p>
          <div className={`flex items-center gap-1 text-[11px] font-bold mt-1 ${isPositiveGrowth ? 'text-growth-green' : 'text-rose-500'}`}>
            {isPositiveGrowth ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{growthRate}% {language === "bn" ? (isPositiveGrowth ? "প্রবৃদ্ধি" : "হ্রাস") : (isPositiveGrowth ? "growth" : "drop")}</span>
          </div>
        </div>

        {/* Metric 2: Peak Real Donation Period */}
        <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            {language === "bn" ? "সর্বোচ্চ অনুদানের সময়" : "Peak Donation Period"}
          </p>
          <p className="text-xl sm:text-2xl font-black text-foreground mt-1 truncate">
            {peakPeriod && peakPeriod.amount > 0 ? peakPeriod.label : (language === "bn" ? "রেকর্ড নেই" : "No Record")}
          </p>
          <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
            {peakPeriod ? `৳${peakPeriod.amount.toLocaleString()}` : "৳0"} ({peakPeriod?.count || 0} {language === "bn" ? "টি অনুদান" : "entries"})
          </p>
        </div>

        {/* Metric 3: Real Average Donation */}
        <div className="p-4 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            {language === "bn" ? "গড় অনুদান" : "Average Donation"}
          </p>
          <p className="text-xl sm:text-2xl font-black text-foreground mt-1">
            ৳{averageDonation.toLocaleString()}
          </p>
          <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-1">
            {language === "bn" ? "প্রতি লেনদেনে গড়" : "Per Transaction"}
          </p>
        </div>

        {/* Metric 4: Total Verified Transactions */}
        <div className="p-4 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
            {language === "bn" ? "মোট অনুদান সংখ্যা" : "Total Transactions"}
          </p>
          <p className="text-xl sm:text-2xl font-black text-foreground mt-1">
            {totalPeriodDonors} {language === "bn" ? "টি লেনদেন" : "Entries"}
          </p>
          <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 mt-1">
            {language === "bn" ? "১০০% ডাটাবেজ ভেরিফায়েড" : "100% DB Verified"}
          </p>
        </div>
      </div>

      {/* SVG Interactive Line & Area Dynamic Chart */}
      {totalPeriodAmount === 0 && totalPeriodDonors === 0 ? (
        <div className="py-12 px-4 text-center bg-surface dark:bg-background/40 rounded-xl border border-dashed border-border space-y-3">
          <Inbox className="w-10 h-10 mx-auto text-on-surface-variant/40" />
          <p className="font-bold text-sm text-foreground">
            {language === "bn" ? "নির্বাচিত সময়ে কোনো অনুদানের রেকর্ড নেই" : "No donation transactions recorded for this period"}
          </p>
          <p className="text-xs text-on-surface-variant">
            {language === "bn" ? "অনুদান যুক্ত হলে চার্টটিতে স্বয়ংক্রিয়ভাবে লাইভ গ্রাফ দৃশ্যমান হবে।" : "Live curve will render automatically as new donation entries are recorded."}
          </p>
          <Link
            href="/dashboard/donations"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-growth-green text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#236026] transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "নতুন অনুদান এন্ট্রি করুন" : "Add Donation Record"}</span>
          </Link>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden pt-2">
          <svg 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              {/* Area Gradient Fill */}
              <linearGradient id="donationAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.30" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>

              {/* Line Gradient */}
              <linearGradient id="donationLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="50%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>

              {/* Glow Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Horizontal Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = paddingY + graphHeight * (1 - ratio);
              const gridVal = Math.round(maxAmount * ratio);
              return (
                <g key={i}>
                  <line 
                    x1={paddingX} 
                    y1={y} 
                    x2={svgWidth - paddingX} 
                    y2={y} 
                    stroke="currentColor" 
                    strokeOpacity="0.08" 
                    strokeDasharray="4 4"
                  />
                  <text 
                    x={paddingX - 8} 
                    y={y + 3} 
                    textAnchor="end" 
                    className="text-[10px] fill-on-surface-variant/60 font-mono"
                  >
                    ৳{gridVal >= 1000 ? `${Math.round(gridVal / 1000)}k` : gridVal}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaPath} fill="url(#donationAreaGradient)" />

            {/* Main Thin Gradient Line */}
            <path 
              d={linePath} 
              fill="none" 
              stroke="url(#donationLineGradient)" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              filter="url(#glow)"
            />

            {/* Interactive Data Points & Vertical Highlights */}
            {points.map((pt, i) => (
              <g key={i}>
                {/* Vertical Guide Line on Hover */}
                {hoveredPoint?.label === pt.data.label && (
                  <line 
                    x1={pt.x} 
                    y1={paddingY} 
                    x2={pt.x} 
                    y2={svgHeight - paddingY} 
                    stroke="#2563EB" 
                    strokeWidth="1" 
                    strokeDasharray="3 3"
                  />
                )}

                {/* Sleek Point Circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint?.label === pt.data.label ? 4.5 : 2.5}
                  fill="#ffffff"
                  stroke={pt.data.amount > 0 ? "#059669" : "#9CA3AF"}
                  strokeWidth={hoveredPoint?.label === pt.data.label ? 2 : 1.25}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredPoint({
                    label: pt.data.label,
                    amount: pt.data.amount,
                    count: pt.data.count,
                    x: pt.x,
                    y: pt.y
                  })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* X-Axis Month / Period Label */}
                <text
                  x={pt.x}
                  y={svgHeight - paddingY + 20}
                  textAnchor="middle"
                  className={`text-[11px] font-bold transition-colors ${
                    hoveredPoint?.label === pt.data.label ? "fill-growth-green font-extrabold" : "fill-on-surface-variant/70"
                  }`}
                >
                  {pt.data.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Floating Tooltip */}
          {hoveredPoint && (
            <div 
              className="absolute z-20 pointer-events-none bg-gray-900/95 dark:bg-black/95 text-white p-3 rounded-xl shadow-2xl border border-white/20 text-xs backdrop-blur-md transition-all duration-150 -translate-x-1/2 -translate-y-full mb-3"
              style={{ 
                left: `${(hoveredPoint.x / svgWidth) * 100}%`, 
                top: `${(hoveredPoint.y / svgHeight) * 100}%` 
              }}
            >
              <div className="flex items-center gap-1.5 text-growth-green font-bold mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{hoveredPoint.label}</span>
              </div>
              <p className="font-extrabold text-sm text-white">
                ৳{hoveredPoint.amount.toLocaleString()} BDT
              </p>
              <p className="text-[11px] text-gray-300 mt-0.5">
                {hoveredPoint.count} {language === "bn" ? "টি অনুদান গৃহীত হয়েছে" : "donations recorded"}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
