import type { Metadata } from "next";
import { Hind_Siliguri, Raleway } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { Navbar } from "@/components/navbar";
import { FloatingDonationButton } from "@/components/floating-donation-button";
import { SocialChatButtons } from "@/components/social-chat-buttons";
import connectToDatabase from "@/lib/mongodb";
import Setting from "@/models/Setting";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Birkhal Social Welfare Youth Organization",
  description: "Official Charity & Youth Welfare Portal for Birkhal, Chandina, Cumilla",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settingsMap: Record<string, string> = {};
  try {
    await connectToDatabase();

    // Auto-update legacy brand names in database if present
    try {
      await Setting.updateMany(
        { key: "brand_name_bn", value: { $in: ["বীরখাল যুব সংগঠন", "বীরখাল যুব সমাজ কল্যাণ সংগঠন"] } },
        { value: "বীরখাল সমাজ কল্যাণ যুব সংগঠন" }
      );
      await Setting.updateMany(
        { key: "brand_name_en", value: { $in: ["Birkhal Youth", "Birkhal Youth Organization", "Birkhal Youth Social Welfare Organization"] } },
        { value: "Birkhal Youth Welfare Organization" }
      );
    } catch (e) {}

    const rawSettings = await Setting.find().lean();
    rawSettings.forEach((s: any) => {
      settingsMap[s.key] = s.value;
    });

    if (!settingsMap["brand_name_bn"] || settingsMap["brand_name_bn"] === "বীরখাল যুব সংগঠন" || settingsMap["brand_name_bn"] === "বীরখাল যুব সমাজ কল্যাণ সংগঠন") {
      settingsMap["brand_name_bn"] = "বীরখাল সমাজ কল্যাণ যুব সংগঠন";
    }
    if (!settingsMap["brand_name_en"] || settingsMap["brand_name_en"] === "Birkhal Youth" || settingsMap["brand_name_en"] === "Birkhal Youth Social Welfare Organization" || settingsMap["brand_name_en"] === "Birkhal Youth Organization") {
      settingsMap["brand_name_en"] = "Birkhal Youth Welfare Organization";
    }
  } catch (err) {
    console.error("Failed to load settings in RootLayout", err);
  }

  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={`${hindSiliguri.variable} ${raleway.variable} antialiased min-h-screen bg-background text-foreground transition-colors duration-300 relative`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            {/* Unified Navigation Header with Sticky Donation Bar */}
            <Navbar settings={settingsMap} />
            
            {/* Main Application Pages */}
            <main className="min-h-screen">
              {children}
            </main>

            {/* Floating 1-Click WhatsApp & Messenger Chat Actions */}
            <SocialChatButtons settings={settingsMap} />

            {/* Persistent Eye-Catching Floating Donation Button */}
            <FloatingDonationButton settings={settingsMap} />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
