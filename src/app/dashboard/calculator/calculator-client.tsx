'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/components/language-provider';
import { ConfirmModal } from '@/components/confirm-modal';
import {
  Calculator,
  TrendingDown,
  TrendingUp,
  Wallet,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Download,
  Printer,
  Calendar,
  User,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  PieChart,
  RefreshCw,
  Coins,
  Receipt,
  HelpCircle,
} from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseItem {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  spentBy?: string;
  voucherNo?: string;
  notes?: string;
  createdAt?: string;
}

interface CalculatorClientProps {
  initialTotalDonations: number;
  initialTotalExpenses: number;
  initialExpenses: ExpenseItem[];
}

const CATEGORIES = [
  'ত্রাণ ও খাদ্য সহায়তা',
  'শিক্ষা ও বৃত্তি সহায়তা',
  'চিকিৎসা ও স্বাস্থ্যসেবা',
  'ইভেন্ট ও ক্যাম্পেইন খরচ',
  'অফিস ও স্টেশনারি',
  'প্রচার ও মিডিয়া',
  'জরুরি তহবিল ব্যয়',
  'অন্যান্য খরচ',
];

const CATEGORY_COLORS: Record<string, string> = {
  'ত্রাণ ও খাদ্য সহায়তা': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'শিক্ষা ও বৃত্তি সহায়তা': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'চিকিৎসা ও স্বাস্থ্যসেবা': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  'ইভেন্ট ও ক্যাম্পেইন খরচ': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'অফিস ও স্টেশনারি': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'প্রচার ও মিডিয়া': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  'জরুরি তহবিল ব্যয়': 'bg-red-500/10 text-red-600 border-red-500/20',
  'অন্যান্য খরচ': 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

export function CalculatorClient({
  initialTotalDonations,
  initialTotalExpenses,
  initialExpenses,
}: CalculatorClientProps) {
  const { language } = useLanguage();

  const [totalDonations, setTotalDonations] = useState(initialTotalDonations);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [loading, setLoading] = useState(false);

  // Form & Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Interactive Live Calculator Simulation State
  const [simulatedExpense, setSimulatedExpense] = useState<string>('');
  const [simulatedPurpose, setSimulatedPurpose] = useState<string>('');
  const [calcDisplay, setCalcDisplay] = useState<string>('');

  // Total current expenses calculated directly from active list
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  // Current Net Balance: Total Donations - Total Expenses
  const netBalance = totalDonations - totalExpenses;

  // Percentage spent
  const percentageSpent = totalDonations > 0 ? ((totalExpenses / totalDonations) * 100).toFixed(1) : '0';

  // Filtered and Sorted Expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((exp) => {
        const matchesCategory =
          selectedCategory === 'all' || exp.category === selectedCategory;
        const matchesSearch =
          exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (exp.spentBy && exp.spentBy.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (exp.voucherNo && exp.voucherNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (exp.category && exp.category.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [expenses, selectedCategory, searchQuery, sortBy]);

  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [filteredExpenses]);

  // Refresh data from server
  const refreshData = async () => {
    try {
      setLoading(true);
      const [donationsRes, expensesRes] = await Promise.all([
        fetch('/api/donations'),
        fetch('/api/expenses'),
      ]);
      if (donationsRes.ok) {
        const donationsData = await donationsRes.json();
        const total = (donationsData || [])
          .filter((d: any) => d.status === 'Completed')
          .reduce((sum: number, d: any) => sum + (Number(d.amount) || 0), 0);
        setTotalDonations(total);
      }
      if (expensesRes.ok) {
        const expensesData = await expensesRes.json();
        setExpenses(expensesData);
      }
    } catch (err) {
      console.error('Failed to reload data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add Expense Handler
  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      title: formData.get('title'),
      amount: Number(formData.get('amount')),
      category: formData.get('category'),
      date: formData.get('date'),
      spentBy: formData.get('spentBy'),
      voucherNo: formData.get('voucherNo'),
      notes: formData.get('notes'),
    };

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ব্যয় যোগ করতে ব্যর্থ হয়েছে।');
      }

      setExpenses((prev) => [data.expense, ...prev]);
      setShowAddModal(false);
      form.reset();
      setSuccessMessage(language === 'bn' ? 'ব্যয় সফলভাবে রেকর্ড করা হয়েছে!' : 'Expense recorded successfully!');
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'একটি ত্রুটি ঘটেছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Expense Handler
  const handleEditExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingExpense) return;
    setIsSubmitting(true);
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      title: formData.get('title'),
      amount: Number(formData.get('amount')),
      category: formData.get('category'),
      date: formData.get('date'),
      spentBy: formData.get('spentBy'),
      voucherNo: formData.get('voucherNo'),
      notes: formData.get('notes'),
    };

    try {
      const res = await fetch(`/api/expenses/${editingExpense._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ব্যয় আপডেট করতে ব্যর্থ হয়েছে।');
      }

      setExpenses((prev) =>
        prev.map((exp) => (exp._id === editingExpense._id ? data.expense : exp))
      );
      setEditingExpense(null);
      setSuccessMessage(language === 'bn' ? 'ব্যয়ের হিসাব সফলভাবে আপডেট হয়েছে!' : 'Expense updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'একটি ত্রুটি ঘটেছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Expense Handler
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/expenses/${deletingId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('ব্যয় মুছে ফেলা সম্ভব হয়নি।');
      }
      setExpenses((prev) => prev.filter((exp) => exp._id !== deletingId));
      setDeletingId(null);
      setSuccessMessage(language === 'bn' ? 'ব্যয় সফলভাবে মুছে ফেলা হয়েছে।' : 'Expense record deleted.');
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ['তারিখ (Date)', 'বিবরণ (Title)', 'খাত (Category)', 'পরিমাণ ৳ (Amount)', 'ব্যয়কারী (Spent By)', 'ভাউচার নং (Voucher)', 'নোট (Notes)'];
    const rows = filteredExpenses.map((exp) => [
      `"${exp.date}"`,
      `"${(exp.title || '').replace(/"/g, '""')}"`,
      `"${(exp.category || '').replace(/"/g, '""')}"`,
      exp.amount,
      `"${(exp.spentBy || '').replace(/"/g, '""')}"`,
      `"${(exp.voucherNo || '').replace(/"/g, '""')}"`,
      `"${(exp.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `birkhal_expenses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick Calculator keypad input
  const handleCalcButton = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('');
    } else if (val === '=') {
      try {
        // Safe evaluation of basic math: numbers, +, -, *, /, .
        const sanitized = calcDisplay.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${sanitized})`)();
        if (!isNaN(result) && isFinite(result)) {
          setCalcDisplay(String(Math.round(result * 100) / 100));
          setSimulatedExpense(String(Math.round(result)));
        }
      } catch (e) {
        setCalcDisplay('Error');
      }
    } else {
      setCalcDisplay((prev) => prev + val);
    }
  };

  // Simulated Deduction calculations
  const simVal = Number(simulatedExpense) || 0;
  const simulatedRemaining = netBalance - simVal;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-growth-green text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-sm">{successMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              {language === 'bn' ? 'আয়-ব্যয় হিসাব ও ব্যালেন্স ক্যালকুলেটর' : 'Income, Expense & Balance Ledger'}
            </span>
          </div>
          <h1 className="font-headline-lg text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            {language === 'bn' ? 'হিসাব-নিকাশ ও তহবিল স্থিতি' : 'Financial Ledger & Calculator'}
          </h1>
          <p className="text-on-surface-variant font-body-md text-sm mt-1">
            {language === 'bn'
              ? 'বীরখাল যুব সংগঠনের মোট অনুদান থেকে ব্যয়ের হিসাব মাইনাস করে লাইভ স্থিতি দেখুন এবং যাবতীয় খরচের তালিকা পরিচালনা করুন।'
              : 'Track organization income, log detailed expenses, and calculate dynamic net fund balance in real-time.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={refreshData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-border bg-surface dark:bg-background hover:bg-surface-variant text-foreground transition-colors cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-growth-green' : ''}`} />
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 rounded-xl border border-border bg-surface dark:bg-background hover:bg-surface-variant text-foreground text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{language === 'bn' ? 'এক্সেল / CSV এক্সপোর্ট' : 'Export CSV'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-border bg-surface dark:bg-background hover:bg-surface-variant text-foreground text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>{language === 'bn' ? 'প্রিন্ট রিপোর্ট' : 'Print Report'}</span>
          </button>
          <button
            onClick={() => {
              setErrorMessage('');
              setShowAddModal(true);
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন ব্যয় যুক্ত করুন' : 'Record Expense'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 CORE DYNAMIC STATE CARDS: INCOME, EXPENSE, NET REMAINING BALANCE        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Income / Donations (Emerald Growth Green) */}
        <div className="bg-surface-container-lowest dark:bg-surface-container-low p-6 rounded-2xl border border-border shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {language === 'bn' ? 'মোট অনুদান / আয়' : 'Total Income'}
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {language === 'bn' ? 'সর্বমোট সংগৃহীত অনুদান' : 'Total Collected Donations'}
          </p>
          <p className="text-3xl sm:text-4xl font-black text-foreground mt-2 tracking-tight">
            ৳{totalDonations.toLocaleString()}
          </p>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-on-surface-variant">
            <span>{language === 'bn' ? 'সংগঠনের সাধারণ ও বিশেষ তহবিল' : 'Verified General & Project Funds'}</span>
            <span className="text-emerald-600 font-bold">100%</span>
          </div>
        </div>

        {/* Card 2: Total Expenses (Crimson / Rose Red) */}
        <div className="bg-surface-container-lowest dark:bg-surface-container-low p-6 rounded-2xl border border-rose-500/30 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              {language === 'bn' ? 'মোট ব্যয় / খরচ' : 'Total Expenses'}
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {language === 'bn' ? 'যাবতীয় অনুমোদিত ব্যয়' : 'Total Approved Expenditures'}
          </p>
          <p className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 mt-2 tracking-tight">
            ৳{totalExpenses.toLocaleString()}
          </p>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-on-surface-variant">
            <span>{language === 'bn' ? 'মোট অনুদানের ব্যয়িত অংশ' : 'Portion of total income spent'}</span>
            <span className="text-rose-600 font-bold">{percentageSpent}%</span>
          </div>
        </div>

        {/* Card 3: Net Remaining Balance / অবশিষ্ট তহবিল (Royal Indigo/Teal) */}
        <div className={`p-6 rounded-2xl border-2 shadow-xs relative overflow-hidden group ${
          netBalance >= 0
            ? 'bg-surface-container-lowest dark:bg-surface-container-low border-indigo-500/40'
            : 'bg-rose-500/5 border-rose-500/50'
        }`}>
          <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl ${
              netBalance >= 0
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}>
              <Wallet className="w-6 h-6" />
            </div>
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border flex items-center gap-1 ${
              netBalance >= 0
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse'
            }`}>
              {netBalance >= 0 ? (
                <span>{language === 'bn' ? '✓ উদ্বৃত্ত তহবিল' : 'Surplus Balance'}</span>
              ) : (
                <span>{language === 'bn' ? '⚠ তহবিল ঘাটতি' : 'Deficit'}</span>
              )}
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {language === 'bn' ? 'বর্তমান অবশিষ্ট ব্যালেন্স (তহবিল স্থিতি)' : 'Net Remaining Balance (Income - Expense)'}
          </p>
          <p className={`text-3xl sm:text-4xl font-black mt-2 tracking-tight ${
            netBalance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            ৳{netBalance.toLocaleString()}
          </p>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-on-surface-variant">
            <span>{language === 'bn' ? 'সূত্র: অনুদান ৳ - ব্যয় ৳' : 'Formula: Income minus Expenses'}</span>
            <span className="font-bold text-foreground">
              {netBalance >= 0
                ? `${(100 - Number(percentageSpent)).toFixed(1)}% সংরক্ষিত`
                : 'জরুরি ফান্ড প্রয়োজন'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE EXPENSE CALCULATOR & SIMULATOR WIDGET                         */}
      {/* ========================================================================= */}
      <div className="bg-surface-container-lowest dark:bg-surface-container-low p-6 sm:p-7 rounded-2xl border border-border shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-border gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>{language === 'bn' ? 'লাইভ ব্যয় কর্তন ও ব্যালেন্স ক্যালকুলেটর' : 'Live Expense Deduction & Impact Calculator'}</span>
                <span className="text-[10px] bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-full font-bold">
                  {language === 'bn' ? 'ডায়নামিক টুল' : 'Interactive'}
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {language === 'bn'
                  ? 'কোনো খাতে টাকা খরচ করার পূর্বে টেস্ট করুন—খরচের টাকা বিয়োগ করলে অবশিষ্ট ফান্ডে কী প্রভাব পড়বে।'
                  : 'Simulate any prospective expense before committing, and see instant impact on remaining funds.'}
              </p>
            </div>
          </div>

          {/* Quick Clear Button */}
          {(simulatedExpense || simulatedPurpose || calcDisplay) && (
            <button
              onClick={() => {
                setSimulatedExpense('');
                setSimulatedPurpose('');
                setCalcDisplay('');
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer self-start lg:self-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রিসেট করুন' : 'Reset Calculator'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left: Input & Simulation Slider */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  {language === 'bn' ? 'সম্ভাব্য ব্যয়ের খাত / কাজের বিবরণ' : 'Planned Expense Purpose'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'যেমন: কম্বল ক্রয় বা ত্রাণ সামগ্রী' : 'e.g., Winter blanket distribution'}
                  value={simulatedPurpose}
                  onChange={(e) => setSimulatedPurpose(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  {language === 'bn' ? 'কর্তনযোগ্য ব্যয়ের পরিমাণ (৳)' : 'Expense Amount to Deduct (৳)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">৳</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={simulatedExpense}
                    onChange={(e) => setSimulatedExpense(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm font-bold text-foreground bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-on-surface-variant font-medium">
                {language === 'bn' ? 'দ্রুত পরিমাণ নির্বাচন:' : 'Quick Presets:'}
              </span>
              {[1000, 3000, 5000, 10000, 25000, 50000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSimulatedExpense(String(amt))}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-border bg-surface dark:bg-background hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-600 transition-colors cursor-pointer"
                >
                  ৳{amt.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Calculation Explanation Card */}
            <div className="p-4 rounded-xl bg-surface-container dark:bg-surface-container/50 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-purple-600" />
                  <span>{language === 'bn' ? 'কর্তন হিসাব সূত্র:' : 'Deduction Formula:'}</span>
                </div>
                <p className="text-xs font-mono font-bold text-foreground">
                  মোট অনুদান (৳{totalDonations.toLocaleString()}) − বর্তমান ব্যয় (৳{totalExpenses.toLocaleString()}) − নতুন ব্যয় (৳{simVal.toLocaleString()})
                </p>
              </div>

              {simVal > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 bg-growth-green hover:bg-[#1b501f] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'মূল হিসাবে সেভ করুন' : 'Save to Ledger'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Live Impact Result Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent p-5 rounded-xl border border-purple-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                  {language === 'bn' ? 'ক্যালকুলেশন ফলাফল' : 'Calculation Result'}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  simulatedRemaining >= 0
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                }`}>
                  {simulatedRemaining >= 0 ? (language === 'bn' ? 'তহবিল নিরাপদ' : 'Fund Safe') : (language === 'bn' ? 'ঘাটতি হবে' : 'Overdraft')}
                </span>
              </div>

              <div className="space-y-2 mt-3">
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>{language === 'bn' ? 'বর্তমান ব্যালেন্স:' : 'Current Balance:'}</span>
                  <span className="font-bold text-foreground">৳{netBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-rose-600 font-bold">
                  <span>{language === 'bn' ? '(−) নতুন প্রস্তাবিত ব্যয়:' : '(−) Proposed Expense:'}</span>
                  <span>− ৳{simVal.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-purple-500/20 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-foreground">
                    {language === 'bn' ? 'খরচের পর অবশিষ্ট থাকবে:' : 'Remaining After Expense:'}
                  </span>
                  <span className={`text-xl font-black ${
                    simulatedRemaining >= 0 ? 'text-purple-700 dark:text-purple-400' : 'text-rose-600'
                  }`}>
                    ৳{simulatedRemaining.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick mini arithmetic keypad for fast receipt math */}
            <div className="mt-4 pt-3 border-t border-purple-500/20">
              <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-2">
                <span className="font-bold">{language === 'bn' ? 'রসিদ যোগ ক্যালকুলেটর:' : 'Quick Math Keypad:'}</span>
                <span className="font-mono font-bold text-purple-700 dark:text-purple-400">
                  {calcDisplay || '0'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {['7', '8', '9', '+', '4', '5', '6', '-', '1', '2', '3', '*', 'C', '0', '=', '/'].map((btn) => (
                  <button
                    key={btn}
                    type="button"
                    onClick={() => handleCalcButton(btn)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      btn === '='
                        ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                        : btn === 'C'
                        ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20'
                        : ['+', '-', '*', '/'].includes(btn)
                        ? 'bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20'
                        : 'bg-surface dark:bg-background text-foreground border-border hover:bg-surface-variant'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXPENSE LEDGER TABLE: DETAILED TRANSACTION RECORDS                        */}
      {/* ========================================================================= */}
      <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-border shadow-xs overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-6 border-b border-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Receipt className="w-5 h-5 text-rose-600" />
                <span>{language === 'bn' ? 'খরচের তালিকা ও হিসাবের খতিয়ান' : 'Expense Ledger & Records'}</span>
                <span className="text-xs bg-rose-500/10 text-rose-600 px-2.5 py-0.5 rounded-full font-bold">
                  {filteredExpenses.length} {language === 'bn' ? 'টি এন্ট্রি' : 'entries'}
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {language === 'bn'
                  ? 'সংগঠনের যাবতীয় ব্যয়ের বিবরণ, খাত, দায়িত্বপ্রাপ্ত ব্যক্তি এবং অনুমোদিত পরিমাণ।'
                  : 'Comprehensive log of all approved charitable project and operational expenses.'}
              </p>
            </div>

            <button
              onClick={() => {
                setErrorMessage('');
                setShowAddModal(true);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'bn' ? 'নতুন খরচ যোগ করুন' : 'Add Expense'}</span>
            </button>
          </div>

          {/* Search, Filter & Sort Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'bn' ? 'খরচের বিবরণ, খাত বা ব্যক্তি খুঁজুন...' : 'Search expenses, categories...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 cursor-pointer"
              >
                <option value="all">{language === 'bn' ? 'সকল খাত (All Categories)' : 'All Categories'}</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort by */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 cursor-pointer"
              >
                <option value="date-desc">{language === 'bn' ? 'তারিখ: নতুন থেকে পুরাতন' : 'Date: Newest First'}</option>
                <option value="date-asc">{language === 'bn' ? 'তারিখ: পুরাতন থেকে নতুন' : 'Date: Oldest First'}</option>
                <option value="amount-desc">{language === 'bn' ? 'পরিমাণ: সর্বোচ্চ থেকে সর্বনিম্ন' : 'Amount: Highest First'}</option>
                <option value="amount-asc">{language === 'bn' ? 'পরিমাণ: সর্বনিম্ন থেকে সর্বোচ্চ' : 'Amount: Lowest First'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50 dark:bg-surface-container/60 border-b border-border text-on-surface-variant font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                <th className="py-3.5 px-4">{language === 'bn' ? 'খরচের বিবরণ ও খাত' : 'Expense Details'}</th>
                <th className="py-3.5 px-4">{language === 'bn' ? 'দায়িত্বপ্রাপ্ত / ব্যয়কারী' : 'Spent By'}</th>
                <th className="py-3.5 px-4">{language === 'bn' ? 'ভাউচার নং' : 'Voucher'}</th>
                <th className="py-3.5 px-4 text-right">{language === 'bn' ? 'ব্যয়ের পরিমাণ (৳)' : 'Amount (৳)'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp) => (
                  <tr
                    key={exp._id}
                    className="hover:bg-surface-variant/40 dark:hover:bg-surface/50 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                        <span>{exp.date}</span>
                      </div>
                    </td>

                    {/* Title & Category */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-foreground text-sm leading-snug">{exp.title}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              CATEGORY_COLORS[exp.category] || 'bg-surface-variant text-foreground border-border'
                            }`}
                          >
                            {exp.category}
                          </span>
                          {exp.notes && (
                            <span className="text-[11px] text-on-surface-variant/80 italic line-clamp-1">
                              • {exp.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Spent By */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-on-surface-variant">
                      {exp.spentBy ? (
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-on-surface-variant/70" />
                          <span className="font-medium text-foreground">{exp.spentBy}</span>
                        </div>
                      ) : (
                        <span className="text-on-surface-variant/50">—</span>
                      )}
                    </td>

                    {/* Voucher */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-on-surface-variant font-mono">
                      {exp.voucherNo ? (
                        <span className="px-2 py-0.5 rounded bg-surface-variant/70 border border-border text-[11px]">
                          {exp.voucherNo}
                        </span>
                      ) : (
                        <span className="text-on-surface-variant/50">—</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
                        − ৳{Number(exp.amount).toLocaleString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingExpense(exp)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                          title="এডিট করুন"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(exp._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-on-surface-variant/40" />
                      <p className="font-bold text-sm">
                        {language === 'bn' ? 'কোনো ব্যয়ের রেকর্ড পাওয়া যায়নি।' : 'No expense records found.'}
                      </p>
                      <p className="text-xs text-on-surface-variant/70">
                        {language === 'bn'
                          ? 'নতুন খরচ রেকর্ড করতে ওপরের "নতুন ব্যয় যুক্ত করুন" বাটনে ক্লিক করুন।'
                          : 'Click "Record Expense" to add your first expenditure entry.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Subtotal Summary Bar */}
        <div className="bg-surface-container-high/40 dark:bg-surface-container/50 p-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-on-surface-variant">
            <span>{language === 'bn' ? 'ফিল্টারকৃত ব্যয়ের মোট রেকর্ড:' : 'Filtered Records:'}</span>{' '}
            <strong className="text-foreground">{filteredExpenses.length} টি</strong>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-on-surface-variant font-medium">
              {language === 'bn' ? 'এই তালিকার মোট খরচ:' : 'Subtotal of Filtered Expenses:'}
            </span>
            <span className="text-base font-black text-rose-600 dark:text-rose-400">
              ৳{filteredTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW EXPENSE                                                    */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-surface-container-lowest dark:bg-surface-container-low border border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-surface-container-low/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-foreground">
                    {language === 'bn' ? 'নতুন ব্যয়ের হিসাব যুক্ত করুন' : 'Record New Expense'}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {language === 'bn' ? 'সংগঠনের খরচের তথ্য লিপিবদ্ধ করুন' : 'Enter expense breakdown & deduction details'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-foreground p-1 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddExpense}>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {language === 'bn' ? 'খরচের বিবরণ / কাজের নাম *' : 'Expense Title / Description *'}
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={simulatedPurpose}
                    placeholder={language === 'bn' ? 'যেমন: অসহায় পরিবারের মাঝে খাদ্য সহায়তা সামগ্রী বিতরণ' : 'e.g., Food relief distribution'}
                    className="w-full px-3.5 py-2.5 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                  />
                </div>

                {/* Amount & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {language === 'bn' ? 'ব্যয়ের পরিমাণ (৳) *' : 'Amount (৳) *'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-rose-600">৳</span>
                      <input
                        type="number"
                        name="amount"
                        required
                        min="1"
                        step="any"
                        defaultValue={simulatedExpense || ''}
                        placeholder="0"
                        className="w-full pl-8 pr-3.5 py-2.5 text-xs font-bold bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-rose-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {language === 'bn' ? 'ব্যয়ের খাত / ক্যাটাগরি *' : 'Expense Category *'}
                    </label>
                    <select
                      name="category"
                      required
                      className="w-full px-3 py-2.5 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date & Spent By */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {language === 'bn' ? 'খরচের তারিখ *' : 'Date of Expense *'}
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      defaultValue={new Date().toISOString().slice(0, 10)}
                      className="w-full px-3.5 py-2.5 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {language === 'bn' ? 'দায়িত্বপ্রাপ্ত ব্যক্তি / কার মাধ্যমে খরচ' : 'Spent By / Coordinator'}
                    </label>
                    <input
                      type="text"
                      name="spentBy"
                      placeholder={language === 'bn' ? 'যেমন: সভাপতি / অর্থ সম্পাদক' : 'e.g., Finance Secretary'}
                      className="w-full px-3.5 py-2.5 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Voucher No */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {language === 'bn' ? 'ভাউচার বা মেমো নং (যদি থাকে)' : 'Voucher / Invoice No (Optional)'}
                  </label>
                  <input
                    type="text"
                    name="voucherNo"
                    placeholder="e.g. VCH-2026-0042"
                    className="w-full px-3.5 py-2.5 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-mono"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {language === 'bn' ? 'অতিরিক্ত মন্তব্য বা নোট' : 'Additional Notes / Remarks'}
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder={language === 'bn' ? 'খরচ সম্পর্কিত কোনো বিশেষ বিবরণ...' : 'Any details about the expense...'}
                    className="w-full px-3.5 py-2 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="bg-surface-variant/40 dark:bg-surface/50 px-6 py-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold border border-border bg-surface dark:bg-background text-foreground hover:bg-surface-variant transition-colors cursor-pointer rounded-xl"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50 rounded-xl"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>{language === 'bn' ? 'ব্যয় সংরক্ষণ করুন' : 'Save Expense'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT EXPENSE                                                       */}
      {/* ========================================================================= */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-surface-container-lowest dark:bg-surface-container-low border border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex items-center justify-between bg-surface-container-low/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-foreground">
                    {language === 'bn' ? 'ব্যয়ের তথ্য এডিট করুন' : 'Edit Expense Record'}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {language === 'bn' ? 'রেকর্ড সংশোধনের পর ব্যালেন্স স্বয়ংক্রিয় আপডেট হবে' : 'Update details to adjust ledger balance'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingExpense(null)}
                className="text-on-surface-variant hover:text-foreground p-1 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditExpense}>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {language === 'bn' ? 'খরচের বিবরণ / কাজের নাম *' : 'Expense Title *'}
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingExpense.title}
                    className="w-full px-3.5 py-2.5 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {language === 'bn' ? 'ব্যয়ের পরিমাণ (৳) *' : 'Amount (৳) *'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-rose-600">৳</span>
                      <input
                        type="number"
                        name="amount"
                        required
                        min="1"
                        step="any"
                        defaultValue={editingExpense.amount}
                        className="w-full pl-8 pr-3.5 py-2.5 text-xs font-bold bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-rose-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {language === 'bn' ? 'ব্যয়ের খাত / ক্যাটাগরি *' : 'Category *'}
                    </label>
                    <select
                      name="category"
                      required
                      defaultValue={editingExpense.category}
                      className="w-full px-3 py-2.5 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {language === 'bn' ? 'খরচের তারিখ *' : 'Date *'}
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      defaultValue={editingExpense.date}
                      className="w-full px-3.5 py-2.5 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {language === 'bn' ? 'দায়িত্বপ্রাপ্ত ব্যক্তি' : 'Spent By'}
                    </label>
                    <input
                      type="text"
                      name="spentBy"
                      defaultValue={editingExpense.spentBy || ''}
                      className="w-full px-3.5 py-2.5 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {language === 'bn' ? 'ভাউচার বা মেমো নং' : 'Voucher No'}
                  </label>
                  <input
                    type="text"
                    name="voucherNo"
                    defaultValue={editingExpense.voucherNo || ''}
                    className="w-full px-3.5 py-2.5 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {language === 'bn' ? 'মন্তব্য বা নোট' : 'Notes'}
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    defaultValue={editingExpense.notes || ''}
                    className="w-full px-3.5 py-2 text-xs bg-surface dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="bg-surface-variant/40 dark:bg-surface/50 px-6 py-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold border border-border bg-surface dark:bg-background text-foreground hover:bg-surface-variant transition-colors cursor-pointer rounded-xl"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50 rounded-xl"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{language === 'bn' ? 'আপডেট করুন' : 'Update Expense'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title={language === 'bn' ? 'ব্যয়ের হিসাব মুছে ফেলতে চান?' : 'Delete Expense Record?'}
        message={
          language === 'bn'
            ? 'এই ব্যয়ের হিসাবটি মুছে ফেললে তা তহবিল থেকে প্রত্যাহার করা হবে এবং অবশিষ্ট ফান্ড থেকে এই টাকা পুনরায় যুক্ত হবে।'
            : 'Deleting this expenditure will refund the amount back into the net balance calculation.'
        }
        confirmText={language === 'bn' ? 'হ্যাঁ, মুছে ফেলুন' : 'Yes, Delete'}
        cancelText={language === 'bn' ? 'বাতিল' : 'Cancel'}
        type="danger"
        loading={isSubmitting}
      />
    </div>
  );
}
