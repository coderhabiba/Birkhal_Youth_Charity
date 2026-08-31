"use client";

import { useLanguage } from "@/components/language-provider";
import { CalendarPlus, MapPin, Clock, Edit, Trash2, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddEventModal } from "./add-event-modal";
import { EditEventModal } from "./edit-event-modal";
import { ConfirmModal, AlertModal } from "@/components/confirm-modal";

export function DashboardEventsClient({ events: initialEvents }: { events: any[] }) {
  const { language } = useLanguage();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>(initialEvents);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [deleteTargetEvent, setDeleteTargetEvent] = useState<{ id: string; title: string } | null>(null);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  const handleDelete = (id: string, title: string) => {
    setDeleteTargetEvent({ id, title });
  };

  const confirmDeleteEvent = async () => {
    if (!deleteTargetEvent) return;
    setDeletingId(deleteTargetEvent.id);
    try {
      const res = await fetch(`/api/events/${deleteTargetEvent.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEvents(events.filter((e) => e._id !== deleteTargetEvent.id));
        setDeleteTargetEvent(null);
        router.refresh();
      } else {
        setDeleteTargetEvent(null);
        setErrorModal(language === "bn" ? "ইভেন্ট মুছে ফেলা সম্ভব হয়নি।" : "Failed to delete event");
      }
    } catch (err) {
      console.error(err);
      setDeleteTargetEvent(null);
      setErrorModal(language === "bn" ? "ইভেন্ট মুছে ফেলার সময় ত্রুটি ঘটেছে।" : "Error deleting event");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-white/5 dark:text-blue-400 border border-blue-200 dark:border-white/10";
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-white/5 dark:text-green-400 border border-green-200 dark:border-white/10";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-white/5 dark:text-gray-400 border border-gray-200 dark:border-white/10";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    if (language === "bn") {
      switch (status) {
        case "upcoming":
          return "আসন্ন";
        case "ongoing":
          return "চলমান";
        case "completed":
          return "সম্পন্ন";
        default:
          return status;
      }
    }
    return status;
  };

  const filteredEvents = events.filter((ev) => {
    const matchesSearch = 
      (ev.title && ev.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ev.location && ev.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ev.description && ev.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || ev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-foreground mb-1">
            {language === "bn" ? "ইভেন্ট ক্যালেন্ডার" : "Events Calendar"}
          </h2>
          <p className="font-body-lg text-on-surface-variant">
            {language === "bn"
              ? "সামাজিক ও সাংগঠনিক ইভেন্ট, কর্মশালা এবং কর্মসূচি পরিচালনা করুন।"
              : "Schedule, edit, and manage organization events and campaigns."}
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-growth-green hover:bg-[#236026] text-white font-label-md px-6 py-2.5 flex items-center gap-2 shadow-sm transition-all cursor-pointer font-bold rounded-xl"
        >
          <CalendarPlus className="w-5 h-5" />
          {language === "bn" ? "নতুন ইভেন্ট তৈরি করুন" : "Create Event"}
        </button>
      </div>

      <AddEventModal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); fetchEvents(); }} />
      <EditEventModal
        event={editingEvent}
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onUpdated={fetchEvents}
      />

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-low dark:bg-surface-container-lowest p-4 border border-border flex flex-col md:flex-row gap-4 items-center justify-between mb-6 rounded-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === "bn" ? "ইভেন্টের নাম বা স্থান দিয়ে খুঁজুন..." : "Search events by title or location..."}
            className="w-full pl-9 pr-3 py-2 text-sm bg-surface dark:bg-background border border-border focus:outline-none focus:border-growth-green text-foreground rounded-xl"
          />
        </div>

        <div className="flex border border-border bg-surface dark:bg-background text-xs rounded-xl overflow-hidden">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-2 font-bold cursor-pointer transition-colors ${statusFilter === "all" ? "bg-growth-green text-white" : "text-on-surface-variant hover:text-foreground"}`}
          >
            {language === "bn" ? "সকল" : "All"} ({events.length})
          </button>
          <button
            onClick={() => setStatusFilter("upcoming")}
            className={`px-3 py-2 font-bold cursor-pointer transition-colors ${statusFilter === "upcoming" ? "bg-blue-600 text-white" : "text-on-surface-variant hover:text-foreground"}`}
          >
            {language === "bn" ? "আসন্ন" : "Upcoming"} ({events.filter(e => e.status === 'upcoming').length})
          </button>
          <button
            onClick={() => setStatusFilter("ongoing")}
            className={`px-3 py-2 font-bold cursor-pointer transition-colors ${statusFilter === "ongoing" ? "bg-green-600 text-white" : "text-on-surface-variant hover:text-foreground"}`}
          >
            {language === "bn" ? "চলমান" : "Ongoing"} ({events.filter(e => e.status === 'ongoing').length})
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-3 py-2 font-bold cursor-pointer transition-colors ${statusFilter === "completed" ? "bg-gray-600 text-white" : "text-on-surface-variant hover:text-foreground"}`}
          >
            {language === "bn" ? "সম্পন্ন" : "Completed"} ({events.filter(e => e.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event: any) => (
          <div
            key={event._id}
            className="bg-surface-container-low dark:bg-surface-container-lowest p-6 shadow-sm border border-border flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow backdrop-blur-md rounded-xl"
          >
            <div className="flex flex-col items-center justify-center bg-surface-variant dark:bg-white/5 border border-border p-4 min-w-[110px] text-center shrink-0 rounded-xl">
              <span className="text-xs font-bold text-growth-green uppercase">
                {format(new Date(event.date), "MMM")}
              </span>
              <span className="text-3xl font-bold text-foreground">
                {format(new Date(event.date), "dd")}
              </span>
              <span className="text-xs text-on-surface-variant mt-1">
                {format(new Date(event.date), "yyyy")}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-headline-md text-xl font-bold text-foreground">{event.title}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 uppercase tracking-wider rounded-md ${getStatusColor(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </span>
                </div>

                <div className="flex flex-col gap-1 mb-3 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1.5 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-growth-green" /> {event.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {format(new Date(event.date), "hh:mm a")}
                  </div>
                </div>

                <p className="text-sm text-foreground mb-4 line-clamp-3 leading-relaxed">{event.description}</p>
              </div>

              <div className="mt-auto flex gap-4 pt-3 border-t border-border">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="flex items-center gap-1.5 text-xs font-bold text-reliability-blue hover:underline cursor-pointer"
                >
                  <Edit className="w-4 h-4" /> {language === "bn" ? "সম্পাদনা" : "Edit"}
                </button>
                <button
                  disabled={deletingId === event._id}
                  onClick={() => handleDelete(event._id, event.title)}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:underline cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" /> {deletingId === event._id ? (language === "bn" ? "মুছছে..." : "Deleting...") : (language === "bn" ? "মুছুন" : "Delete")}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-full py-12 text-center text-on-surface-variant bg-surface-container-low dark:bg-surface-container-lowest border border-dashed border-border backdrop-blur-md rounded-xl">
            {language === "bn"
              ? "কোনো ইভেন্ট পাওয়া যায়নি। নতুন ইভেন্ট তৈরি করতে উপরের বাটনে ক্লিক করুন।"
              : 'No events found. Click "Create Event" to schedule one.'}
          </div>
        )}
      </div>

      {/* Modern Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetEvent}
        onClose={() => setDeleteTargetEvent(null)}
        onConfirm={confirmDeleteEvent}
        title={language === "bn" ? "ইভেন্ট মুছে ফেলার নিশ্চয়তা" : "Delete Event"}
        message={language === "bn" ? `আপনি কি নিশ্চিতভাবে "${deleteTargetEvent?.title}" ইভেন্টটি মুছে ফেলতে চান?` : `Are you sure you want to permanently delete "${deleteTargetEvent?.title}"?`}
        confirmText={language === "bn" ? "হ্যাঁ, মুছে ফেলুন" : "Yes, Delete"}
        cancelText={language === "bn" ? "বাতিল" : "Cancel"}
        type="danger"
        loading={!!deletingId}
      />

      {/* Modern Error Alert Modal */}
      <AlertModal
        isOpen={!!errorModal}
        onClose={() => setErrorModal(null)}
        title={language === "bn" ? "বিজ্ঞপ্তি" : "Notification"}
        message={errorModal || ""}
        type="error"
      />
    </>
  );
}
