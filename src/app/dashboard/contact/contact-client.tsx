'use client';

import { useLanguage } from '@/components/language-provider';
import { format } from 'date-fns';
import {
  Mail,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Filter,
  Phone,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { useState, useTransition } from 'react';
import {
  updateContactApprovalStatus,
  updateContactReadStatus,
  deleteContact,
} from '@/app/actions/contact';
import { ConfirmModal } from '@/components/confirm-modal';

export function DashboardContactClient({ messages }: { messages: any[] }) {
  const { language } = useLanguage();
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<string>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleApprovalStatusChange = (
    id: string,
    approvalStatus: 'approved' | 'rejected',
  ) => {
    startTransition(async () => {
      await updateContactApprovalStatus(id, approvalStatus);
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, approvalStatus });
      }
    });
  };

  const handleReadStatusChange = (
    id: string,
    status: 'unread' | 'read' | 'replied',
  ) => {
    startTransition(async () => {
      await updateContactReadStatus(id, status);
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    });
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    startTransition(async () => {
      await deleteContact(deleteTargetId);
      if (selectedMessage && selectedMessage._id === deleteTargetId) {
        setSelectedMessage(null);
      }
      setDeleteTargetId(null);
    });
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch =
      (m.name && m.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.phone && m.phone.includes(searchTerm)) ||
      (m.subject &&
        m.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.message && m.message.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesApproval =
      approvalFilter === 'all' || m.approvalStatus === approvalFilter;
    const matchesRead = readFilter === 'all' || m.status === readFilter;

    return matchesSearch && matchesApproval && matchesRead;
  });

  const pendingCount = messages.filter(
    m => m.approvalStatus === 'pending',
  ).length;
  const approvedCount = messages.filter(
    m => m.approvalStatus === 'approved',
  ).length;
  const rejectedCount = messages.filter(
    m => m.approvalStatus === 'rejected',
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold text-foreground mb-1">
            {language === 'bn' ? 'যোগাযোগ ব্যবস্থাপনা' : 'Contact Management'}
          </h1>
          <p className="text-on-surface-variant font-body-md">
            {language === 'bn'
              ? 'সকল যোগাযোগ বার্তা পর্যালোচনা, অনুমোদন এবং পরিচালনা করুন।'
              : 'Review, approve, and manage all contact messages.'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 px-3 py-2 text-amber-800 dark:text-amber-400 text-sm font-bold rounded-xl">
            {language === 'bn' ? 'পেন্ডিং: ' : 'Pending: '}{' '}
            <span className="text-lg">{pendingCount}</span>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-3 py-2 text-green-800 dark:text-green-400 text-sm font-bold rounded-xl">
            {language === 'bn' ? 'অনুমোদিত: ' : 'Approved: '}{' '}
            <span className="text-lg">{approvedCount}</span>
          </div>
          <div className="bg-surface-variant dark:bg-white/10 px-3 py-2 border border-border font-bold text-sm text-foreground rounded-xl">
            {language === 'bn' ? 'মোট বার্তা: ' : 'Total Messages: '}{' '}
            <span className="text-growth-green">{messages.length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-low dark:bg-surface-container-lowest p-4 border border-border flex flex-col md:flex-row gap-4 items-center justify-between rounded-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'নাম, ইমেইল বা বিষয় দিয়ে খুঁজুন...'
                : 'Search by name, email, subject...'
            }
            className="w-full pl-9 pr-3 py-2 text-sm bg-surface dark:bg-background border border-border focus:outline-none focus:border-growth-green text-foreground rounded-xl"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          {/* Approval Status Tabs */}
          <div className="flex border border-border bg-surface dark:bg-background text-xs rounded-xl overflow-hidden">
            <button
              onClick={() => setApprovalFilter('all')}
              className={`px-3 py-2 font-bold cursor-pointer transition-colors ${approvalFilter === 'all' ? 'bg-growth-green text-white' : 'text-on-surface-variant hover:text-foreground'}`}
            >
              {language === 'bn' ? 'সকল' : 'All'}
            </button>
            <button
              onClick={() => setApprovalFilter('pending')}
              className={`px-3 py-2 font-bold cursor-pointer transition-colors ${approvalFilter === 'pending' ? 'bg-amber-600 text-white' : 'text-on-surface-variant hover:text-foreground'}`}
            >
              {language === 'bn' ? 'পেন্ডিং' : 'Pending'} ({pendingCount})
            </button>
            <button
              onClick={() => setApprovalFilter('approved')}
              className={`px-3 py-2 font-bold cursor-pointer transition-colors ${approvalFilter === 'approved' ? 'bg-green-700 text-white' : 'text-on-surface-variant hover:text-foreground'}`}
            >
              {language === 'bn' ? 'অনুমোদিত' : 'Approved'} ({approvedCount})
            </button>
            <button
              onClick={() => setApprovalFilter('rejected')}
              className={`px-3 py-2 font-bold cursor-pointer transition-colors ${approvalFilter === 'rejected' ? 'bg-red-700 text-white' : 'text-on-surface-variant hover:text-foreground'}`}
            >
              {language === 'bn' ? 'বাতিল' : 'Rejected'} ({rejectedCount})
            </button>
          </div>

          {/* Read Status Filter */}
          <select
            value={readFilter}
            onChange={e => setReadFilter(e.target.value)}
            className="text-xs bg-surface dark:bg-background border border-border px-3 py-2 text-foreground font-bold focus:outline-none rounded-xl cursor-pointer"
          >
            <option value="all">
              {language === 'bn' ? 'পড়ার স্ট্যাটাস: সকল' : 'Read Status: All'}
            </option>
            <option value="unread">
              {language === 'bn' ? 'অপড়া' : 'Unread'}
            </option>
            <option value="read">{language === 'bn' ? 'পড়া' : 'Read'}</option>
            <option value="replied">
              {language === 'bn' ? 'উত্তর দেওয়া' : 'Replied'}
            </option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-surface-container-lowest dark:bg-surface-container-low shadow-sm border border-border overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface dark:bg-background border-b border-border text-on-surface-variant text-xs uppercase font-bold tracking-wider">
                <th className="p-4">
                  {language === 'bn' ? 'প্রেরক' : 'Sender'}
                </th>
                <th className="p-4">
                  {language === 'bn' ? 'বিষয়' : 'Subject'}
                </th>
                <th className="p-4">
                  {language === 'bn' ? 'অনুমোদন' : 'Approval'}
                </th>
                <th className="p-4">
                  {language === 'bn' ? 'পড়ার অবস্থা' : 'Status'}
                </th>
                <th className="p-4">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                <th className="p-4 text-right">
                  {language === 'bn' ? 'অ্যাকশন' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-on-surface-variant"
                  >
                    {language === 'bn'
                      ? 'কোনো বার্তা পাওয়া যায়নি।'
                      : 'No messages found matching your search.'}
                  </td>
                </tr>
              ) : (
                filteredMessages.map((message: any) => (
                  <tr
                    key={message._id}
                    className="hover:bg-surface/60 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-variant dark:bg-white/5 flex items-center justify-center shrink-0 border border-border text-on-surface-variant font-bold rounded-xl">
                          {message.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-sm">
                            {message.name}
                          </div>
                          <div className="text-xs text-on-surface-variant">
                            {message.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-foreground text-sm">
                        {message.subject}
                      </div>
                      <div className="text-xs text-on-surface-variant truncate max-w-[300px]">
                        {message.message}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold capitalize rounded-md ${
                          message.approvalStatus === 'approved'
                            ? 'bg-growth-green/10 text-growth-green'
                            : message.approvalStatus === 'rejected'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}
                      >
                        {message.approvalStatus === 'approved'
                          ? language === 'bn'
                            ? 'অনুমোদিত'
                            : 'Approved'
                          : message.approvalStatus === 'rejected'
                            ? language === 'bn'
                              ? 'বাতিল'
                              : 'Rejected'
                            : language === 'bn'
                              ? 'পেন্ডিং'
                              : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold capitalize rounded-md ${
                          message.status === 'replied'
                            ? 'bg-growth-green/10 text-growth-green'
                            : message.status === 'read'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-surface-variant text-on-surface-variant dark:bg-white/10'
                        }`}
                      >
                        {message.status === 'replied'
                          ? language === 'bn'
                            ? 'উত্তর দেওয়া'
                            : 'Replied'
                          : message.status === 'read'
                            ? language === 'bn'
                              ? 'পড়া'
                              : 'Read'
                            : language === 'bn'
                              ? 'অপড়া'
                              : 'Unread'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant">
                      {message.createdAt
                        ? format(
                            new Date(message.createdAt),
                            'dd MMM yyyy HH:mm',
                          )
                        : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Full Message */}
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="p-1.5 bg-surface-variant hover:bg-surface-variant/80 text-foreground text-xs font-bold transition-colors cursor-pointer rounded-lg"
                          title={
                            language === 'bn' ? 'বার্তা দেখুন' : 'View Message'
                          }
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Approval toggles */}
                        {message.approvalStatus !== 'approved' && (
                          <button
                            disabled={isPending}
                            onClick={() =>
                              handleApprovalStatusChange(
                                message._id,
                                'approved',
                              )
                            }
                            className="px-2 py-1 bg-growth-green hover:bg-[#236026] text-white text-xs font-bold transition-colors cursor-pointer rounded-lg"
                          >
                            {language === 'bn' ? 'অনুমোদন' : 'Approve'}
                          </button>
                        )}
                        {message.approvalStatus !== 'rejected' && (
                          <button
                            disabled={isPending}
                            onClick={() =>
                              handleApprovalStatusChange(
                                message._id,
                                'rejected',
                              )
                            }
                            className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer rounded-lg"
                          >
                            {language === 'bn' ? 'বাতিল' : 'Reject'}
                          </button>
                        )}

                        {/* Mark as read/replied */}
                        {message.status !== 'replied' && (
                          <button
                            disabled={isPending}
                            onClick={() =>
                              handleReadStatusChange(message._id, 'replied')
                            }
                            className="p-1.5 bg-growth-green hover:bg-[#236026] text-white text-xs font-bold transition-colors cursor-pointer rounded-lg"
                            title={
                              language === 'bn'
                                ? 'উত্তর দেওয়া হয়েছে'
                                : 'Mark as Replied'
                            }
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          disabled={isPending}
                          onClick={() => handleDelete(message._id)}
                          className="p-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer rounded-lg"
                          title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
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

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest dark:bg-surface-container-low w-full max-w-2xl border border-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden rounded-xl">
            <div className="flex justify-between items-center p-5 border-b border-border bg-surface dark:bg-surface-container-low">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Mail className="w-5 h-5 text-growth-green" />
                {language === 'bn' ? 'বার্তার বিবরণ' : 'Message Details'}
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-2xl text-on-surface-variant hover:text-foreground transition-colors"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="text-xs uppercase font-bold text-on-surface-variant">
                  {language === 'bn' ? 'প্রেরকের নাম' : 'Sender Name'}
                </label>
                <p className="text-foreground font-bold text-sm mt-1">
                  {selectedMessage.name}
                </p>
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-on-surface-variant">
                  {language === 'bn' ? 'ইমেইল' : 'Email'}
                </label>
                <p className="text-foreground font-bold text-sm mt-1">
                  {selectedMessage.email}
                </p>
              </div>
              {selectedMessage.phone && (
                <div>
                  <label className="text-xs uppercase font-bold text-on-surface-variant">
                    {language === 'bn' ? 'ফোন' : 'Phone'}
                  </label>
                  <p className="text-foreground font-bold text-sm mt-1">
                    {selectedMessage.phone}
                  </p>
                </div>
              )}
              <div>
                <label className="text-xs uppercase font-bold text-on-surface-variant">
                  {language === 'bn' ? 'বিষয়' : 'Subject'}
                </label>
                <p className="text-foreground font-bold text-sm mt-1">
                  {selectedMessage.subject}
                </p>
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-on-surface-variant">
                  {language === 'bn' ? 'বার্তা' : 'Message'}
                </label>
                <p className="text-foreground text-sm mt-1 whitespace-pre-wrap bg-surface dark:bg-background p-3 rounded-lg border border-border">
                  {selectedMessage.message}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase font-bold text-on-surface-variant">
                    {language === 'bn' ? 'অনুমোদনের অবস্থা' : 'Approval Status'}
                  </label>
                  <span
                    className={`inline-block px-2.5 py-1 text-xs font-bold capitalize rounded-md mt-1 ${
                      selectedMessage.approvalStatus === 'approved'
                        ? 'bg-growth-green/10 text-growth-green'
                        : selectedMessage.approvalStatus === 'rejected'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}
                  >
                    {selectedMessage.approvalStatus === 'approved'
                      ? language === 'bn'
                        ? 'অনুমোদিত'
                        : 'Approved'
                      : selectedMessage.approvalStatus === 'rejected'
                        ? language === 'bn'
                          ? 'বাতিল'
                          : 'Rejected'
                        : language === 'bn'
                          ? 'পেন্ডিং'
                          : 'Pending'}
                  </span>
                </div>
                <div>
                  <label className="text-xs uppercase font-bold text-on-surface-variant">
                    {language === 'bn' ? 'পড়ার অবস্থা' : 'Read Status'}
                  </label>
                  <span
                    className={`inline-block px-2.5 py-1 text-xs font-bold capitalize rounded-md mt-1 ${
                      selectedMessage.status === 'replied'
                        ? 'bg-growth-green/10 text-growth-green'
                        : selectedMessage.status === 'read'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-surface-variant text-on-surface-variant dark:bg-white/10'
                    }`}
                  >
                    {selectedMessage.status === 'replied'
                      ? language === 'bn'
                        ? 'উত্তর দেওয়া'
                        : 'Replied'
                      : selectedMessage.status === 'read'
                        ? language === 'bn'
                          ? 'পড়া'
                          : 'Read'
                        : language === 'bn'
                          ? 'অপড়া'
                          : 'Unread'}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-border p-5 bg-surface dark:bg-surface-container-low flex flex-wrap gap-2">
              {selectedMessage.approvalStatus !== 'approved' && (
                <button
                  disabled={isPending}
                  onClick={() =>
                    handleApprovalStatusChange(selectedMessage._id, 'approved')
                  }
                  className="px-4 py-2 bg-growth-green hover:bg-[#236026] text-white font-bold transition-colors cursor-pointer rounded-lg"
                >
                  {language === 'bn' ? 'অনুমোদন করুন' : 'Approve'}
                </button>
              )}
              {selectedMessage.approvalStatus !== 'rejected' && (
                <button
                  disabled={isPending}
                  onClick={() =>
                    handleApprovalStatusChange(selectedMessage._id, 'rejected')
                  }
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors cursor-pointer rounded-lg"
                >
                  {language === 'bn' ? 'বাতিল করুন' : 'Reject'}
                </button>
              )}
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-surface-variant hover:bg-surface-variant/80 text-foreground font-bold transition-colors cursor-pointer rounded-lg"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <ConfirmModal
          isOpen={!!deleteTargetId}
          title={language === 'bn' ? 'বার্তা মুছুন' : 'Delete Message'}
          message={
            language === 'bn'
              ? 'আপনি কি এই বার্তাটি মুছতে চান?'
              : 'Are you sure you want to delete this message?'
          }
          confirmText={language === 'bn' ? 'মুছুন' : 'Delete'}
          type="danger"
          onConfirm={confirmDelete}
          onClose={() => setDeleteTargetId(null)}
          loading={isPending}
        />
      )}
    </div>
  );
}
