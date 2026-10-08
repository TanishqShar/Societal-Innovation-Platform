"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast floating container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";
          const isWarning = toast.type === "warning";

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 ${
                isSuccess
                  ? "bg-emerald-900/90 border-emerald-700 text-white"
                  : isError
                  ? "bg-rose-900/90 border-rose-700 text-white"
                  : isWarning
                  ? "bg-amber-900/90 border-amber-700 text-white"
                  : "bg-slate-900/90 border-slate-700 text-white"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 size={18} className="text-emerald-300" />}
                {isError && <AlertTriangle size={18} className="text-rose-300" />}
                {isWarning && <AlertTriangle size={18} className="text-amber-300" />}
                {!isSuccess && !isError && !isWarning && <Info size={18} className="text-sky-300" />}
              </div>
              <div className="text-sm font-medium flex-1 leading-snug">{toast.message}</div>
              <button
                onClick={() => dismiss(toast.id)}
                className="opacity-70 hover:opacity-100 p-0.5"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
