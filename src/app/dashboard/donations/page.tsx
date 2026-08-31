"use client";

import { useState, useEffect } from "react";
import { Plus, Filter, TrendingUp, Calendar, Users, Download, HeartHandshake, Trash2, Edit, Search, X, Check, FileSpreadsheet } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { ConfirmModal } from "@/components/confirm-modal";

export default function DonationsAnalyticsPage() {
  const { language } = useLanguage();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDonation, setEditingDonation] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await fetch('/api/donations');
      if (res.ok) {
        const data = await res.json();
        setDonations(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAddDonation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAdding(true);
    setErrorMsg("");
    setSuccessMsg("");
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());
    
    data.amount = Number(data.amount) || 0;

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to record donation");
      }
      setShowForm(false);
      fetchDonations();
      setSuccessMsg(language === "bn" ? "অনুদান সফলভাবে রেকর্ড করা হয়েছে।" : "Donation recorded successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      setErrorMsg(error.message || "Error saving donation");
    } finally {
      setAdding(false);
    }
  };

  const handleEditDonation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDonation) return;
    setAdding(true);
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());
    data.amount = Number(data.amount) || 0;

    try {
      const res = await fetch(`/api/donations/${editingDonation._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to update donation");
      }
      setEditingDonation(null);
      fetchDonations();
      setSuccessMsg(language === "bn" ? "অনুদান রেকর্ড সফলভাবে আপডেট করা হয়েছে।" : "Donation updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error: any) {
      setErrorMsg(error.message || "Error updating donation");
    } finally {
      setAdding(false);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteDonation = (id: string, donorName: string) => {
    setDeleteTarget({ id, name: donorName });
  };

  const confirmDeleteDonation = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/donations/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDonations(donations.filter((d) => d._id !== deleteTarget.id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const exportCSV = () => {
    if (donations.length === 0) return;
    const headers = ["Donor Name", "Amount (BDT)", "Category", "Mobile", "TrxID", "Date", "Status"];
    const rows = filteredDonations.map(d => [
      `"${d.donorName}"`,
      d.amount,
      `"${d.category}"`,
      `"${d.mobileNumber || ''}"`,
      `"${d.transactionId || ''}"`,
      `"${d.date}"`,
      `"${d.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `birkhal_donations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAmount = donations.reduce((sum, d) => sum + (d.status === 'Completed' ? Number(d.amount) : 0), 0);
  const pendingAmount = donations.reduce((sum, d) => sum + (d.status === 'Pending' ? Number(d.amount) : 0), 0);

  const filteredDonations = donations.filter((d) => {
    const matchesSearch = 
      (d.donorName && d.donorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.mobileNumber && d.mobileNumber.includes(searchTerm)) ||
      (d.transactionId && d.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <>
      {/* Notifications */}
      {successMsg && (
        <div className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 p-3.5 rounded-xl mb-4 text-xs font-bold border border-green-300">
          ✓ {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3.5 rounded-xl mb-4 text-xs font-bold border border-red-300">
          ✕ {errorMsg}
        </div>
      )}

      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="font-headline-xl text-3xl md:text-4xl text-foreground font-bold mb-1">
            {language === "bn" ? "অনুদান ব্যবস্থাপনা ও হিসাব" : "Donation Management"}
          </h2>
          <p className="font-body-md text-on-surface-variant">
            {language === "bn" 
              ? "আর্থিক অবদান, যাকাত, সাধারণ অনুদান ও দাতাদের লেনদেনের পূর্ণ বিবরণ ও হিসাব।" 
              : "Overview of financial contributions, zakat, and donor records."}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="border border-border bg-surface dark:bg-background hover:bg-surface-variant text-foreground font-bold px-3 py-2 text-sm flex items-center gap-2 transition-colors cursor-pointer rounded-xl"
          >
            <FileSpreadsheet className="w-4 h-4 text-growth-green" />
            {language === "bn" ? "CSV ডাউনলোড" : "Export CSV"}
          </button>
          <button 
            onClick={() => {
              setErrorMsg("");
              setShowForm(!showForm);
            }}
            className="bg-growth-green text-white font-bold px-4 py-2 text-sm flex items-center gap-2 hover:bg-[#236026] transition-colors cursor-pointer shadow-sm rounded-xl"
          >
            <Plus className="w-4 h-4" /> 
            {showForm 
              ? (language === "bn" ? "ফর্ম বন্ধ করুন" : "Close Form") 
              : (language === "bn" ? "নতুন অনুদান যোগ" : "Record Donation")}
          </button>
        </div>
      </div>

      {/* Add Donation Form */}
      {showForm && (
        <div className="bg-surface-container-low dark:bg-surface-container-lowest p-6 shadow-sm border border-border mb-8 backdrop-blur-md rounded-xl">
          <h3 className="font-bold text-lg mb-4 text-foreground">
            {language === "bn" ? "নতুন অনুদান রেকর্ড করুন" : "Record New Donation"}
          </h3>
          <form onSubmit={handleAddDonation} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                {language === "bn" ? "দাতার নাম" : "Donor Name"} *
              </label>
              <input required type="text" name="donorName" placeholder={language === "bn" ? "উদা: মুহাম্মদ আব্দুল্লাহ" : "e.g. Md. Abdullah"} className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl focus:border-growth-green outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                {language === "bn" ? "পরিমাণ (৳)" : "Amount (৳)"} *
              </label>
              <input required type="number" min="1" name="amount" placeholder="5000" className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl focus:border-growth-green outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                {language === "bn" ? "তারিখ" : "Date"} *
              </label>
              <input required type="date" name="date" defaultValue={new Date().toISOString().slice(0, 10)} className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl focus:border-growth-green outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                {language === "bn" ? "মোবাইল নম্বর (ঐচ্ছিক)" : "Mobile Number (Optional)"}
              </label>
              <input type="tel" name="mobileNumber" placeholder="01XXXXXXXXX" className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl focus:border-growth-green outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                {language === "bn" ? "ট্রানজেকশন আইডি (ঐচ্ছিক)" : "Transaction ID (Optional)"}
              </label>
              <input type="text" name="transactionId" placeholder="e.g. 9J3K8L2M" className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl focus:border-growth-green outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                {language === "bn" ? "ক্যাটাগরি" : "Category"}
              </label>
              <select name="category" className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl cursor-pointer focus:border-growth-green outline-none">
                <option value="General">{language === "bn" ? "সাধারণ অনুদান (General)" : "General"}</option>
                <option value="Education">{language === "bn" ? "শিক্ষা সহায়তা (Education)" : "Education"}</option>
                <option value="Health">{language === "bn" ? "চিকিৎসা সেবা (Health)" : "Health"}</option>
                <option value="Zakat">{language === "bn" ? "যাকাত তহবিল (Zakat)" : "Zakat"}</option>
                <option value="Emergency">{language === "bn" ? "জরুরি ত্রাণ তহবিল (Emergency)" : "Emergency"}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                {language === "bn" ? "স্ট্যাটাস" : "Status"}
              </label>
              <select name="status" className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl cursor-pointer focus:border-growth-green outline-none">
                <option value="Completed">{language === "bn" ? "সম্পন্ন (Completed)" : "Completed"}</option>
                <option value="Pending">{language === "bn" ? "পেন্ডিং (Pending)" : "Pending"}</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-2 flex items-end justify-end">
              <button disabled={adding} type="submit" className="bg-growth-green text-white px-6 py-2.5 font-bold text-sm cursor-pointer hover:bg-[#236026] transition-colors disabled:opacity-50 rounded-xl shadow-xs">
                {adding 
                  ? (language === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") 
                  : (language === "bn" ? "সংরক্ষণ করুন" : "Save Donation")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Donation Modal */}
      {editingDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest dark:bg-surface-container-low w-full max-w-lg border border-border shadow-2xl p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">{language === "bn" ? "অনুদান সম্পাদনা করুন" : "Edit Donation Record"}</h3>
              <button onClick={() => setEditingDonation(null)} className="text-on-surface-variant hover:text-foreground font-bold p-1 rounded-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleEditDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "দাতার নাম" : "Donor Name"} *</label>
                <input required type="text" name="donorName" defaultValue={editingDonation.donorName} className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "পরিমাণ (৳)" : "Amount (৳)"} *</label>
                <input required type="number" min="1" name="amount" defaultValue={editingDonation.amount} className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "তারিখ" : "Date"} *</label>
                <input required type="date" name="date" defaultValue={editingDonation.date} className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "মোবাইল নম্বর" : "Mobile Number"}</label>
                <input type="tel" name="mobileNumber" defaultValue={editingDonation.mobileNumber || ''} className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "ট্রানজেকশন আইডি" : "Transaction ID"}</label>
                <input type="text" name="transactionId" defaultValue={editingDonation.transactionId || ''} className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "ক্যাটাগরি" : "Category"}</label>
                <select name="category" defaultValue={editingDonation.category} className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl cursor-pointer">
                  <option value="General">General</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Zakat">Zakat</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">{language === "bn" ? "স্ট্যাটাস" : "Status"}</label>
                <select name="status" defaultValue={editingDonation.status} className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground rounded-xl cursor-pointer">
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={() => setEditingDonation(null)} className="px-4 py-2 border border-border text-foreground font-bold text-xs rounded-xl cursor-pointer hover:bg-surface-variant">
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button type="submit" disabled={adding} className="px-5 py-2 bg-growth-green text-white font-bold text-xs hover:bg-[#236026] rounded-xl cursor-pointer">
                  {adding ? (language === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : (language === "bn" ? "সংরক্ষণ করুন" : "Save Changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-surface-container-low dark:bg-surface-container-lowest p-5 shadow-sm border border-border relative overflow-hidden backdrop-blur-md rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2.5 bg-growth-green/10 text-growth-green rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {language === "bn" ? "মোট সংগৃহীত অনুদান" : "Total Completed Donations"}
          </p>
          <h3 className="text-2xl font-bold text-foreground mt-1">৳{totalAmount.toLocaleString()}</h3>
        </div>

        <div className="bg-surface-container-low dark:bg-surface-container-lowest p-5 shadow-sm border border-border relative overflow-hidden backdrop-blur-md rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {language === "bn" ? "পেন্ডিং অনুদান" : "Pending Amount"}
          </p>
          <h3 className="text-2xl font-bold text-foreground mt-1">৳{pendingAmount.toLocaleString()}</h3>
        </div>

        <div className="bg-surface-container-low dark:bg-surface-container-lowest p-5 shadow-sm border border-border relative overflow-hidden backdrop-blur-md rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {language === "bn" ? "মোট দাতা / এন্ট্রি" : "Total Donor Records"}
          </p>
          <h3 className="text-2xl font-bold text-foreground mt-1">{donations.length}</h3>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-surface-container-low dark:bg-surface-container-lowest p-4 border border-border flex flex-col md:flex-row gap-4 items-center justify-between mb-6 rounded-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === "bn" ? "দাতার নাম দিয়ে খুঁজুন..." : "Search by donor name..."}
            className="w-full pl-9 pr-3 py-2 text-sm bg-surface dark:bg-background border border-border focus:outline-none focus:border-growth-green text-foreground rounded-xl"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-surface dark:bg-background border border-border px-3 py-2 text-foreground font-bold focus:outline-none rounded-xl cursor-pointer"
          >
            <option value="all">{language === "bn" ? "সকল ক্যাটাগরি" : "All Categories"}</option>
            <option value="General">General</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Zakat">Zakat</option>
            <option value="Emergency">Emergency</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-surface dark:bg-background border border-border px-3 py-2 text-foreground font-bold focus:outline-none rounded-xl cursor-pointer"
          >
            <option value="all">{language === "bn" ? "সকল স্ট্যাটাস" : "All Status"}</option>
            <option value="Completed">{language === "bn" ? "সম্পন্ন (Completed)" : "Completed"}</option>
            <option value="Pending">{language === "bn" ? "পেন্ডিং (Pending)" : "Pending"}</option>
          </select>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-surface-container-low dark:bg-surface-container-lowest shadow-sm border border-border overflow-hidden backdrop-blur-md rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface dark:bg-background text-on-surface-variant text-xs uppercase font-bold border-b border-border">
                <th className="p-4">{language === "bn" ? "দাতা" : "Donor"}</th>
                <th className="p-4">{language === "bn" ? "পরিমাণ" : "Amount"}</th>
                <th className="p-4">{language === "bn" ? "ক্যাটাগরি" : "Category"}</th>
                <th className="p-4">{language === "bn" ? "তারিখ" : "Date"}</th>
                <th className="p-4">{language === "bn" ? "স্ট্যাটাস" : "Status"}</th>
                <th className="p-4 text-right">{language === "bn" ? "অ্যাকশন" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant text-sm">
                    {language === "bn" ? "লোড হচ্ছে..." : "Loading donations..."}
                  </td>
                </tr>
              ) : filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant text-sm">
                    {language === "bn" ? "কোনো অনুদানের রেকর্ড পাওয়া যায়নি।" : "No donation records found."}
                  </td>
                </tr>
              ) : (
                filteredDonations.map((trx) => (
                  <tr key={trx._id} className="hover:bg-surface/50 transition-colors text-sm">
                    <td className="p-4 font-bold text-foreground">{trx.donorName}</td>
                    <td className="p-4 text-growth-green font-bold">৳{trx.amount.toLocaleString()}</td>
                    <td className="p-4 text-on-surface-variant">{trx.category}</td>
                    <td className="p-4 text-xs text-on-surface-variant">{trx.date}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                        trx.status === 'Completed' ? 'bg-growth-green/10 text-growth-green' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingDonation(trx)}
                          className="p-1.5 bg-surface-variant hover:bg-surface-variant/80 text-foreground text-xs font-bold cursor-pointer rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDonation(trx._id, trx.donorName)}
                          className="p-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold cursor-pointer rounded-lg"
                          title="Delete"
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

      {/* Modern Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteDonation}
        title={language === "bn" ? "অনুদান রেকর্ড মুছে ফেলার নিশ্চয়তা" : "Delete Donation Record"}
        message={language === "bn" ? `আপনি কি নিশ্চিতভাবে "${deleteTarget?.name}" এর অনুদানের রেকর্ডটি মুছে ফেলতে চান?` : `Are you sure you want to permanently delete the donation record from "${deleteTarget?.name}"?`}
        confirmText={language === "bn" ? "হ্যাঁ, মুছে ফেলুন" : "Yes, Delete"}
        cancelText={language === "bn" ? "বাতিল" : "Cancel"}
        type="danger"
      />
    </>
  );
}
