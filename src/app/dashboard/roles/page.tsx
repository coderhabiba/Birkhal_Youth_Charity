"use client";

import { Shield, Plus, Users, Edit, Check, X, Trash2, Save, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useState, useEffect } from "react";
import { ConfirmModal } from "@/components/confirm-modal";

export default function RoleManagementPage() {
  const { language } = useLanguage();
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // New role form state
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/roles");
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (role: any) => {
    setEditingRoleId(role._id);
    setEditingPermissions(JSON.parse(JSON.stringify(role.permissions || {
      volunteers: { view: true, edit: false, delete: false },
      events: { view: true, edit: false, delete: false },
      financial: { view: false, edit: false, delete: false },
      content: { view: true, edit: false, delete: false },
      settings: { view: false, edit: false, delete: false },
    })));
  };

  const handlePermissionToggle = (module: string, action: 'view' | 'edit' | 'delete') => {
    setEditingPermissions((prev: any) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module]?.[action]
      }
    }));
  };

  const savePermissions = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/roles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: editingPermissions }),
      });

      if (res.ok) {
        setEditingRoleId(null);
        fetchRoles();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;
    setSaving(true);

    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newRoleName,
          description: newRoleDesc,
          isCritical: false,
          usersAssigned: 0,
          permissions: {
            volunteers: { view: true, edit: false, delete: false },
            events: { view: true, edit: false, delete: false },
            financial: { view: false, edit: false, delete: false },
            content: { view: true, edit: false, delete: false },
            settings: { view: false, edit: false, delete: false },
          }
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewRoleName("");
        setNewRoleDesc("");
        fetchRoles();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const [deleteTargetRole, setDeleteTargetRole] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteRole = (id: string, name: string) => {
    setDeleteTargetRole({ id, name });
  };

  const confirmDeleteRole = async () => {
    if (!deleteTargetRole) return;
    try {
      const res = await fetch(`/api/roles/${deleteTargetRole.id}`, { method: "DELETE" });
      if (res.ok) {
        setRoles(roles.filter((r) => r._id !== deleteTargetRole.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTargetRole(null);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-headline-xl text-3xl md:text-4xl text-foreground font-bold mb-1">
            {language === "bn" ? "রোলস ও অনুমতি ব্যবস্থাপনা" : "Role & Permission Management"}
          </h2>
          <p className="font-body-md text-on-surface-variant max-w-2xl">
            {language === "bn"
              ? "প্রশাসনিক কর্মকর্তা এবং বিভাগীয় প্রধানদের জন্য অ্যাক্সেস লেভেল নির্ধারণ ও পরিচালনা করুন। নির্দিষ্ট পারমিশন বরাদ্দ করে নিরাপদ অপারেশন নিশ্চিত করুন।"
              : "Define and manage access levels for administrative staff. Assign modular permissions to ensure secure and granular operations."}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-growth-green text-white px-5 py-2.5 font-bold shadow-sm hover:bg-[#236026] transition-all self-start cursor-pointer text-sm rounded-xl"
        >
          <Plus className="w-4 h-4" />
          {language === "bn" ? "নতুন রোল তৈরি করুন" : "Create New Role"}
        </button>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest dark:bg-surface-container-low w-full max-w-md border border-border shadow-2xl p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">{language === "bn" ? "নতুন রোল তৈরি করুন" : "Create New Role"}</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-foreground font-bold p-1 rounded-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "রোলের নাম" : "Role Name"} *</label>
                <input
                  required
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Media Officer"
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "বিবরণ" : "Description"} *</label>
                <textarea
                  required
                  rows={3}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Responsibilities and access scope..."
                  className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-border text-foreground font-bold text-xs rounded-xl cursor-pointer hover:bg-surface-variant">
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-growth-green text-white font-bold text-xs hover:bg-[#236026] flex items-center gap-1.5 rounded-xl cursor-pointer">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {language === "bn" ? "রোল তৈরি করুন" : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-growth-green mb-2" />
          <p className="text-sm">{language === "bn" ? "রোলস লোড হচ্ছে..." : "Loading roles..."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {roles.map((role) => {
            const isCurrentlyEditing = editingRoleId === role._id;
            return (
              <div key={role._id} className={`bg-surface-container-low dark:bg-surface-container-lowest p-6 shadow-sm border ${isCurrentlyEditing ? 'border-l-4 border-l-growth-green border-growth-green' : 'border-border'} hover:shadow-md transition-shadow backdrop-blur-md rounded-xl`}>
                <div className="flex flex-col lg:flex-row gap-6 justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-headline-md text-xl font-bold text-foreground">{role.name}</h3>
                      {role.nameBn && (
                        <span className="text-sm text-growth-green font-bold">({role.nameBn})</span>
                      )}
                      {role.isCritical && (
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[11px] font-bold uppercase tracking-wider rounded-md">
                          {language === "bn" ? "সিস্টেম রোল" : "System Protected"}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-on-surface-variant leading-relaxed">{role.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-foreground">
                      <Users className="w-4 h-4 text-on-surface-variant" />
                      <span className="font-bold">{role.usersAssigned || 0} {language === "bn" ? "জন ইউজার যুক্ত আছে" : "Users currently assigned"}</span>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2 justify-end items-end shrink-0">
                    {!isCurrentlyEditing ? (
                      <>
                        <button
                          onClick={() => startEditing(role)}
                          className="px-4 py-2 bg-growth-green/10 text-growth-green hover:bg-growth-green/20 font-bold text-xs border border-growth-green/30 flex items-center gap-1.5 cursor-pointer rounded-xl"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          {language === "bn" ? "পারমিশন সম্পাদনা" : "Edit Permissions"}
                        </button>
                        {!role.isCritical && (
                          <button
                            onClick={() => handleDeleteRole(role._id, role.name)}
                            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs border border-red-200 flex items-center gap-1.5 cursor-pointer rounded-xl"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {language === "bn" ? "মুছুন" : "Delete Role"}
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingRoleId(null)}
                          className="px-3 py-1.5 border border-border text-foreground font-bold text-xs cursor-pointer rounded-xl hover:bg-surface-variant"
                        >
                          {language === "bn" ? "বাতিল" : "Cancel"}
                        </button>
                        <button
                          disabled={saving}
                          onClick={() => savePermissions(role._id)}
                          className="px-4 py-1.5 bg-growth-green text-white font-bold text-xs hover:bg-[#236026] flex items-center gap-1.5 cursor-pointer rounded-xl"
                        >
                          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                          {language === "bn" ? "সংরক্ষণ" : "Save Matrix"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Permission Matrix */}
                {isCurrentlyEditing && editingPermissions && (
                  <div className="mt-6 border-t border-border pt-5">
                    <h4 className="font-headline-md text-sm text-foreground font-bold mb-3">
                      {language === "bn" ? "পারমিশন ম্যাট্রিক্স (অনুমতিসমূহ)" : "Permissions Matrix"}
                    </h4>

                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-surface dark:bg-background">
                            <th className="py-2.5 px-4 font-bold text-xs text-foreground uppercase tracking-wider">{language === "bn" ? "মডিউল" : "Module"}</th>
                            <th className="py-2.5 px-4 font-bold text-xs text-foreground uppercase tracking-wider text-center">{language === "bn" ? "দেখুন (View)" : "View"}</th>
                            <th className="py-2.5 px-4 font-bold text-xs text-foreground uppercase tracking-wider text-center">{language === "bn" ? "সম্পাদনা (Edit)" : "Edit"}</th>
                            <th className="py-2.5 px-4 font-bold text-xs text-foreground uppercase tracking-wider text-center">{language === "bn" ? "মুছুন (Delete)" : "Delete"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-xs">
                          {["volunteers", "events", "financial", "content", "settings"].map((modKey) => {
                            const modLabels: Record<string, string> = {
                              volunteers: language === "bn" ? "স্বেচ্ছাসেবক ও সদস্যবৃন্দ" : "Members & Volunteers",
                              events: language === "bn" ? "ইভেন্ট ক্যালেন্ডার" : "Events & Campaigns",
                              financial: language === "bn" ? "আর্থিক অনুদান ও ফান্ড" : "Financial & Donations",
                              content: language === "bn" ? "পেজ কন্টেন্ট ও মিডিয়া" : "Page Content & Media",
                              settings: language === "bn" ? "প্ল্যাটফর্ম সেটিংস" : "Platform Settings",
                            };

                            return (
                              <tr key={modKey} className="hover:bg-surface/50 transition-colors">
                                <td className="py-3 px-4 font-bold text-foreground">{modLabels[modKey]}</td>
                                <td className="py-3 px-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={!!editingPermissions[modKey]?.view}
                                    onChange={() => handlePermissionToggle(modKey, 'view')}
                                    className="accent-growth-green w-4 h-4 cursor-pointer"
                                  />
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={!!editingPermissions[modKey]?.edit}
                                    onChange={() => handlePermissionToggle(modKey, 'edit')}
                                    className="accent-growth-green w-4 h-4 cursor-pointer"
                                  />
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={!!editingPermissions[modKey]?.delete}
                                    onChange={() => handlePermissionToggle(modKey, 'delete')}
                                    className="accent-growth-green w-4 h-4 cursor-pointer"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modern Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetRole}
        onClose={() => setDeleteTargetRole(null)}
        onConfirm={confirmDeleteRole}
        title={language === "bn" ? "রোল মুছে ফেলার নিশ্চয়তা" : "Delete Role"}
        message={language === "bn" ? `আপনি কি নিশ্চিতভাবে "${deleteTargetRole?.name}" রোলটি মুছে ফেলতে চান?` : `Are you sure you want to permanently delete the "${deleteTargetRole?.name}" role?`}
        confirmText={language === "bn" ? "হ্যাঁ, মুছে ফেলুন" : "Yes, Delete"}
        cancelText={language === "bn" ? "বাতিল" : "Cancel"}
        type="danger"
      />
    </>
  );
}
