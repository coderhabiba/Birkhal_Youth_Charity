"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Download, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useLanguage } from "./language-provider";

export interface DonationReceiptData {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  paymentMethod: string;
  transactionId?: string;
  purpose?: string;
}

interface DonationReceiptProps {
  donation: DonationReceiptData;
  settings?: Record<string, string>;
}

export function DonationReceipt({ donation, settings = {} }: DonationReceiptProps) {
  const { language } = useLanguage();
  const receiptRef = useRef<HTMLDivElement>(null);

  const logoUrl = settings["logo_url"] || "/logo.png";
  const rawBrandBn = settings["brand_name_bn"];
  const rawBrandEn = settings["brand_name_en"];

  const brandName =
    language === "bn"
      ? rawBrandBn || "বীরখাল সমাজ কল্যাণ যুব সংগঠন"
      : rawBrandEn || "Birkhal Youth Welfare Organization";

  const t = {
    receiptTitle: language === "bn" ? "অনুদান প্রাপ্তি স্বীকারপত্র" : "Donation Receipt",
    receiptNo: language === "bn" ? "রসিদ নং:" : "Receipt No:",
    date: language === "bn" ? "তারিখ:" : "Date:",
    donorName: language === "bn" ? "দাতার নাম:" : "Donor Name:",
    amount: language === "bn" ? "পরিমাণ:" : "Amount:",
    paymentMethod: language === "bn" ? "পেমেন্ট মাধ্যম:" : "Payment Method:",
    transactionId: language === "bn" ? "ট্রানজেকশন আইডি:" : "Transaction ID:",
    purpose: language === "bn" ? "খাত:" : "Purpose:",
    thankYou: language === "bn" ? "আপনার মহতী অনুদানের জন্য ধন্যবাদ।" : "Thank you for your generous donation.",
    signature: language === "bn" ? "কর্তৃপক্ষের স্বাক্ষর" : "Authorized Signature",
    printBtn: language === "bn" ? "প্রিন্ট করুন" : "Print",
    downloadBtn: language === "bn" ? "পিডিএফ ডাউনলোড" : "Download PDF",
    currency: language === "bn" ? "টাকা" : "BDT",
  };

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt_${donation.id}`,
  });

  const handleDownloadPdf = async () => {
    if (!receiptRef.current) return;
    try {
      // Use html-to-image which properly handles modern CSS including Tailwind v4 lab() colors
      const imgData = await toPng(receiptRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        style: {
          transform: "scale(1)",
        }
      });
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${donation.id}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-3 mb-2">
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 bg-surface-variant hover:bg-gray-200 text-on-surface-variant px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          {t.printBtn}
        </button>
        <button
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 bg-growth-green text-white hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          {t.downloadBtn}
        </button>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg p-2 bg-surface-container-lowest">
        {/* Printable Area */}
        <div 
          ref={receiptRef} 
          className="bg-white p-8 sm:p-10 mx-auto rounded-md font-bn" 
          style={{ width: "100%", maxWidth: "800px", minWidth: "600px", color: "#000", fontFamily: "var(--font-hind-siliguri), sans-serif" }}
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <Image
                  src={logoUrl}
                  alt="Logo"
                  fill
                  className="object-contain"
                  unoptimized={logoUrl.startsWith("data:")}
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 m-0">{brandName}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {language === "bn" ? "চান্দিনা, কুমিল্লা | সমাজকল্যাণ ও যুব জাগরণ" : "Chandina, Cumilla | Social Welfare"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold text-green-700 uppercase tracking-wider">{t.receiptTitle}</h2>
              <p className="text-sm text-gray-600 mt-2 font-medium">
                {t.receiptNo} <span className="text-gray-900">{donation.id}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {t.date} <span className="text-gray-900">{donation.date}</span>
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-4 mb-10">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 text-gray-600 font-medium">{t.donorName}</div>
              <div className="col-span-2 text-gray-900 font-bold border-b border-gray-300 pb-1">{donation.donorName}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 text-gray-600 font-medium">{t.amount}</div>
              <div className="col-span-2 text-gray-900 font-bold text-lg border-b border-gray-300 pb-1">
                {donation.amount} {t.currency}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 text-gray-600 font-medium">{t.paymentMethod}</div>
              <div className="col-span-2 text-gray-900 border-b border-gray-300 pb-1">{donation.paymentMethod}</div>
            </div>

            {donation.transactionId && (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-gray-600 font-medium">{t.transactionId}</div>
                <div className="col-span-2 text-gray-900 border-b border-gray-300 pb-1">{donation.transactionId}</div>
              </div>
            )}

            {donation.purpose && (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-gray-600 font-medium">{t.purpose}</div>
                <div className="col-span-2 text-gray-900 border-b border-gray-300 pb-1">{donation.purpose}</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end mt-16 pt-8">
            <div className="text-gray-600 italic text-sm">
              {t.thankYou}
            </div>
            <div className="text-center">
              <div className="px-4 py-2 bg-gray-100 rounded-md border border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">
                {language === "bn" ? "ডিজিটাল রসিদ" : "Digital Receipt"}
              </div>
              <p className="text-[10px] text-gray-500 font-medium max-w-[150px]">
                {language === "bn" ? "সিস্টেম জেনারেটেড। কোনো ফিজিক্যাল স্বাক্ষরের প্রয়োজন নেই।" : "System generated. No physical signature required."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
