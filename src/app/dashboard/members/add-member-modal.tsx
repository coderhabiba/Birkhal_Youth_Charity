"use client";

import { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";
import { createMemberAction, updateMemberDetails } from "@/app/actions/members";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: any | null;
  onSuccess?: () => void;
}

export function AddMemberModal({ isOpen, onClose, memberToEdit, onSuccess }: MemberModalProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 13 Member Fields
  const [nameBn, setNameBn] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [fatherHusbandName, setFatherHusbandName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [nidOrBirthCert, setNidOrBirthCert] = useState("");
  const [presentAddress, setPresentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [status, setStatus] = useState<string>("approved");

  useEffect(() => {
    if (memberToEdit) {
      setNameBn(memberToEdit.nameBn || "");
      setNameEn(memberToEdit.nameEn || "");
      setFatherHusbandName(memberToEdit.fatherHusbandName || memberToEdit.fatherName || "");
      setMotherName(memberToEdit.motherName || "");
      
      // Ensure date format is YYYY-MM-DD for input[type="date"]
      let dob = memberToEdit.dateOfBirth || "";
      if (dob && dob.includes("T")) {
        dob = dob.split("T")[0];
      }
      setDateOfBirth(dob);
      
      setBloodGroup(memberToEdit.bloodGroup || "");
      setMobileNumber(memberToEdit.mobileNumber || "");
      setWhatsappNumber(memberToEdit.whatsappNumber || "");
      setEmail(memberToEdit.email || "");
      setNidOrBirthCert(memberToEdit.nidOrBirthCert || "");
      setPresentAddress(memberToEdit.presentAddress || "");
      setPermanentAddress(memberToEdit.permanentAddress || "");
      setPhotoUrl(memberToEdit.photoUrl || "");
      setStatus(memberToEdit.status || "approved");
    } else {
      setNameBn("");
      setNameEn("");
      setFatherHusbandName("");
      setMotherName("");
      setDateOfBirth("");
      setBloodGroup("");
      setMobileNumber("");
      setWhatsappNumber("");
      setEmail("");
      setNidOrBirthCert("");
      setPresentAddress("");
      setPermanentAddress("");
      setPhotoUrl("");
      setStatus("approved");
    }
    setError("");
  }, [memberToEdit, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Limit to 5MB
        setError(language === "bn" ? "ছবির সাইজ ৫ এমবি এর নিচে হতে হবে।" : "Image size must be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      nameBn,
      nameEn,
      fatherHusbandName,
      motherName,
      dateOfBirth,
      bloodGroup,
      mobileNumber,
      whatsappNumber,
      email,
      nidOrBirthCert,
      presentAddress,
      permanentAddress,
      photoUrl: photoUrl || "",
      status,
    };

    try {
      let res;
      if (memberToEdit?._id) {
        res = await updateMemberDetails(memberToEdit._id, payload);
      } else {
        res = await createMemberAction(payload);
      }

      if (!res.success) {
        throw new Error(res.error || "Failed to save member details");
      }

      router.refresh();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error processing request");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface dark:bg-surface-container-lowest w-full max-w-3xl shadow-2xl border border-border mt-16 mb-10 relative flex flex-col max-h-[90vh] rounded-xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-surface dark:bg-surface-container-lowest z-10">
          <div>
            <h2 className="font-headline-md text-xl font-bold text-foreground">
              {memberToEdit 
                ? (language === "bn" ? "সদস্যের তথ্য সম্পাদনা করুন" : "Edit Member Details") 
                : (language === "bn" ? "নতুন সদস্য যোগ করুন" : "Add New Member")}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {language === "bn" 
                ? "সদস্যের সকল তথ্যের পরিবর্তন ওয়েবসাইটে স্বয়ংক্রিয়ভাবে আপডেট হবে।" 
                : "Updates will immediately sync across all portal directories."}
            </p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-surface-variant dark:hover:bg-white/10 transition-colors text-on-surface-variant cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3.5 rounded-xl mb-6 text-xs font-bold border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <form id="member-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Row 1: Name Bangla & English */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  {language === "bn" ? "১. সদস্যের নাম (বাংলা) *" : "1. Member Name (Bengali) *"}
                </label>
                <input 
                  required 
                  type="text" 
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder={language === "bn" ? "উদা: মুহাম্মদ আরিফুল ইসলাম" : "e.g. Md. Ariful Islam"}
                  className="w-full bg-surface-variant/50 dark:bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-growth-green" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  {language === "bn" ? "২. সদস্যের নাম (ইংরেজি)" : "2. Member Name (English)"}
                </label>
                <input 
                  type="text" 
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Md. Ariful Islam"
                  className="w-full bg-surface-variant/50 dark:bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-growth-green" 
                />
              </div>
            </div>

            {/* Row 2: Father Name & Mother Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  {language === "bn" ? "৩. পিতার / স্বামীর নাম" : "3. Father's / Husband's Name"}
                </label>
                <input 
                  type="text" 
                  value={fatherHusbandName}
                  onChange={(e) => setFatherHusbandName(e.target.value)}
                  placeholder={language === "bn" ? "পিতার নাম বা স্বামীর নাম লিখুন" : "Enter father's or husband's name"}
                  className="w-full bg-surface-variant/50 dark:bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-growth-green" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  {language === "bn" ? "৪. মাতার নাম *" : "4. Mother's Name *"}
                </label>
                <input 
                  required 
                  type="text" 
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder={language === "bn" ? "মাতার নাম লিখুন" : "Enter mother's name"}
                  className="w-full bg-surface-variant/50 dark:bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-growth-green" 
                />
              </div>
            </div>

            {/* Row 3: Date of Birth & Blood Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  {language === "bn" ? "৫. জন্ম তারিখ" : "5. Date of Birth (mm/dd/yyyy)"}
                </label>
                <input 
                  type="date" 
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-surface-variant/50 dark:bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-growth-green" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  {language === "bn" ? "৬. রক্তের গ্রুপ *" : "6. Blood Group *"}
                </label>
                <select 
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-surface-variant/50 dark:bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-growth-green cursor-pointer"
                >
                  <option value="">{language === "bn" ? "রক্তের গ্রুপ নির্বাচন করুন" : "Select Blood Group"}</option>
                  <option value="A+">A+</option><option value="A-">A-</option>
                  <option value="B+">B+</option><option value="B-">B-</option>
                  <option value="O+">O+</option><option value="O-">O-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            {/* Row 4: Mobile & WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  {language === "bn" ? "৭. মোবাইল নম্বর *" : "7. Mobile Number *"}
                </label>
                <input 
                  required 
                  type="tel" 
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-surface-variant/50 dark:bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-growth-green" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  {language === "bn" ? "৮. হোয়াটসঅ্যাপ নম্বর" : "8. WhatsApp Number"}
                </label>
                <input 
                  type="tel" 
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-surface-variant/50 dark:bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-growth-green" 
                />
              </div>
            </div>

            {/* Row 5: Email & NID / Birth Certificate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  {language === "bn" ? "৯. ইমেইল" : "9. Email Address"}
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full bg-surface-variant/50 dark:bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-growth-green" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  {language === "bn" ? "১০. এনআইডি / জন্ম নিবন্ধন নম্বর" : "10. NID / Birth Certificate Number"}
                </label>
                <input 
                  type="text" 
                  value={nidOrBirthCert}
                  onChange={(e) => setNidOrBirthCert(e.target.value)}
                  placeholder={language === "bn" ? "এনআইডি বা জন্ম নিবন্ধন নম্বর দিন" : "Enter NID / Birth Cert Number"}
                  className="w-full bg-surface-variant/50 dark:bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-growth-green" 
                />
              </div>
            </div>

            {/* Row 6: Present Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">
                {language === "bn" ? "১১. বর্তমান ঠিকানা *" : "11. Present Address *"}
              </label>
              <textarea 
                required 
                rows={2} 
                value={presentAddress}
                onChange={(e) => setPresentAddress(e.target.value)}
                placeholder={language === "bn" ? "গ্রাম, ডাকঘর, থানা, জেলা..." : "Village, Post, Thana, District..."}
                className="w-full bg-surface-variant/50 dark:bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-growth-green"
              ></textarea>
            </div>

            {/* Row 7: Permanent Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">
                {language === "bn" ? "১২. স্থায়ী ঠিকানা *" : "12. Permanent Address *"}
              </label>
              <textarea 
                required 
                rows={2} 
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
                placeholder={language === "bn" ? "গ্রাম, ডাকঘর, থানা, জেলা..." : "Village, Post, Thana, District..."}
                className="w-full bg-surface-variant/50 dark:bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-growth-green"
              ></textarea>
            </div>

            {/* Row 8: Passport Size Photo Upload & Preview */}
            <div className="space-y-1.5 p-4 bg-surface-variant/30 dark:bg-background/50 border border-border rounded-xl">
              <label className="block text-xs font-bold text-foreground">
                {language === "bn" ? "১৩. সদস্যের পাসপোর্ট সাইজ ছবি (সর্বোচ্চ ৫ এমবি)" : "13. Member Passport Size Photo (Max 5MB)"}
              </label>
              <div className="flex items-center gap-4 pt-1">
                {photoUrl ? (
                  <div className="relative w-16 h-16 shrink-0 overflow-hidden border-2 border-growth-green rounded-xl shadow-xs">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover object-top" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl("")}
                      className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-surface-variant dark:bg-surface-container border border-dashed border-border flex items-center justify-center text-on-surface-variant shrink-0">
                    <Upload className="w-6 h-6 opacity-60" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <input 
                    type="file" 
                    id="member-photo-file-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  <label
                    htmlFor="member-photo-file-upload"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-lowest dark:bg-surface-container hover:bg-surface-variant text-foreground text-xs font-bold rounded-lg border border-border cursor-pointer transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-growth-green" />
                    <span>{photoUrl ? (language === "bn" ? "ছবি পরিবর্তন করুন" : "Change Photo") : (language === "bn" ? "ছবি আপলোড করুন" : "Upload Photo")}</span>
                  </label>
                  <p className="text-[10px] text-on-surface-variant mt-1 truncate">
                    {language === "bn" ? "JPG, PNG বা WEBP (পাসপোর্ট সাইজ আদর্শ)" : "JPG, PNG or WEBP (Passport size recommended)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">
                {language === "bn" ? "সদস্যপদ স্ট্যাটাস" : "Membership Status"}
              </label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-surface-variant/50 dark:bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-growth-green cursor-pointer font-bold"
              >
                <option value="approved">{language === "bn" ? "অনুমোদিত (Approved)" : "Approved"}</option>
                <option value="pending">{language === "bn" ? "পেন্ডিং (Pending)" : "Pending"}</option>
                <option value="rejected">{language === "bn" ? "বাতিল (Rejected)" : "Rejected"}</option>
              </select>
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-surface dark:bg-surface-container-lowest">
          <button 
            type="button" 
            onClick={handleClose} 
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-on-surface-variant hover:bg-surface-variant dark:hover:bg-white/10 transition-colors border border-border cursor-pointer"
          >
            {language === "bn" ? "বাতিল" : "Cancel"}
          </button>
          <button 
            type="submit" 
            form="member-form" 
            disabled={loading} 
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-growth-green hover:bg-[#236026] text-white shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {loading 
              ? (language === "bn" ? "সংরক্ষণ করা হচ্ছে..." : "Saving...") 
              : (memberToEdit 
                  ? (language === "bn" ? "আপডেট সংরক্ষণ করুন" : "Save Changes") 
                  : (language === "bn" ? "সদস্য যোগ করুন" : "Add Member"))}
          </button>
        </div>

      </div>
    </div>
  );
}

