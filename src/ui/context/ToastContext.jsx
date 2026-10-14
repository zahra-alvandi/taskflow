import { createContext, useCallback, useState } from "react";
import { v4 as uuid } from "uuid";

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((options) => {
    const id = uuid();
    const toast = {
      id,
      message: options.message ?? options.title ?? "",
      title: options.title ?? options.message ?? "",
      description: options.description ?? null,
      action: options.action ?? null,
      icon: options.icon ?? null,
      tone: options.tone ?? "default",
      duration: options.duration ?? 4000,
    };
    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, dismissToast, clearToasts }}
    >
      {children}
    </ToastContext.Provider>
  );
}
