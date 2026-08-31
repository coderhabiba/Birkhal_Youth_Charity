"use client";

import { AlertTriangle, CheckCircle2, Info, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info" | "success";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type = "danger",
  loading = false,
}: ConfirmModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const defaultConfirmText = type === "danger"
    ? (language === "bn" ? "মুছে ফেলুন (Delete)" : "Delete")
    : (language === "bn" ? "নিশ্চিত করুন" : "Confirm");

  const defaultCancelText = language === "bn" ? "বাতিল (Cancel)" : "Cancel";

  const getIcon = () => {
    switch (type) {
      case "danger":
        return (
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case "warning":
        return (
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case "success":
        return (
          <div className="w-12 h-12 rounded-full bg-growth-green/10 text-growth-green flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-reliability-blue/10 text-reliability-blue flex items-center justify-center shrink-0">
            <Info className="w-6 h-6" />
          </div>
        );
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 text-white";
      case "success":
        return "bg-growth-green hover:bg-[#236026] text-white";
      default:
        return "bg-reliability-blue hover:bg-blue-700 text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-surface-container-lowest dark:bg-surface-container-low border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h3 className="font-headline-md text-lg font-bold text-foreground">
                {title}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-on-surface-variant hover:text-foreground p-1 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-surface-variant/40 dark:bg-surface/50 px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-bold border border-border bg-surface dark:bg-background text-foreground hover:bg-surface-variant transition-colors cursor-pointer disabled:opacity-50 rounded-xl"
          >
            {cancelText || defaultCancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2 text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50 rounded-xl ${getConfirmButtonClass()}`}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText || defaultConfirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
  buttonText?: string;
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
  buttonText,
}: AlertModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm bg-surface-container-lowest dark:bg-surface-container-low border border-border shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-growth-green/10 text-growth-green">
          {type === "success" && <CheckCircle2 className="w-8 h-8" />}
          {type === "error" && <AlertTriangle className="w-8 h-8 text-red-600" />}
          {type === "info" && <Info className="w-8 h-8 text-reliability-blue" />}
        </div>

        <h3 className="font-headline-md text-lg font-bold text-foreground mb-2">
          {title}
        </h3>
        <p className="font-body-md text-xs md:text-sm text-on-surface-variant leading-relaxed mb-6">
          {message}
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-growth-green hover:bg-[#236026] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer rounded-xl"
        >
          {buttonText || (language === "bn" ? "ঠিক আছে (OK)" : "Got it")}
        </button>
      </div>
    </div>
  );
}
