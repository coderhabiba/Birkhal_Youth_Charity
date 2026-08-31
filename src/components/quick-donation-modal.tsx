"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/components/language-provider";
import { 
  Heart, 
  Copy, 
  Check, 
  Smartphone, 
  Building2, 
  CreditCard, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Loader2,
  PhoneCall,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import Image from "next/image";

export function QuickDonationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { language } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<"bkash" | "nagad" | "rocket" | "bank">("bkash");
  const [amount, setAmount] = useState<string>("500");
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [trxId, setTrxId] = useState("");
  const [category, setCategory] = useState("General Fund");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const paymentAccounts = {
    bkash: {
      name: "bKash (বিকাশ পার্সোনাল)",
      number: "01882447721",
      type: "Send Money / পার্সোনাল",
      color: "from-pink-600 to-rose-600",
      bg: "bg-pink-500/10",
      text: "text-pink-600"
    },
    nagad: {
      name: "Nagad (নগদ পার্সোনাল)",
      number: "01609296990",
      type: "Send Money / পার্সোনাল",
      color: "from-orange-600 to-amber-600",
      bg: "bg-orange-500/10",
      text: "text-orange-600"
    },
    rocket: {
      name: "Rocket (রকেট পার্সোনাল)",
      number: "018824477218",
      type: "Send Money / পার্সোনাল",
      color: "from-purple-600 to-indigo-600",
      bg: "bg-purple-500/10",
      text: "text-purple-600"
    },
    bank: {
      name: "ব্যাংক একাউন্ট (Bank Transfer)",
      bankName: "Islami Bank Bangladesh Ltd (ইসলামী ব্যাংক)",
      accountName: "Birkhal Social Welfare Youth Org",
      accountNumber: "20503920100123456",
      branch: "Chandina Branch, Cumilla",
      routing: "125190876",
      color: "from-emerald-600 to-teal-700",
      bg: "bg-emerald-500/10",
      text: "text-emerald-600"
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Strict validation for all fields
    if (!amount || Number(amount) <= 0) {
      setErrorMsg(language === "bn" ? "অনুগ্রহ করে অনুদানের সঠিক পরিমাণ লিখুন।" : "Please enter a valid donation amount.");
      return;
    }
    if (!donorName.trim() || donorName.trim().length < 2) {
      setErrorMsg(language === "bn" ? "অনুগ্রহ করে আপনার সঠিক নাম প্রদান করুন।" : "Please enter your full name.");
      return;
    }
    if (!donorPhone.trim() || donorPhone.trim().length < 11) {
      setErrorMsg(language === "bn" ? "অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।" : "Please enter a valid 11-digit mobile number.");
      return;
    }
    if (!trxId.trim() || trxId.trim().length < 3) {
      setErrorMsg(language === "bn" ? "অনুগ্রহ করে পেমেন্টের সঠিক ট্রানজেকশন আইডি (TrxID) দিন।" : "Please enter your payment Transaction ID (TrxID).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: donorName.trim(),
          amount: Number(amount),
          paymentMethod: selectedMethod.toUpperCase(),
          transactionId: trxId.trim(),
          purpose: category,
          mobileNumber: donorPhone.trim(),
          date: new Date().toISOString()
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        setErrorMsg(language === "bn" ? "তথ্য সংরক্ষণে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।" : "Failed to submit donation info. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(language === "bn" ? "নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।" : "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div className="min-h-full flex items-start justify-center p-4 pt-10 sm:p-6 sm:items-center">
        <div 
          className="relative w-full max-w-xl bg-surface-container-lowest dark:bg-surface-container-low border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-left my-4 sm:my-8 rounded-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Gradient Header */}
          <div className="bg-gradient-to-r from-growth-green via-primary to-impact-orange p-6 text-white relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-white/20 text-white font-bold text-xs rounded-md">
                {language === "bn" ? "❤️ মানবসেবায় অনুদান" : "❤️ Donate to Charity"}
              </span>
            </div>

            <h3 className="font-headline-lg text-xl sm:text-2xl font-bold text-white">
              {language === "bn" ? "বীরখাল সমাজ কল্যাণ যুব সংগঠন" : "Birkhal Youth Social Welfare Organization Fund"}
            </h3>
            <p className="text-xs text-white/90 mt-1 max-w-md">
              {language === "bn"
                ? "আপনার সামান্য অনুদান অসহায় মানুষের মুখে হাসি ফোটাতে এবং যুবসমাজের উন্নয়নে বিশেষ ভূমিকা রাখবে।"
                : "Your generous contribution empowers local youth, sponsors education, and provides emergency relief."}
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
          {success ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-growth-green/10 text-growth-green mx-auto flex items-center justify-center rounded-full">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-headline-md text-xl font-bold text-foreground">
                {language === "bn" ? "জাযাকাল্লাহু খাইরান! আপনার অনুদান তথ্য গৃহীত হয়েছে।" : "Thank You! Donation Information Received."}
              </h4>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto">
                {language === "bn"
                  ? "বীরখাল সমাজ কল্যাণ যুব সংগঠনের পক্ষ থেকে আপনাকে আন্তরিক মোবারকবাদ। অনুদানটি যাচাই করে ডোনেশন তালিকায় অন্তর্ভুক্ত করা হবে।"
                  : "We deeply appreciate your contribution. Your donation will be verified and added to the official record."}
              </p>
              <button
                onClick={() => { setSuccess(false); onClose(); }}
                className="bg-growth-green hover:bg-[#236026] text-white font-bold px-6 py-2.5 text-xs uppercase tracking-wider cursor-pointer rounded-xl"
              >
                {language === "bn" ? "ঠিক আছে" : "Done"}
              </button>
            </div>
          ) : (
            <>
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">
                  {language === "bn" ? "১. পেমেন্ট মাধ্যম নির্বাচন করুন *" : "1. Choose Payment Method *"}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("bkash")}
                    className={`p-2.5 text-center border font-bold text-xs transition-all cursor-pointer flex flex-col items-center gap-1 rounded-xl ${
                      selectedMethod === "bkash" 
                        ? "border-pink-600 bg-pink-500/10 text-pink-600 shadow-xs ring-1 ring-pink-600" 
                        : "border-border hover:bg-surface-variant text-foreground"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>bKash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("nagad")}
                    className={`p-2.5 text-center border font-bold text-xs transition-all cursor-pointer flex flex-col items-center gap-1 rounded-xl ${
                      selectedMethod === "nagad" 
                        ? "border-orange-600 bg-orange-500/10 text-orange-600 shadow-xs ring-1 ring-orange-600" 
                        : "border-border hover:bg-surface-variant text-foreground"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Nagad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("rocket")}
                    className={`p-2.5 text-center border font-bold text-xs transition-all cursor-pointer flex flex-col items-center gap-1 rounded-xl ${
                      selectedMethod === "rocket" 
                        ? "border-purple-600 bg-purple-500/10 text-purple-600 shadow-xs ring-1 ring-purple-600" 
                        : "border-border hover:bg-surface-variant text-foreground"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Rocket</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("bank")}
                    className={`p-2.5 text-center border font-bold text-xs transition-all cursor-pointer flex flex-col items-center gap-1 rounded-xl ${
                      selectedMethod === "bank" 
                        ? "border-growth-green bg-growth-green/10 text-growth-green shadow-xs ring-1 ring-growth-green" 
                        : "border-border hover:bg-surface-variant text-foreground"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Bank</span>
                  </button>
                </div>
              </div>

              {/* Account Details Box with 1-Click Copy */}
              <div className="p-4 bg-surface dark:bg-background border border-border space-y-3 rounded-xl">
                {selectedMethod !== "bank" ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-on-surface-variant font-medium">
                        {paymentAccounts[selectedMethod].name} ({paymentAccounts[selectedMethod].type})
                      </div>
                      <div className="font-headline-md text-xl font-bold text-foreground tracking-wider mt-0.5">
                        {paymentAccounts[selectedMethod].number}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentAccounts[selectedMethod].number, selectedMethod)}
                      className="px-4 py-2 bg-growth-green/10 text-growth-green hover:bg-growth-green hover:text-white font-bold text-xs border border-growth-green/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto rounded-xl"
                    >
                      {copiedKey === selectedMethod ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === selectedMethod ? (language === "bn" ? "কপি হয়েছে!" : "Copied!") : (language === "bn" ? "নম্বর কপি করুন" : "Copy Number")}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-foreground text-sm">{paymentAccounts.bank.bankName}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-on-surface-variant">
                      <div><span className="font-bold text-foreground">হিসাবের নাম:</span> {paymentAccounts.bank.accountName}</div>
                      <div><span className="font-bold text-foreground">শাখা:</span> {paymentAccounts.bank.branch}</div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">হিসাব নং:</span> {paymentAccounts.bank.accountNumber}
                        <button onClick={() => handleCopy(paymentAccounts.bank.accountNumber, "bank-acc")} className="text-growth-green hover:underline cursor-pointer font-bold">
                          {copiedKey === "bank-acc" ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                      <div><span className="font-bold text-foreground">রাউটিং:</span> {paymentAccounts.bank.routing}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preset Amounts */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">
                  {language === "bn" ? "২. অনুদানের পরিমাণ (টাকা) *" : "2. Donation Amount (BDT) *"}
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {["100", "500", "1000", "5000"].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 text-center border font-bold text-xs transition-all cursor-pointer rounded-xl ${
                        amount === val 
                          ? "bg-growth-green text-white border-growth-green shadow-xs" 
                          : "border-border hover:bg-surface-variant text-foreground"
                      }`}
                    >
                      ৳{val}
                    </button>
                  ))}
                </div>
                <input
                  required
                  type="number"
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={language === "bn" ? "অনুদানের টাকার পরিমাণ লিখুন (যেমন: 500)" : "Enter amount (e.g. 500)..."}
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-growth-green rounded-xl"
                />
              </div>

              {/* Error Message Box */}
              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Donor Form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-border">
                <label className="block text-xs font-bold text-foreground">
                  {language === "bn" ? "৩. অনুদানকারীর প্রয়োজনীয় তথ্যসমূহ (সকল ঘর পূরণ আবশ্যক) *" : "3. Donor Details (All Fields Required) *"}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                      {language === "bn" ? "আপনার পূর্ণ নাম *" : "Your Full Name *"}
                    </label>
                    <input
                      required
                      type="text"
                      minLength={2}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={language === "bn" ? "যেমন: মো: আরিফুল ইসলাম" : "e.g. Md. Ariful Islam"}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground focus:outline-none focus:border-growth-green rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                      {language === "bn" ? "সচল মোবাইল নম্বর *" : "Mobile Number *"}
                    </label>
                    <input
                      required
                      type="tel"
                      minLength={11}
                      maxLength={14}
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="01882447721"
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground focus:outline-none focus:border-growth-green rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                      {language === "bn" ? "ট্রানজেকশন আইডি (TrxID) *" : "Transaction ID (TrxID) *"}
                    </label>
                    <input
                      required
                      type="text"
                      minLength={3}
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder={language === "bn" ? "যেমন: 9J3K8L2P" : "e.g. 9J3K8L2P"}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground focus:outline-none focus:border-growth-green rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                      {language === "bn" ? "অনুদানের উদ্দেশ্য / খাত *" : "Donation Purpose *"}
                    </label>
                    <select
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground focus:outline-none focus:border-growth-green rounded-xl"
                    >
                      <option value="General Fund">{language === "bn" ? "সাধারণ কল্যাণ তহবিল" : "General Welfare Fund"}</option>
                      <option value="Zakat Fund">{language === "bn" ? "যাকাত ও সদকা তহবিল" : "Zakat & Sadaqah Fund"}</option>
                      <option value="Education Aid">{language === "bn" ? "শিক্ষা সহায়তা ফান্ড" : "Education Aid"}</option>
                      <option value="Disaster Relief">{language === "bn" ? "ত্রাণ ও পুনর্বাসন" : "Disaster Relief"}</option>
                      <option value="Tree Plantation">{language === "bn" ? "বৃক্ষরোপণ প্রকল্প" : "Tree Plantation"}</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-growth-green hover:bg-[#236026] text-white font-bold text-xs sm:text-sm py-3 px-4 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-4 rounded-xl"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4 fill-white" />}
                  <span>{loading ? (language === "bn" ? "যাচাই ও জমা হচ্ছে..." : "Submitting...") : (language === "bn" ? "অনুদান তথ্য নিশ্চিত করুন" : "Confirm Donation Info")}</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
    </div>,
    document.body
  );
}
