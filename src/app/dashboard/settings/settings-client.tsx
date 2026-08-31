"use client";

import { useLanguage } from "@/components/language-provider";
import { Save, Globe, Phone, Share2, Check, Loader2, Image as ImageIcon, Upload, Trash2, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ConfirmModal, AlertModal } from "@/components/confirm-modal";

export function DashboardSettingsClient({ settingsData }: { settingsData: any }) {
  const { language } = useLanguage();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    org_name: settingsData['org_name'] || "Birkhal Youth Social Welfare Organization",
    logo_url: settingsData['logo_url'] || "/logo.png",
    tagline_en: settingsData['tagline_en'] || "Empowering the Next Generation of Leaders",
    tagline_bn: settingsData['tagline_bn'] || "পরবর্তী প্রজন্মের নেতাদের ক্ষমতায়ন",
    contact_email: settingsData['contact_email'] || "birkhal.youth.org@gmail.com",
    contact_phone: settingsData['contact_phone'] || "01882447721",
    contact_address: settingsData['contact_address'] || "District: Cumilla\nUpazila: Chandina\nPost: Kaduti Bazar",
    social_facebook: settingsData['social_facebook'] || "https://facebook.com/birkhalyouth",
    social_youtube: settingsData['social_youtube'] || "",
    social_instagram: settingsData['social_instagram'] || "",
    social_x: settingsData['social_x'] || settingsData['social_twitter'] || "",
    social_twitter: settingsData['social_x'] || settingsData['social_twitter'] || "",
    social_tiktok: settingsData['social_tiktok'] || "",
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo_url: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    const payload = Object.keys(formData).map((key) => ({
      key,
      value: (formData as any)[key],
      category: key.startsWith("social_") ? "social" : key.startsWith("contact_") ? "contact" : "general",
    }));

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMessage(language === "bn" ? "সেটিংস ও লোগো সফলভাবে সংরক্ষিত হয়েছে!" : "Settings and logo saved successfully!");
        router.refresh();
      } else {
        setErrorMessage(language === "bn" ? "সেটিংস সংরক্ষণ করা সম্ভব হয়নি।" : "Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(language === "bn" ? "সেটিংস সংরক্ষণের সময় ত্রুটি ঘটেছে।" : "Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-foreground mb-1">
            {language === "bn" ? "প্ল্যাটফর্ম সেটিংস ও ব্র্যান্ডিং" : "Platform Settings & Branding"}
          </h2>
          <p className="font-body-lg text-on-surface-variant">
            {language === "bn"
              ? "সংস্থার লোগো, প্রাতিষ্ঠানিক তথ্য, ঠিকানা এবং সোশ্যাল মিডিয়া লিঙ্কসমূহ পরিচালনা করুন।"
              : "Manage organization logo, official contacts, brand details, and social links."}
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-growth-green hover:bg-[#236026] text-white font-label-md px-6 py-2.5 flex items-center gap-2 shadow-sm transition-all cursor-pointer font-bold disabled:opacity-50 rounded-xl"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving 
            ? (language === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") 
            : (language === "bn" ? "পরিবর্তন সংরক্ষণ করুন" : "Save Changes")}
        </button>
      </div>

      {successMessage && (
        <div className="bg-growth-green/10 border border-growth-green/30 text-growth-green p-4 flex items-center gap-2 text-sm font-bold animate-fade-in rounded-xl">
          <Check className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* General & Contact Settings */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Logo Upload Section */}
          <div className="bg-surface-container-low dark:bg-surface-container-lowest p-6 shadow-sm border border-border space-y-4 rounded-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-5 h-5 text-growth-green" />
                <h3 className="font-headline-md text-lg font-bold text-foreground">
                  {language === "bn" ? "ওয়েবসাইট লোগো (Brand Logo)" : "Website Brand Logo"}
                </h3>
              </div>
              {formData.logo_url && (
                <span className="text-[11px] text-growth-green font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {language === "bn" ? "সক্রিয় লোগো" : "Active Logo"}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-center">
              <div className="relative w-24 h-24 bg-surface dark:bg-background border border-border p-2 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden rounded-xl">
                {formData.logo_url ? (
                  <Image 
                    src={formData.logo_url} 
                    alt="Logo Preview" 
                    width={80} 
                    height={80} 
                    className="object-contain max-h-full rounded-lg"
                    unoptimized={formData.logo_url.startsWith("data:")}
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 opacity-30" />
                )}
              </div>

              <div className="space-y-2 flex-grow w-full">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-surface hover:bg-surface-container-high dark:bg-surface-container border border-border text-foreground px-4 py-2 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs cursor-pointer rounded-xl"
                  >
                    <Upload className="w-3.5 h-3.5 text-growth-green" />
                    <span>{language === "bn" ? "কম্পিউটার থেকে লোগো আপলোড" : "Upload Logo from PC"}</span>
                  </button>

                  {formData.logo_url && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logo_url: "/logo.png" }))}
                      className="p-2 text-on-surface-variant hover:text-red-500 text-xs font-bold flex items-center gap-1 border border-border px-3 py-2 cursor-pointer rounded-xl hover:bg-surface-variant"
                      title="Reset to default logo"
                    >
                      <span>{language === "bn" ? "রিসেট" : "Reset"}</span>
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />

                <input
                  type="text"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleChange}
                  placeholder="or direct logo URL e.g. /logo.png"
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground focus:border-growth-green outline-none font-mono rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low dark:bg-surface-container-lowest p-6 shadow-sm border border-border rounded-xl">
            <div className="flex items-center gap-2.5 mb-5 border-b border-border pb-3">
              <Globe className="w-5 h-5 text-reliability-blue" />
              <h3 className="font-headline-md text-lg font-bold text-foreground">
                {language === "bn" ? "সাধারণ তথ্য" : "General Information"}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {language === "bn" ? "সংস্থার নাম" : "Organization Name"}
                </label>
                <input
                  type="text"
                  name="org_name"
                  value={formData.org_name}
                  onChange={handleChange}
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {language === "bn" ? "স্লোগান (ইংরেজি)" : "Tagline (English)"}
                  </label>
                  <input
                    type="text"
                    name="tagline_en"
                    value={formData.tagline_en}
                    onChange={handleChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {language === "bn" ? "স্লোগান (বাংলা)" : "Tagline (Bengali)"}
                  </label>
                  <input
                    type="text"
                    name="tagline_bn"
                    value={formData.tagline_bn}
                    onChange={handleChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low dark:bg-surface-container-lowest p-6 shadow-sm border border-border rounded-xl">
            <div className="flex items-center gap-2.5 mb-5 border-b border-border pb-3">
              <Phone className="w-5 h-5 text-growth-green" />
              <h3 className="font-headline-md text-lg font-bold text-foreground">
                {language === "bn" ? "যোগাযোগের তথ্য" : "Contact Details"}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {language === "bn" ? "ইমেইল ঠিকানা" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {language === "bn" ? "ফোন নম্বর" : "Phone Number"}
                  </label>
                  <input
                    type="text"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {language === "bn" ? "অফিসের ঠিকানা" : "Office Address"}
                </label>
                <textarea
                  rows={3}
                  name="contact_address"
                  value={formData.contact_address}
                  onChange={handleChange}
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low dark:bg-surface-container-lowest p-6 shadow-sm border border-border rounded-xl">
            <div className="flex items-center gap-2.5 mb-5 border-b border-border pb-3">
              <Share2 className="w-5 h-5 text-impact-orange" />
              <h3 className="font-headline-md text-lg font-bold text-foreground">
                {language === "bn" ? "সোশ্যাল লিঙ্কসমূহ" : "Social Links"}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {language === "bn" ? "ফেসবুক লিঙ্ক (Facebook)" : "Facebook URL"}
                </label>
                <input
                  type="url"
                  name="social_facebook"
                  value={formData.social_facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {language === "bn" ? "ইউটিউব চ্যানেল (YouTube)" : "YouTube Channel"}
                </label>
                <input
                  type="url"
                  name="social_youtube"
                  value={formData.social_youtube}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {language === "bn" ? "ইনস্টাগ্রাম লিংক (Instagram)" : "Instagram URL"}
                </label>
                <input
                  type="url"
                  name="social_instagram"
                  value={formData.social_instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {language === "bn" ? "টুইটার / এক্স লিংক (Twitter / X)" : "Twitter / X URL"}
                </label>
                <input
                  type="url"
                  name="social_x"
                  value={formData.social_x}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      social_x: e.target.value,
                      social_twitter: e.target.value,
                    }));
                  }}
                  placeholder="https://x.com/..."
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {language === "bn" ? "টিকটক লিংক (TikTok)" : "TikTok URL"}
                </label>
                <input
                  type="url"
                  name="social_tiktok"
                  value={formData.social_tiktok}
                  onChange={handleChange}
                  placeholder="https://tiktok.com/@..."
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Feedback Alert Modals */}
      <AlertModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage("")}
        title={language === "bn" ? "সফলভাবে সংরক্ষিত" : "Settings Saved"}
        message={successMessage}
        type="success"
      />

      <AlertModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage("")}
        title={language === "bn" ? "ত্রুটি ঘটেছে" : "Error"}
        message={errorMessage}
        type="error"
      />
    </form>
  );
}
