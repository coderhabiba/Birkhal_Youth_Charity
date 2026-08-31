"use client";

import { useState, useEffect } from "react";
import { X, Upload, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { createCommitteeMember, updateCommitteeMember } from "@/app/actions/committee";

interface CommitteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: any | null;
  onSuccess?: () => void;
}

export function CommitteeModal({ isOpen, onClose, memberToEdit, onSuccess }: CommitteeModalProps) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<string>("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name || "");
      setRole(memberToEdit.role || "");
      setPhone(memberToEdit.phone || "");
      setAddress(memberToEdit.address || "");
      setDescription(memberToEdit.description || "");
      setImage(memberToEdit.image || "");
      setIsVerified(memberToEdit.isVerified ?? true);
    } else {
      setName("");
      setRole("");
      setPhone("");
      setAddress("");
      setDescription("");
      setImage("");
      setIsVerified(true);
    }
    setError("");
  }, [memberToEdit, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError(language === "bn" ? "ছবির সাইজ ২ এমবি এর নিচে হতে হবে।" : "Image size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name,
      role,
      phone,
      address,
      description,
      image: image || undefined,
      isVerified,
    };

    try {
      let res;
      if (memberToEdit?._id) {
        res = await updateCommitteeMember(memberToEdit._id, payload);
      } else {
        res = await createCommitteeMember(payload);
      }

      if (!res.success) {
        throw new Error(res.error || "Failed to save committee member");
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface dark:bg-surface-container-lowest w-full max-w-xl shadow-2xl border border-border mt-16 mb-10 relative flex flex-col max-h-[90vh] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-surface dark:bg-surface-container-lowest z-10">
          <h2 className="font-headline-md text-xl font-bold text-foreground">
            {memberToEdit 
              ? (language === "bn" ? "কমিটি সদস্য তথ্য সম্পাদনা" : "Edit Committee Member") 
              : (language === "bn" ? "নতুন কমিটি সদস্য যুক্ত করুন" : "Add New Committee Member")}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 hover:bg-surface-variant dark:hover:bg-white/10 transition-colors text-on-surface-variant cursor-pointer rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 mb-6 text-sm font-bold border border-red-200 dark:border-red-800 rounded-xl">
              {error}
            </div>
          )}

          <form id="committee-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground">
                {language === "bn" ? "সদস্যের নাম" : "Full Name"} *
              </label>
              <input 
                required 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === "bn" ? "উদা: মুহাম্মদ আব্দুল্লাহ" : "e.g. Md. Abdullah"}
                className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground">
                {language === "bn" ? "পদবী (Role / Designation)" : "Role / Designation"} *
              </label>
              <input 
                required 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder={language === "bn" ? "উদা: সভাপতি / সাধারণ সম্পাদক / কোষাধ্যক্ষ" : "e.g. President / General Secretary"}
                className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground">
                {language === "bn" ? "মোবাইল নম্বর (ঐচ্ছিক - দিলে প্রদর্শিত হবে)" : "Phone Number (Optional - shown only if provided)"}
              </label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={language === "bn" ? "উদা: 01882447721" : "e.g. 01882447721"}
                className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground">
                {language === "bn" ? "ঠিকানা (গ্রাম / থানা / জেলা)" : "Address"}
              </label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={language === "bn" ? "উদা: বীরখাল, চান্দিনা, কুমিল্লা" : "e.g. Birkhal, Chandina, Cumilla"}
                className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground">
                {language === "bn" ? "বিবরণ / সংক্ষিপ্ত পরিচিতি" : "Description / Bio"}
              </label>
              <textarea 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={language === "bn" ? "সংগঠনে দায়িত্ব ও সংক্ষিপ্ত পরিচয়..." : "Brief role description or bio..."}
                className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground rounded-xl" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground">
                {language === "bn" ? "প্রোফাইল ছবি (সর্বোচ্চ ২ এমবি)" : "Profile Photo (Max 2MB)"}
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-surface-variant dark:bg-background border border-border p-3 text-sm focus:outline-none focus:border-growth-green text-foreground file:mr-4 file:py-1 file:px-3 file:border-0 file:text-xs file:font-bold file:bg-growth-green file:text-white hover:file:bg-[#236026] cursor-pointer file:rounded-lg rounded-xl" 
                />
                {image && (
                  <div className="w-16 h-16 shrink-0 overflow-hidden border-2 border-growth-green relative rounded-xl">
                    <img src={image} alt="Preview" className="w-full h-full object-cover object-top rounded-xl" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input 
                type="checkbox" 
                id="isVerified"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="w-4 h-4 text-growth-green bg-surface border-border focus:ring-growth-green cursor-pointer rounded" 
              />
              <label htmlFor="isVerified" className="font-label-md text-foreground text-sm cursor-pointer flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-growth-green" />
                {language === "bn" ? "ভেরিফাইড লিডারশিপ ব্যাজ সক্রিয় রাখুন" : "Show verified leadership badge"}
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-surface dark:bg-surface-container-lowest">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2.5 font-bold text-sm text-on-surface-variant hover:bg-surface-variant dark:hover:bg-white/10 transition-colors border border-border cursor-pointer rounded-xl"
          >
            {language === "bn" ? "বাতিল" : "Cancel"}
          </button>
          <button 
            type="submit" 
            form="committee-form" 
            disabled={loading} 
            className="px-6 py-2.5 font-bold text-sm bg-growth-green hover:bg-[#236026] text-white shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer rounded-xl"
          >
            {loading 
              ? (language === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") 
              : (memberToEdit 
                  ? (language === "bn" ? "আপডেট করুন" : "Update Member") 
                  : (language === "bn" ? "যুক্ত করুন" : "Add Member"))}
          </button>
        </div>
      </div>
    </div>
  );
}
