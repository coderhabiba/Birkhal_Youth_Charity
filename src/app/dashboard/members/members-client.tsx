"use client";

import { useLanguage } from "@/components/language-provider";
import { format } from "date-fns";
import { User as UserIcon, Search, Eye, Pencil, Trash2, CheckCircle2, XCircle, Filter, Phone, Mail, MapPin, Calendar, HeartHandshake } from "lucide-react";
import { useState, useTransition } from "react";
import { AddMemberModal } from "./add-member-modal";
import { updateMemberStatus, deleteMember } from "@/app/actions/members";
import { ConfirmModal } from "@/components/confirm-modal";

export function DashboardMembersClient({ members }: { members: any[] }) {
  const { language } = useLanguage();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<any | null>(null);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bloodFilter, setBloodFilter] = useState<string>("all");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, status: "approved" | "rejected") => {
    startTransition(async () => {
      await updateMemberStatus(id, status);
      if (selectedMember && selectedMember._id === id) {
        setSelectedMember({ ...selectedMember, status });
      }
    });
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDeleteMember = async () => {
    if (!deleteTargetId) return;
    startTransition(async () => {
      await deleteMember(deleteTargetId);
      if (selectedMember && selectedMember._id === deleteTargetId) {
        setSelectedMember(null);
      }
      setDeleteTargetId(null);
    });
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      (m.nameEn && m.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.nameBn && m.nameBn.includes(searchTerm)) ||
      (m.mobileNumber && m.mobileNumber.includes(searchTerm)) ||
      (m.whatsappNumber && m.whatsappNumber.includes(searchTerm)) ||
      (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.nidOrBirthCert && m.nidOrBirthCert.includes(searchTerm));
    
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    const matchesBlood = bloodFilter === "all" || m.bloodGroup === bloodFilter;

    return matchesSearch && matchesStatus && matchesBlood;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold text-foreground mb-1">
            {language === "bn" ? "সদস্যবৃন্দ ব্যবস্থাপনা" : "Member Management"}
          </h1>
          <p className="text-on-surface-variant font-body-md">
            {language === "bn"
              ? "বীরখাল ইয়ুথের নিবন্ধিত সকল সাধারণ সদস্য ও তাদের বিস্তারিত তথ্য পরিচালনা ও সম্পাদন করুন।"
              : "View, edit, moderate, and manage registered members and their details."}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="bg-surface-variant dark:bg-white/10 px-4 py-2 border border-border font-bold text-sm text-foreground rounded-xl">
            {language === "bn" ? "মোট সদস্য: " : "Total Members: "} <span className="text-growth-green">{members.length}</span>
          </div>
          <button 
            onClick={() => {
              setMemberToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="bg-growth-green hover:bg-[#236026] text-white px-4 py-2 font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center gap-2 rounded-xl"
          >
            + {language === "bn" ? "নতুন সদস্য যোগ করুন" : "Add Member"}
          </button>
        </div>
      </div>

      <AddMemberModal 
        isOpen={isAddModalOpen || !!memberToEdit} 
        memberToEdit={memberToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setMemberToEdit(null);
        }} 
        onSuccess={() => {
          if (selectedMember && memberToEdit && selectedMember._id === memberToEdit._id) {
            setSelectedMember(null);
          }
        }}
      />

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-low dark:bg-surface-container-lowest p-4 border border-border flex flex-col md:flex-row gap-4 items-center justify-between rounded-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === "bn" ? "নাম, মোবাইল বা NID দিয়ে খুঁজুন..." : "Search by name, mobile, NID..."}
            className="w-full pl-9 pr-3 py-2 text-sm bg-surface dark:bg-background border border-border focus:outline-none focus:border-growth-green text-foreground rounded-xl"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          {/* Status Tabs */}
          <div className="flex border border-border bg-surface dark:bg-background text-xs rounded-xl overflow-hidden">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-2 font-bold cursor-pointer transition-colors ${statusFilter === "all" ? "bg-growth-green text-white" : "text-on-surface-variant hover:text-foreground"}`}
            >
              {language === "bn" ? "সকল" : "All"} ({members.length})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-2 font-bold cursor-pointer transition-colors ${statusFilter === "pending" ? "bg-amber-600 text-white" : "text-on-surface-variant hover:text-foreground"}`}
            >
              {language === "bn" ? "পেন্ডিং" : "Pending"} ({members.filter(m => m.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-3 py-2 font-bold cursor-pointer transition-colors ${statusFilter === "approved" ? "bg-green-700 text-white" : "text-on-surface-variant hover:text-foreground"}`}
            >
              {language === "bn" ? "অনুমোদিত" : "Approved"} ({members.filter(m => m.status === 'approved').length})
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-3 py-2 font-bold cursor-pointer transition-colors ${statusFilter === "rejected" ? "bg-red-700 text-white" : "text-on-surface-variant hover:text-foreground"}`}
            >
              {language === "bn" ? "বাতিল" : "Rejected"} ({members.filter(m => m.status === 'rejected').length})
            </button>
          </div>

          {/* Blood group dropdown */}
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="text-xs bg-surface dark:bg-background border border-border px-3 py-2 text-foreground font-bold focus:outline-none rounded-xl cursor-pointer"
          >
            <option value="all">{language === "bn" ? "রক্তের গ্রুপ: সকল" : "Blood Group: All"}</option>
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
      </div>

      {/* Members Table */}
      <div className="bg-surface-container-lowest dark:bg-surface-container-low shadow-sm border border-border overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface dark:bg-background border-b border-border text-on-surface-variant text-xs uppercase font-bold tracking-wider">
                <th className="p-4">{language === "bn" ? "সদস্য" : "Member"}</th>
                <th className="p-4">{language === "bn" ? "যোগাযোগ ও ঠিকানা" : "Contact & Address"}</th>
                <th className="p-4">{language === "bn" ? "রক্তের গ্রুপ" : "Blood"}</th>
                <th className="p-4">{language === "bn" ? "স্ট্যাটাস" : "Status"}</th>
                <th className="p-4">{language === "bn" ? "তারিখ" : "Registered"}</th>
                <th className="p-4 text-right">{language === "bn" ? "অ্যাকশন" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                    {language === "bn" ? "কোনো সদস্য পাওয়া যায়নি।" : "No members found matching your search."}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member: any) => (
                  <tr key={member._id} className="hover:bg-surface/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {member.photoUrl ? (
                          <div className="w-10 h-10 overflow-hidden shrink-0 border border-border rounded-xl">
                            <img src={member.photoUrl} alt={member.nameEn || "Member"} className="w-full h-full object-cover object-top rounded-xl" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-surface-variant dark:bg-white/5 flex items-center justify-center shrink-0 border border-border text-on-surface-variant font-bold rounded-xl">
                            {member.nameEn ? member.nameEn.charAt(0) : "M"}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-foreground text-sm">{member.nameBn || member.nameEn}</div>
                          {member.nameEn && member.nameBn && (
                            <div className="text-xs text-on-surface-variant">{member.nameEn}</div>
                          )}
                          {member.nidOrBirthCert && (
                            <div className="text-[11px] text-on-surface-variant opacity-75">NID: {member.nidOrBirthCert}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-foreground">{member.mobileNumber || "N/A"}</div>
                      <div className="text-xs text-on-surface-variant truncate max-w-[200px]">{member.presentAddress || member.email || "N/A"}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-transparent rounded-md">
                        {member.bloodGroup || "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold capitalize rounded-md ${
                        member.status === 'approved' ? 'bg-growth-green/10 text-growth-green' :
                        member.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {member.status === 'approved' ? (language === "bn" ? "অনুমোদিত" : "Approved") :
                         member.status === 'rejected' ? (language === "bn" ? "বাতিল" : "Rejected") :
                         (language === "bn" ? "পেন্ডিং" : "Pending")}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant">
                      {member.createdAt ? format(new Date(member.createdAt), "dd MMM yyyy") : "N/A"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Full Profile */}
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="p-1.5 bg-surface-variant hover:bg-surface-variant/80 text-foreground text-xs font-bold transition-colors cursor-pointer rounded-lg"
                          title={language === "bn" ? "বিবরণ দেখুন" : "View Details"}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Member Profile */}
                        <button
                          onClick={() => setMemberToEdit(member)}
                          className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold transition-colors cursor-pointer rounded-lg border border-blue-500/20"
                          title={language === "bn" ? "তথ্য সম্পাদনা করুন" : "Edit Member"}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Status toggles */}
                        {member.status !== "approved" && (
                          <button
                            disabled={isPending}
                            onClick={() => handleStatusChange(member._id, "approved")}
                            className="px-2 py-1 bg-growth-green hover:bg-[#236026] text-white text-xs font-bold transition-colors cursor-pointer rounded-lg"
                          >
                            {language === "bn" ? "অনুমোদন" : "Approve"}
                          </button>
                        )}
                        {member.status !== "rejected" && (
                          <button
                            disabled={isPending}
                            onClick={() => handleStatusChange(member._id, "rejected")}
                            className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer rounded-lg"
                          >
                            {language === "bn" ? "বাতিল" : "Reject"}
                          </button>
                        )}

                        {/* Delete member */}
                        <button
                          disabled={isPending}
                          onClick={() => handleDelete(member._id)}
                          className="p-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer rounded-lg"
                          title={language === "bn" ? "মুছে ফেলুন" : "Delete"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest dark:bg-surface-container-low w-full max-w-2xl border border-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden rounded-xl">
            <div className="flex justify-between items-center p-5 border-b border-border bg-surface dark:bg-surface-container-low">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-growth-green" />
                {language === "bn" ? "সদস্যের সম্পূর্ণ বিবরণ" : "Member Full Details"}
              </h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-on-surface-variant hover:text-foreground font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                {selectedMember.photoUrl ? (
                  <div className="w-20 h-20 border-2 border-growth-green overflow-hidden rounded-xl">
                    <img src={selectedMember.photoUrl} alt={selectedMember.nameEn} className="w-full h-full object-cover object-top rounded-xl" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-surface-variant flex items-center justify-center text-2xl font-bold border border-border rounded-xl">
                    {selectedMember.nameEn?.charAt(0) || "M"}
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-bold text-foreground">{selectedMember.nameEn}</h4>
                  <p className="text-sm font-bold text-growth-green">{selectedMember.nameBn}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-bold rounded-md ${
                    selectedMember.status === 'approved' ? 'bg-growth-green/10 text-growth-green' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedMember.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-xs text-on-surface-variant block font-bold">{language === "bn" ? "পিতা / স্বামীর নাম" : "Father / Husband Name"}</label>
                  <p className="font-bold text-foreground">{selectedMember.fatherHusbandName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block font-bold">{language === "bn" ? "মাতার নাম" : "Mother's Name"}</label>
                  <p className="font-bold text-foreground">{selectedMember.motherName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block font-bold">{language === "bn" ? "মোবাইল নম্বর" : "Mobile Number"}</label>
                  <p className="font-bold text-foreground">{selectedMember.mobileNumber || "N/A"}</p>
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block font-bold">{language === "bn" ? "হোয়াটসঅ্যাপ নম্বর" : "WhatsApp Number"}</label>
                  <p className="font-bold text-foreground">{selectedMember.whatsappNumber || "N/A"}</p>
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block font-bold">{language === "bn" ? "ইমেইল" : "Email"}</label>
                  <p className="font-bold text-foreground">{selectedMember.email || "N/A"}</p>
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block font-bold">{language === "bn" ? "জন্ম তারিখ" : "Date of Birth"}</label>
                  <p className="font-bold text-foreground">{selectedMember.dateOfBirth || "N/A"}</p>
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block font-bold">{language === "bn" ? "রক্তের গ্রুপ" : "Blood Group"}</label>
                  <p className="font-bold text-red-600">{selectedMember.bloodGroup || "N/A"}</p>
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block font-bold">{language === "bn" ? "NID / জন্ম নিবন্ধন" : "NID / Birth Cert Number"}</label>
                  <p className="font-bold text-foreground">{selectedMember.nidOrBirthCert || "N/A"}</p>
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant block font-bold">{language === "bn" ? "নিবন্ধনের সময়" : "Registered At"}</label>
                  <p className="font-bold text-foreground">{selectedMember.createdAt ? format(new Date(selectedMember.createdAt), "PPP p") : "N/A"}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-on-surface-variant block font-bold">{language === "bn" ? "বর্তমান ঠিকানা" : "Present Address"}</label>
                  <p className="font-bold text-foreground">{selectedMember.presentAddress || "N/A"}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-on-surface-variant block font-bold">{language === "bn" ? "স্থায়ী ঠিকানা" : "Permanent Address"}</label>
                  <p className="font-bold text-foreground">{selectedMember.permanentAddress || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-surface dark:bg-surface-container-low flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = selectedMember;
                    setSelectedMember(null);
                    setMemberToEdit(toEdit);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "সম্পাদনা করুন" : "Edit Profile"}</span>
                </button>
                <button
                  disabled={isPending}
                  onClick={() => handleDelete(selectedMember._id)}
                  className="px-4 py-2 bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors cursor-pointer rounded-xl"
                >
                  {language === "bn" ? "সদস্য মুছে ফেলুন" : "Delete Member"}
                </button>
              </div>

              <div className="flex gap-2">
                {selectedMember.status !== "approved" && (
                  <button
                    disabled={isPending}
                    onClick={() => handleStatusChange(selectedMember._id, "approved")}
                    className="px-4 py-2 bg-growth-green text-white font-bold text-xs hover:bg-[#236026] transition-colors cursor-pointer rounded-xl"
                  >
                    {language === "bn" ? "অনুমোদন করুন" : "Approve Member"}
                  </button>
                )}
                {selectedMember.status !== "rejected" && (
                  <button
                    disabled={isPending}
                    onClick={() => handleStatusChange(selectedMember._id, "rejected")}
                    className="px-4 py-2 bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors cursor-pointer rounded-xl"
                  >
                    {language === "bn" ? "বাতিল করুন" : "Reject Member"}
                  </button>
                )}
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 border border-border text-foreground font-bold text-xs hover:bg-surface-variant transition-colors cursor-pointer rounded-xl"
                >
                  {language === "bn" ? "বন্ধ করুন" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Confirmation Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDeleteMember}
        title={language === "bn" ? "সদস্য মুছে ফেলার নিশ্চয়তা" : "Delete Member"}
        message={language === "bn" ? "আপনি কি নিশ্চিতভাবে এই সদস্যের তথ্য ডেটাবেজ থেকে মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।" : "Are you sure you want to permanently delete this member? This action cannot be undone."}
        confirmText={language === "bn" ? "হ্যাঁ, মুছে ফেলুন" : "Yes, Delete"}
        cancelText={language === "bn" ? "বাতিল" : "Cancel"}
        type="danger"
      />
    </div>
  );
}
