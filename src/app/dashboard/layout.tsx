"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  FileText,
  Image as ImageIcon,
  Calendar,
  UserCog,
  CircleDollarSign,
  Activity,
  Shield,
  MessageSquare,
  Menu,
  X,
  Layers
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, labelBn: "ওভারভিউ", labelEn: "Overview" },
    { href: "/dashboard/pages", icon: Layers, labelBn: "পেজ বিল্ডার (CMS)", labelEn: "Custom Pages" },
    { href: "/dashboard/members", icon: Users, labelBn: "সদস্যবৃন্দ", labelEn: "Members" },
    { href: "/dashboard/committee", icon: UserCog, labelBn: "কমিটি", labelEn: "Committee" },
    { href: "/dashboard/events", icon: Calendar, labelBn: "ইভেন্ট", labelEn: "Events" },
    { href: "/dashboard/content", icon: FileText, labelBn: "হোম কন্টেন্ট", labelEn: "Page Content" },
    { href: "/dashboard/media", icon: ImageIcon, labelBn: "মিডিয়া গ্যালারি", labelEn: "Media Library" },
    { href: "/dashboard/donations", icon: CircleDollarSign, labelBn: "অনুদান", labelEn: "Donations" },
    { href: "/dashboard/reviews", icon: MessageSquare, labelBn: "রিভিউ / মতামত", labelEn: "Reviews" },
    { href: "/dashboard/activity", icon: Activity, labelBn: "অ্যাক্টিভিটি লগ", labelEn: "Activity Log" },
    { href: "/dashboard/roles", icon: Shield, labelBn: "রোলস", labelEn: "Roles" },
    { href: "/dashboard/settings", icon: Settings, labelBn: "সেটিংস", labelEn: "Settings" },
  ];

  return (
    <div className="bg-transparent text-foreground font-body-lg flex flex-col min-h-screen antialiased">
      {/* Mobile Drawer Trigger Bar */}
      <div className="md:hidden flex items-center justify-between p-3.5 bg-surface-container-low dark:bg-surface-container-lowest border-b border-border z-30 sticky top-[80px]">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 border border-border bg-surface dark:bg-background text-foreground flex items-center gap-2 font-bold text-xs cursor-pointer shadow-xs rounded-xl"
        >
          {mobileNavOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
          <span>
            {language === 'bn' ? 'ড্যাশবোর্ড মেনু' : 'Dashboard Menu'}
          </span>
        </button>
        <span className="font-bold text-xs px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
          Admin Console
        </span>
      </div>

      <div className="flex flex-1 relative">
        {/* Mobile Navigation Backdrop */}
        {mobileNavOpen && (
          <div
            onClick={() => setMobileNavOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          />
        )}

        {/* SideNavBar - Proper z-index & positioning below header */}
        <aside
          className={`fixed left-0 top-0 h-screen flex-col px-4 pb-4 pt-[140px] border-r border-border bg-surface-container-low dark:bg-surface-container-lowest w-64 shadow-sm z-40 md:z-30 overflow-y-auto transition-transform duration-300 ${
            mobileNavOpen
              ? 'translate-x-0 flex'
              : '-translate-x-full md:translate-x-0 md:flex'
          }`}
        >
          <div className="mb-5 px-3 flex items-center gap-3">
            <div className="w-9 h-9 overflow-hidden relative shrink-0 rounded-xl">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-growth-green leading-tight">
                Birkhal Youth Social Welfare Organization
              </h2>
              <p className="text-[11px] text-on-surface-variant font-medium">
                {language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Console'}
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2 font-bold text-xs transition-all border rounded-xl ${
                    isActive
                      ? 'bg-growth-green text-white border-growth-green shadow-xs'
                      : 'text-on-surface-variant border-transparent hover:bg-surface-variant/80 dark:hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />{' '}
                  {language === 'bn' ? item.labelBn : item.labelEn}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 pt-3 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-xs transition-all border border-transparent hover:border-red-200 cursor-pointer rounded-xl"
            >
              <LogOut className="w-4 h-4" />{' '}
              {language === 'bn' ? 'লগআউট' : 'Logout'}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0 bg-surface-off-white dark:bg-background min-h-[calc(100vh-86px)] overflow-x-hidden md:ml-64">
          <div className="max-w-[1380px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
