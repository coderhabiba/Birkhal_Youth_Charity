"use client";

import { useLanguage } from "@/components/language-provider";
import { UserPlus, Edit, Trash2, ShieldCheck, MapPin, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { CommitteeModal } from "./committee-modal";
import { deleteCommitteeMember } from "@/app/actions/committee";
import { useRouter } from "next/navigation";
import { ConfirmModal, AlertModal } from "@/components/confirm-modal";

export function DashboardCommitteeClient({ members }: { members: any[] }) {
  const { language } = useLanguage();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenAdd = () => {
    setMemberToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: any) => {
    setMemberToEdit(member);
    setIsModalOpen(true);
  };

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await deleteCommitteeMember(deleteTarget.id);
      if (res.success) {
        setDeleteTarget(null);
        router.refresh();
      } else {
        setDeleteTarget(null);
        setErrorModal(res.error || "Failed to delete");
      }
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-foreground mb-2">
            {language === "bn" ? "কার্যনির্বাহী কমিটি" : "Committee Members"}
          </h2>
          <p className="font-body-lg text-on-surface-variant dark:text-on-surface-variant">
            {language === "bn"
              ? "আমাদের সমাজ কল্যাণ কার্যক্রম পরিচালনাকারী নেতৃত্বদানকারী দলের ব্যবস্থাপনা করুন।"
              : "Manage the active leadership team guiding our community initiatives."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-growth-green text-white px-4 py-2.5 font-bold text-sm shadow-sm rounded-xl">
            {language === "bn" ? "মোট সদস্য: " : "Total: "} {members.length}
          </div>
          <button 
            onClick={handleOpenAdd}
            className="bg-impact-orange hover:opacity-90 text-white font-label-md px-6 py-2.5 flex items-center gap-2 shadow-sm transition-all cursor-pointer font-bold text-sm rounded-xl"
          >
            <UserPlus className="w-5 h-5" />
            {language === "bn" ? "নতুন সদস্য যুক্ত করুন" : "Add New Member"}
          </button>
        </div>
      </div>

      <CommitteeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memberToEdit={memberToEdit}
        onSuccess={() => router.refresh()}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member: any) => (
          <div key={member._id} className="bg-surface-container-low dark:bg-surface-container-lowest p-6 shadow-sm border border-border hover:shadow-md transition-all flex flex-col items-center text-center group backdrop-blur-md relative rounded-xl">
            <div className="relative w-28 h-28 mb-4">
              <div className="w-full h-full overflow-hidden border-2 border-border bg-surface-variant dark:bg-surface flex items-center justify-center relative rounded-xl">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top rounded-xl" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-on-surface-variant">
                    <UserIcon className="w-10 h-10 mb-1" />
                    <span className="text-xs font-bold">{member.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              {member.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-growth-green border-2 border-surface flex items-center justify-center text-white px-2 py-0.5 text-[10px] font-bold shadow-sm rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> ভেরিফাইড
                </div>
              )}
            </div>
            
            <h3 className="font-headline-md text-lg font-bold text-foreground mb-1">{member.name}</h3>
            <span className="inline-block bg-growth-green/10 text-growth-green font-bold text-xs px-3 py-1 mb-2 border border-growth-green/20 rounded-md">
              {member.role}
            </span>

            {member.address && (
              <p className="flex items-center justify-center gap-1 text-xs text-on-surface-variant dark:text-on-surface-variant mb-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-reliability-blue" />
                <span>{member.address}</span>
              </p>
            )}

            {member.description && (
              <p className="font-body-md text-on-surface-variant dark:text-on-surface-variant text-xs mb-6 line-clamp-2">
                {member.description}
              </p>
            )}
            
            <div className="w-full flex gap-2 mt-auto border-t border-border pt-4">
              <button 
                onClick={() => handleOpenEdit(member)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-reliability-blue hover:bg-reliability-blue hover:text-white transition-all cursor-pointer border border-reliability-blue/30 rounded-lg"
              >
                <Edit className="w-3.5 h-3.5" /> {language === "bn" ? "সম্পাদনা" : "Edit"}
              </button>
              <button 
                disabled={isPending}
                onClick={() => handleDelete(member._id, member.name)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer border border-red-500/30 disabled:opacity-50 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" /> {language === "bn" ? "মুছুন" : "Delete"}
              </button>
            </div>
          </div>
        ))}
        
        {members.length === 0 && (
          <div className="col-span-full py-16 text-center text-on-surface-variant dark:text-on-surface-variant bg-surface-container-low dark:bg-surface-container-lowest border border-dashed border-border backdrop-blur-md rounded-xl">
            <UserIcon className="w-12 h-12 mx-auto mb-3 text-on-surface-variant/40" />
            <p className="font-bold text-base mb-2">
              {language === "bn" ? "কোনো কমিটির সদস্য পাওয়া যায়নি।" : "No committee members found."}
            </p>
            <p className="text-sm mb-4 text-on-surface-variant">
              {language === "bn" ? "নতুন সদস্য যোগ করতে নিচের বাটনে ক্লিক করুন।" : "Click the button below to add your first member."}
            </p>
            <button 
              onClick={handleOpenAdd}
              className="bg-growth-green hover:bg-[#236026] text-white font-bold px-6 py-2 text-sm shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer rounded-xl"
            >
              <UserPlus className="w-4 h-4" />
              {language === "bn" ? "নতুন সদস্য যুক্ত করুন" : "Add Member"}
            </button>
          </div>
        )}
      </div>

      {/* Modern Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={language === "bn" ? "কমিটি থেকে অপসারণের নিশ্চয়তা" : "Remove Committee Member"}
        message={language === "bn" ? `আপনি কি নিশ্চিতভাবে "${deleteTarget?.name}" কে কমিটি থেকে অপসারণ করতে চান?` : `Are you sure you want to remove "${deleteTarget?.name}" from the executive committee?`}
        confirmText={language === "bn" ? "হ্যাঁ, অপসারণ করুন" : "Yes, Remove"}
        cancelText={language === "bn" ? "বাতিল" : "Cancel"}
        type="danger"
        loading={isPending}
      />

      {/* Modern Error Alert Modal */}
      <AlertModal
        isOpen={!!errorModal}
        onClose={() => setErrorModal(null)}
        title={language === "bn" ? "ত্রুটি ঘটেছে" : "Error"}
        message={errorModal || ""}
        type="error"
      />
    </>
  );
}
