"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, HeartHandshake, Home, Info, Heart, Users, User, LayoutDashboard, LogOut, Phone, FileText, Calendar } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useLanguage } from "./language-provider";
import { TopDonationBanner } from "./top-donation-banner";

interface ICustomPageNav {
  slug: string;
  titleBn: string;
  titleEn: string;
  showInNavbar: boolean;
}

export function Navbar({ settings = {} }: { settings?: Record<string, string> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customPages, setCustomPages] = useState<ICustomPageNav[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logoUrl = settings["logo_url"] || "/logo.png";
  const rawBrandBn = settings["brand_name_bn"];
  const rawBrandEn = settings["brand_name_en"];

  const brandName = (language === "bn"
    ? (rawBrandBn && rawBrandBn !== "বীরখাল যুব সংগঠন" && rawBrandBn !== "বীরখাল যুব সমাজ কল্যাণ সংগঠন" ? rawBrandBn : "বীরখাল সমাজ কল্যাণ যুব সংগঠন")
    : (rawBrandEn && rawBrandEn !== "Birkhal Youth" && rawBrandEn !== "Birkhal Youth Social Welfare Organization" && rawBrandEn !== "Birkhal Youth Organization" ? rawBrandEn : "Birkhal Youth Welfare Organization")
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/auth/status");
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(data.isLoggedIn);
        }
      } catch (err) {
        console.error("Failed to check auth status", err);
      }
    };
    
    const fetchCustomNavPages = async () => {
      try {
        const res = await fetch("/api/pages?published=true");
        if (res.ok) {
          const data = await res.json();
          setCustomPages(data.filter((p: any) => p.showInNavbar));
        }
      } catch (err) {
        console.error("Failed to load nav custom pages", err);
      }
    };

    checkAuthStatus();
    fetchCustomNavPages();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  const getActiveClass = (path: string) => {
    return pathname === path
      ? "text-growth-green dark:text-primary-fixed-dim font-bold border-b-2 border-growth-green pb-1"
      : "text-on-surface-variant hover:text-growth-green transition-colors duration-200 font-semibold";
  };

  const getMobileActiveClass = (path: string) => {
    return pathname === path
      ? "flex items-center gap-3 bg-growth-green/10 text-growth-green px-4 py-2.5 font-bold rounded-lg"
      : "flex items-center gap-3 text-on-surface-variant hover:bg-surface-variant px-4 py-2.5 font-medium transition-all rounded-lg";
  };

  return (
    <>
      <header className="bg-surface-off-white/95 dark:bg-background/90 backdrop-blur-md shadow-xs top-0 z-50 sticky border-b border-border">
        {/* Top High-Visibility Donation Ticker */}
        <TopDonationBanner settings={settings} />

        <div className="flex justify-between items-center w-full px-4 sm:px-6 md:px-8 py-3 max-w-[1380px] mx-auto">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-growth-green hover:bg-growth-green/10 p-2 rounded-lg transition-colors cursor-pointer"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden shadow-xs border border-border group-hover:scale-105 transition-transform shrink-0">
                <Image 
                  src={logoUrl} 
                  alt={`${brandName} Logo`} 
                  fill
                  className="object-contain p-0.5" 
                  priority 
                  unoptimized={logoUrl.startsWith("data:")}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-base sm:text-lg font-extrabold text-growth-green tracking-tight leading-tight">
                  {brandName}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium tracking-wide">
                  {language === "bn" ? "চান্দিনা, কুমিল্লা | সমাজকল্যাণ ও যুব জাগরণ" : "Chandina, Cumilla | Social Welfare"}
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav Cluster */}
          <nav className="hidden lg:flex items-center gap-5 text-sm">
            <Link href="/" className={getActiveClass("/")}>
              {language === "bn" ? "হোম" : "Home"}
            </Link>

            {settings["nav_about_enabled"] !== "false" && (
              <Link href="/about" className={getActiveClass("/about")}>
                {language === "bn" ? "আমাদের পরিচিতি" : "About Us"}
              </Link>
            )}

            {settings["nav_donations_enabled"] !== "false" && (
              <Link 
                href="/donations" 
                className="font-bold text-xs bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <Heart className="w-3.5 h-3.5 fill-white animate-pulse" />
                <span>{language === "bn" ? "অনুদানের তালিকা" : "Donations"}</span>
              </Link>
            )}

            {settings["nav_registration_enabled"] !== "false" && (
              <Link href="/registration" className={getActiveClass("/registration")}>
                {language === "bn" ? "সদস্য ভর্তি" : "Registration"}
              </Link>
            )}

            {settings["nav_members_enabled"] !== "false" && (
              <Link href="/members" className={getActiveClass("/members")}>
                {language === "bn" ? "সদস্যবৃন্দ" : "Members"}
              </Link>
            )}

            <Link href="/events" className={getActiveClass("/events")}>
              {language === "bn" ? "ইভেন্ট ও কার্যক্রম" : "Events"}
            </Link>

            {/* Dynamic Custom Pages created from Dashboard */}
            {customPages.map((cp) => (
              <Link
                key={cp.slug}
                href={`/p/${cp.slug}`}
                className={getActiveClass(`/p/${cp.slug}`)}
              >
                {language === "bn" ? cp.titleBn : cp.titleEn}
              </Link>
            ))}

            {settings["nav_contact_enabled"] !== "false" && (
              <Link href="/contact" className={getActiveClass("/contact")}>
                {language === "bn" ? "যোগাযোগ" : "Contact"}
              </Link>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-border">
                <Link href="/dashboard" className="text-xs font-bold bg-growth-green/10 text-growth-green px-3 py-1.5 rounded-lg hover:bg-growth-green/20 transition-colors">
                  {language === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-600 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "লগআউট" : "Logout"}</span>
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-xs font-bold bg-surface-container hover:bg-surface-container-high border border-border px-3.5 py-1.5 rounded-lg text-foreground transition-all">
                {language === "bn" ? "লগইন" : "Login"}
              </Link>
            )}
          </nav>

          {/* Theme & Language Controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleLanguage}
              className="font-bold text-xs text-growth-green bg-growth-green/10 hover:bg-growth-green/20 px-3 py-1.5 rounded-lg transition-all border border-growth-green/20 cursor-pointer"
            >
              {language === "bn" ? "English" : "বাংলা"}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Drawer (Mobile & Tablet) */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 sm:w-80 z-50 p-6 bg-surface-container-lowest border-r border-border shadow-2xl transform transition-transform duration-300 lg:hidden flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <Image 
                src={logoUrl} 
                alt="Logo" 
                width={32} 
                height={32} 
                className="object-contain" 
                unoptimized={logoUrl.startsWith("data:")}
              />
              <span className="font-headline-md text-base font-bold text-growth-green">
                {brandName}
              </span>
            </div>
            <button
              className="text-on-surface-variant hover:text-foreground p-1.5 rounded-lg border border-border cursor-pointer"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 text-sm">
            <Link href="/" onClick={() => setIsOpen(false)} className={getMobileActiveClass("/")}>
              <Home className="w-4 h-4" />
              <span>{language === "bn" ? "হোম" : "Home"}</span>
            </Link>

            {settings["nav_about_enabled"] !== "false" && (
              <Link href="/about" onClick={() => setIsOpen(false)} className={getMobileActiveClass("/about")}>
                <Info className="w-4 h-4" />
                <span>{language === "bn" ? "আমাদের পরিচিতি" : "About Us"}</span>
              </Link>
            )}

            {settings["nav_donations_enabled"] !== "false" && (
              <Link href="/donations" onClick={() => setIsOpen(false)} className={getMobileActiveClass("/donations")}>
                <Heart className="w-4 h-4 text-red-500" />
                <span>{language === "bn" ? "অনুদানের তালিকা" : "Donations"}</span>
              </Link>
            )}

            {settings["nav_registration_enabled"] !== "false" && (
              <Link href="/registration" onClick={() => setIsOpen(false)} className={getMobileActiveClass("/registration")}>
                <HeartHandshake className="w-4 h-4 text-growth-green" />
                <span>{language === "bn" ? "সদস্য ভর্তি ফরম" : "Registration"}</span>
              </Link>
            )}

            {settings["nav_members_enabled"] !== "false" && (
              <Link href="/members" onClick={() => setIsOpen(false)} className={getMobileActiveClass("/members")}>
                <Users className="w-4 h-4" />
                <span>{language === "bn" ? "সদস্যবৃন্দ" : "Members"}</span>
              </Link>
            )}

            <Link href="/events" onClick={() => setIsOpen(false)} className={getMobileActiveClass("/events")}>
              <Calendar className="w-4 h-4 text-growth-green" />
              <span>{language === "bn" ? "ইভেন্ট ও কার্যক্রম" : "Events"}</span>
            </Link>

            {customPages.map((cp) => (
              <Link
                key={cp.slug}
                href={`/p/${cp.slug}`}
                onClick={() => setIsOpen(false)}
                className={getMobileActiveClass(`/p/${cp.slug}`)}
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span>{language === "bn" ? cp.titleBn : cp.titleEn}</span>
              </Link>
            ))}

            {settings["nav_contact_enabled"] !== "false" && (
              <Link href="/contact" onClick={() => setIsOpen(false)} className={getMobileActiveClass("/contact")}>
                <Phone className="w-4 h-4" />
                <span>{language === "bn" ? "যোগাযোগ" : "Contact"}</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="pt-4 border-t border-border space-y-2">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 bg-growth-green/10 text-growth-green px-4 py-2.5 rounded-lg font-bold text-xs">
                <LayoutDashboard className="w-4 h-4" />
                <span>{language === "bn" ? "এডমিন ড্যাশবোর্ড" : "Admin Dashboard"}</span>
              </Link>
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="flex items-center gap-2.5 text-red-600 px-4 py-2.5 rounded-lg font-bold text-xs w-full text-left cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === "bn" ? "লগআউট" : "Logout"}</span>
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 bg-growth-green text-white px-4 py-2.5 rounded-lg font-bold text-xs text-center shadow-sm">
              <User className="w-4 h-4" />
              <span>{language === "bn" ? "এডমিন লগইন" : "Admin Login"}</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
