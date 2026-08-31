"use client";

import { useState, useEffect } from "react";
import { Filter, Search, History, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { format } from "date-fns";
import { ConfirmModal } from "@/components/confirm-modal";

export default function ActivityLogPage() {
  const { language } = useLanguage();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [userFilter, actionFilter, moduleFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (userFilter !== "all") params.append("user", userFilter);
      if (actionFilter !== "all") params.append("action", actionFilter);
      if (moduleFilter !== "all") params.append("module", moduleFilter);

      const res = await fetch(`/api/activity?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearLogs = () => {
    setShowClearConfirm(true);
  };

  const confirmClearLogs = async () => {
    try {
      const res = await fetch("/api/activity", { method: "DELETE" });
      if (res.ok) {
        setLogs([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowClearConfirm(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Create': return 'bg-growth-green/10 text-growth-green dark:text-green-400';
      case 'Update': return 'bg-reliability-blue/10 text-reliability-blue dark:text-blue-400';
      case 'Delete': return 'bg-red-500/10 text-red-500 dark:text-red-400';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  const getActionLabel = (action: string) => {
    if (language === "bn") {
      switch (action) {
        case 'Create': return 'তৈরি';
        case 'Update': return 'আপডেট';
        case 'Delete': return 'মুছুন';
        default: return action;
      }
    }
    return action;
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    return (
      (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.module && log.module.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="font-headline-xl text-3xl md:text-4xl text-foreground font-bold mb-1">
            {language === "bn" ? "অ্যাক্টিভিটি লগ" : "Activity Log"}
          </h2>
          <p className="font-body-md text-on-surface-variant">
            {language === "bn" 
              ? "স্বচ্ছতা ও নিরাপত্তার জন্য সমস্ত প্রশাসনিক পদক্ষেপ এবং সিস্টেম পরিবর্তন পর্যবেক্ষণ করুন।" 
              : "Monitor all administrative actions and system modifications for accountability and audit."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="p-2 border border-border bg-surface dark:bg-background text-foreground hover:bg-surface-variant transition-colors cursor-pointer rounded-xl"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleClearLogs}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer rounded-xl"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {language === "bn" ? "লগ পরিষ্কার করুন" : "Clear All Logs"}
          </button>
        </div>
      </div>

      {/* Controls / Filters Bar */}
      <div className="bg-surface-container-low dark:bg-surface-container-lowest p-4 shadow-sm border border-border flex flex-wrap gap-4 items-end mb-6 backdrop-blur-md rounded-xl">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-bold text-foreground mb-1">
            {language === "bn" ? "ইউজার" : "User"}
          </label>
          <select 
            value={userFilter} 
            onChange={(e) => setUserFilter(e.target.value)}
            className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground focus:outline-none rounded-xl cursor-pointer"
          >
            <option value="all">{language === "bn" ? "সমস্ত ইউজার" : "All Users"}</option>
            <option value="Admin">Admin</option>
            <option value="System">System</option>
          </select>
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-bold text-foreground mb-1">
            {language === "bn" ? "অ্যাকশনের ধরন" : "Action Type"}
          </label>
          <select 
            value={actionFilter} 
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground focus:outline-none rounded-xl cursor-pointer"
          >
            <option value="all">{language === "bn" ? "সমস্ত অ্যাকশন" : "All Actions"}</option>
            <option value="Create">Create (তৈরি)</option>
            <option value="Update">Update (আপডেট)</option>
            <option value="Delete">Delete (মুছুন)</option>
          </select>
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-bold text-foreground mb-1">
            {language === "bn" ? "মডিউল" : "Module"}
          </label>
          <select 
            value={moduleFilter} 
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground focus:outline-none rounded-xl cursor-pointer"
          >
            <option value="all">{language === "bn" ? "সমস্ত মডিউল" : "All Modules"}</option>
            <option value="Members">Members</option>
            <option value="Donations">Donations</option>
            <option value="Events">Events</option>
            <option value="Media">Media</option>
            <option value="Roles">Roles</option>
            <option value="Settings">Settings</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-foreground mb-1">
            {language === "bn" ? "অনুসন্ধান" : "Search Details"}
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === "bn" ? "বিস্তারিত খুঁজুন..." : "Filter text..."}
              className="w-full pl-8 pr-3 py-1.5 bg-surface dark:bg-background border border-border text-xs text-foreground focus:outline-none rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Activity List Table */}
      <div className="bg-surface-container-low dark:bg-surface-container-lowest shadow-sm border border-border overflow-hidden backdrop-blur-md rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface dark:bg-background border-b border-border text-xs uppercase font-bold text-on-surface-variant">
                <th className="p-4">{language === "bn" ? "ইউজার" : "User"}</th>
                <th className="p-4">{language === "bn" ? "অ্যাকশন" : "Action"}</th>
                <th className="p-4">{language === "bn" ? "মডিউল" : "Module"}</th>
                <th className="p-4">{language === "bn" ? "বিবরণ" : "Details"}</th>
                <th className="p-4 text-right">{language === "bn" ? "সময়" : "Time"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-growth-green mb-1" />
                    <span className="text-xs">{language === "bn" ? "লগ লোড হচ্ছে..." : "Loading logs..."}</span>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant text-xs">
                    {language === "bn" ? "কোনো অ্যাক্টিভিটি পাওয়া যায়নি।" : "No activity logs found."}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-surface/50 transition-colors text-sm">
                    <td className="p-4 text-xs font-bold text-foreground">{log.user}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${getActionColor(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-bold text-on-surface-variant">{log.module}</td>
                    <td className="p-4 text-xs text-foreground">{log.details}</td>
                    <td className="p-4 text-xs text-on-surface-variant text-right whitespace-nowrap">
                      {log.createdAt ? format(new Date(log.createdAt), "dd MMM yyyy, hh:mm a") : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Confirm Clear Logs Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearLogs}
        title={language === "bn" ? "অ্যাক্টিভিটি লগ মুছে ফেলার নিশ্চয়তা" : "Clear Activity Logs"}
        message={language === "bn" ? "আপনি কি নিশ্চিতভাবে সমস্ত সিস্টেম অ্যাক্টিভিটি লগ মুছে ফেলতে চান? এটি আর রিকভার করা যাবে না।" : "Are you sure you want to permanently clear all activity logs? This action cannot be undone."}
        confirmText={language === "bn" ? "হ্যাঁ, সমস্ত লগ মুছুন" : "Yes, Clear All"}
        cancelText={language === "bn" ? "বাতিল" : "Cancel"}
        type="danger"
      />
    </>
  );
}
