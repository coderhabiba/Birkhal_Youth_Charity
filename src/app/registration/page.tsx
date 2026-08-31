"use client";

import { useLanguage } from "@/components/language-provider";
import { useState } from "react";
import { HeartHandshake, Upload, CheckCircle2, AlertCircle, ShieldCheck, Award, FileCheck2, UserCheck, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { MembershipRulesModal } from "@/components/membership-rules-modal";

export default function RegistrationPage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showRulesModal, setShowRulesModal] = useState(true);

  const [photoUrl, setPhotoUrl] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit to 2MB
        setError(language === "bn" ? "ছবির সাইজ ২ এমবি এর নিচে হতে হবে।" : "Image size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Add base64 photo to payload
    if (photoUrl) {
      data.photoUrl = photoUrl;
    }

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to submit application");
      }

      setSuccess(true);
      setPhotoUrl("");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow w-full max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
      
      {/* Header Banner */}
      <div className="mb-10 text-center md:text-left max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-growth-green/10 text-growth-green font-bold text-xs mb-3 border border-growth-green/20 rounded-xl">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>{language === "bn" ? "সদস্যপদ গ্রহণ প্রক্রিয়া ২০২৬" : "Membership Enrollment 2026"}</span>
        </div>
        <h1 className="font-headline-xl text-3xl md:text-5xl font-bold text-foreground tracking-tight">
          {language === "bn" ? "বীরখাল সমাজ কল্যাণ যুব সংগঠন" : "Birkhal Youth Organization"}
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mt-2 text-base">
          {language === "bn"
            ? "যুব জাগরণ, মানবসেবা ও সমাজ উন্নয়নে বীরখাল সমাজ কল্যাণ যুব সংগঠনের সম্মানিত সদস্য হতে আবেদন করুন।"
            : "Join our dedicated team of volunteers and leaders driving transparent community progress in Cumilla."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Organization & Guidelines Info Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low dark:bg-surface-container-lowest p-6 md:p-8 border border-border shadow-sm text-center rounded-xl">
            <div className="flex justify-center mb-4">
              <Image 
                src="/logo.png" 
                alt="Birkhal Youth Logo" 
                width={84} 
                height={84} 
                className="object-contain drop-shadow-md" 
                priority
              />
            </div>
            <h3 className="font-headline-md text-xl font-bold text-growth-green mb-1">
              {language === "bn" ? "বীরখাল যুব সংগঠন" : "Birkhal Youth"}
            </h3>
            <p className="text-xs text-on-surface-variant mb-6">
              {language === "bn" ? "একটি আদর্শ ও মানবিক সমাজ গঠনের প্রত্যয়ে" : "Committed to humanity & sustainable youth development"}
            </p>

            <div className="space-y-4 text-left pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-growth-green/10 flex items-center justify-center shrink-0 text-growth-green mt-0.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground">{language === "bn" ? "১০০% স্বচ্ছতা ও ঐক্য" : "100% Transparency"}</h4>
                  <p className="text-[11px] text-on-surface-variant">{language === "bn" ? "সকল কাজে সততা ও সমতার প্রতিফলন" : "Total integrity in funds & relief actions"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-growth-green/10 flex items-center justify-center shrink-0 text-growth-green mt-0.5 rounded-lg">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground">{language === "bn" ? "সদস্যপদ সুবিধা" : "Member Privileges"}</h4>
                  <p className="text-[11px] text-on-surface-variant">{language === "bn" ? "সিদ্ধান্ত গ্রহণ ও সামাজিক কার্যক্রমে প্রত্যক্ষ ভূমিকা" : "Direct participation in development drives"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-growth-green/10 flex items-center justify-center shrink-0 text-growth-green mt-0.5 rounded-lg">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground">{language === "bn" ? "আইডি কার্ড ও সার্টিফিকেট" : "Official Recognition"}</h4>
                  <p className="text-[11px] text-on-surface-variant">{language === "bn" ? "ভেরিফায়েড সদস্য নম্বর ও সম্মাননা" : "Verified member profile in directory"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low dark:bg-surface-container-lowest p-6 border border-border rounded-xl">
            <h4 className="font-bold text-xs text-growth-green uppercase tracking-wider mb-2">
              {language === "bn" ? "ভর্তি সংক্রান্ত জরুরি নির্দেশনা" : "Application Guidelines"}
            </h4>
            <ul className="text-xs text-on-surface-variant space-y-2 list-disc list-inside leading-relaxed">
              <li>{language === "bn" ? "ফর্মের সকল তথ্য সঠিক ও নির্ভুল দিন।" : "Ensure all personal information is accurate."}</li>
              <li>{language === "bn" ? "স্পষ্ট পাসপোর্ট সাইজের ছবি আপলোড করুন।" : "Upload a clear passport-size photograph."}</li>
              <li>{language === "bn" ? "এডমিন কর্তৃক ভেরিফিকেশনের পর সদস্য তালিকায় নাম যুক্ত হবে।" : "Your profile will appear in the directory upon admin approval."}</li>
            </ul>
          </div>
        </div>

        {/* Right Column: The Main Application Form */}
        <div className="lg:col-span-8 bg-surface-container-low dark:bg-surface-container-lowest p-6 sm:p-10 shadow-md border border-border rounded-xl">
          
          <div className="border-b border-border pb-4 mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-headline-lg text-2xl font-bold text-foreground">
                {language === "bn" ? "সদস্য ভর্তি আবেদন ফরম" : "Membership Application"}
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {language === "bn" ? "তারকা (*) চিহ্নিত ঘরগুলো অবশ্যই পূরণ করুন" : "Fields marked with (*) are required"}
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-growth-green/10 text-growth-green border border-growth-green/20 rounded-md">
              {language === "bn" ? "নিবন্ধন ২০২৬" : "Form 2026"}
            </span>
          </div>

          {success && (
            <div className="bg-growth-green/10 text-growth-green p-4 mb-6 border border-growth-green/30 font-bold text-sm flex items-center gap-2 rounded-xl">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>
                {language === "bn" 
                  ? "আপনার আবেদন সফলভাবে জমা দেওয়া হয়েছে! এডমিন অনুমোদনের পর আপনি সম্মানিত সদস্য তালিকায় যুক্ত হবেন।" 
                  : "Your application has been submitted successfully! It will appear on the members list upon admin verification."}
              </span>
            </div>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-600 p-4 mb-6 border border-red-200 text-sm font-bold flex items-center gap-2 rounded-xl">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="nameBn" className="font-label-md text-xs font-bold text-foreground block">
                  {language === "bn" ? "১. সদস্যের নাম (বাংলা) *" : "1. Name (Bangla) *"}
                </label>
                <input required type="text" id="nameBn" name="nameBn" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl" />
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="nameEn" className="font-label-md text-xs font-bold text-foreground block">
                  {language === "bn" ? "২. Full Name (English) *" : "2. Full Name (English) *"}
                </label>
                <input required type="text" id="nameEn" name="nameEn" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="fatherName" className="font-label-md text-xs font-bold text-foreground block">
                  {language === "bn" ? "৩. পিতার নাম *" : "3. Father's Name *"}
                </label>
                <input required type="text" id="fatherName" name="fatherName" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="motherName" className="font-label-md text-xs font-bold text-foreground block">
                  {language === "bn" ? "৪. মাতার নাম *" : "4. Mother's Name *"}
                </label>
                <input required type="text" id="motherName" name="motherName" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="dob" className="font-label-md text-xs font-bold text-foreground block">
                  {language === "bn" ? "৫. জন্ম তারিখ *" : "5. Date of Birth *"}
                </label>
                <input required type="date" id="dob" name="dob" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="bloodGroup" className="font-label-md text-xs font-bold text-foreground block">
                  {language === "bn" ? "৬. রক্তের গ্রুপ *" : "6. Blood Group *"}
                </label>
                <select required id="bloodGroup" name="bloodGroup" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground cursor-pointer rounded-xl">
                  <option value="">{language === "bn" ? "রক্তের গ্রুপ নির্বাচন করুন" : "Select Blood Group"}</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="mobileNumber" className="font-label-md text-xs font-bold text-foreground block">
                  {language === "bn" ? "৭. মোবাইল নম্বর *" : "7. Mobile Number *"}
                </label>
                <input required type="tel" id="mobileNumber" name="mobileNumber" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="whatsappNumber" className="font-label-md text-xs font-bold text-foreground block">
                  {language === "bn" ? "৮. হোয়াটসঅ্যাপ নম্বর" : "8. WhatsApp Number"}
                </label>
                <input type="tel" id="whatsappNumber" name="whatsappNumber" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="font-label-md text-xs font-bold text-foreground block">
                  {language === "bn" ? "৯. ইমেইল" : "9. Email Address"}
                </label>
                <input type="email" id="email" name="email" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="nidOrBirthReg" className="font-label-md text-xs font-bold text-foreground block">
                  {language === "bn" ? "১০. এনআইডি / জন্ম নিবন্ধন নম্বর *" : "10. NID / Birth Reg No *"}
                </label>
                <input required type="text" id="nidOrBirthReg" name="nidOrBirthReg" className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="presentAddress" className="font-label-md text-xs font-bold text-foreground block">
                {language === "bn" ? "১১. বর্তমান ঠিকানা *" : "11. Present Address *"}
              </label>
              <textarea required id="presentAddress" name="presentAddress" rows={2} className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl"></textarea>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="permanentAddress" className="font-label-md text-xs font-bold text-foreground block">
                {language === "bn" ? "১২. স্থায়ী ঠিকানা *" : "12. Permanent Address *"}
              </label>
              <textarea required id="permanentAddress" name="permanentAddress" rows={2} className="w-full bg-surface dark:bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-growth-green transition-colors text-foreground rounded-xl"></textarea>
            </div>

            {/* Photo Upload Box */}
            <div className="space-y-1.5">
              <label className="font-label-md text-xs font-bold text-foreground block">
                {language === "bn" ? "১৩. সদস্যের পাসপোর্ট সাইজ ছবি" : "13. Passport Size Photo"}
              </label>
              <div className="border border-dashed border-border p-4 text-center hover:bg-surface-variant/30 transition-colors bg-surface dark:bg-background rounded-xl">
                <input 
                  type="file" 
                  accept="image/*" 
                  id="photoUpload" 
                  onChange={handleFileChange}
                  className="hidden" 
                />
                <label htmlFor="photoUpload" className="cursor-pointer flex flex-col items-center gap-2">
                  {photoUrl ? (
                    <div className="relative w-24 h-24 overflow-hidden border-2 border-growth-green shadow-sm rounded-xl">
                      <img src={photoUrl} alt="Preview" className="w-full h-full object-cover object-top rounded-xl" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-growth-green/10 flex items-center justify-center text-growth-green rounded-xl">
                      <Upload className="w-6 h-6" />
                    </div>
                  )}
                  <span className="text-xs font-bold text-growth-green">
                    {photoUrl ? (language === "bn" ? "ছবি পরিবর্তন করুন" : "Change Photo") : (language === "bn" ? "ছবি আপলোড করুন (সর্বোচ্চ ২ এমবি)" : "Upload Photo (Max 2MB)")}
                  </span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-growth-green hover:bg-[#236026] text-white font-bold text-base py-3.5 px-6 flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-70 cursor-pointer rounded-xl"
            >
              <HeartHandshake size={20} />
              {loading 
                ? (language === "bn" ? "আবেদন জমা হচ্ছে..." : "Submitting...") 
                : (language === "bn" ? "আবেদন জমা দিন" : "Submit Membership Application")}
            </button>
          </form>
        </div>

      </div>

      {/* Unified Footer */}
      <Footer />

      {/* Mandatory Policy Verification Modal */}
      <MembershipRulesModal 
        isOpen={showRulesModal} 
        onProceed={() => setShowRulesModal(false)} 
      />
    </div>
  );
}
