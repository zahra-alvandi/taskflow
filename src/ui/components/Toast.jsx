import { useCallback, useEffect, useRef, useState } from "react";
import { X, Check, AlertCircle, AlertTriangle } from "lucide-react";

const TONES = {
  success: {
    accent: "var(--success)",
    iconBg: "bg-[var(--success-soft)]",
    iconColor: "text-[var(--success)]",
    defaultIcon: Check,
  },
  danger: {
    accent: "var(--danger)",
    iconBg: "bg-[var(--danger-soft)]",
    iconColor: "text-[var(--danger)]",
    defaultIcon: AlertCircle,
  },
  warning: {
    accent: "var(--warning)",
    iconBg: "bg-[var(--warning-soft)]",
    iconColor: "text-[var(--warning)]",
    defaultIcon: AlertTriangle,
  },
  default: {
    accent: "var(--primary)",
    iconBg: "bg-[var(--primary-soft)]",
    iconColor: "text-[var(--primary)]",
    defaultIcon: AlertCircle,
  },
};

function Toast({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  const dismissedRef = useRef(false);
  const dismissTimeoutRef = useRef(null);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const duration = Math.max(1, Number(toast.duration) || 4000);
  const tone = TONES[toast.tone] ?? TONES.default;
  const Icon = toast.icon ?? tone.defaultIcon;

  const handleDismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setVisible(false);
    dismissTimeoutRef.current = setTimeout(() => {
      onDismissRef.current?.();
    }, 200);
  }, []);

  const handleAction = () => {
    toast.action?.onClick?.();
    handleDismiss();
  };

  /* Enter animation */
  useEffect(() => {
    let secondFrame;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
    };
  }, []);

  /* Auto dismiss + progress */
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (dismissedRef.current) {
        clearInterval(interval);
        return;
      }
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 * (1 - elapsed / duration));
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        handleDismiss();
      }
    }, 40);
    return () => clearInterval(interval);
  }, [duration, handleDismiss]);

  useEffect(() => {
    return () => {
      if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
    };
  }, []);

  return (
    <div
      role={toast.tone === "danger" ? "alert" : "status"}
      aria-live={toast.tone === "danger" ? "assertive" : "polite"}
      className={`
        pointer-events-auto w-full max-w-sm sm:max-w-md
        transition-all duration-300 ease-out
        ${visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-3 opacity-0 scale-[0.97]"}
      `}
    >
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-[0_10px_32px_rgba(40,30,20,0.12),0_2px_8px_rgba(40,30,20,0.06)] overflow-hidden">
        {/* Main content */}
        <div className="flex items-start gap-3 sm:gap-3.5 p-4 sm:p-5">
          {/* Icon in colored box */}
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl flex items-center justify-center ${tone.iconBg} ${tone.iconColor}`}
          >
            <Icon size={18} strokeWidth={2.5} className="sm:w-5 sm:h-5" />
          </div>

          {/* Title + Description */}
          <div className="flex-1 min-w-0 pe-7">
            <p className="text-sm sm:text-base font-semibold text-[var(--text-primary)] leading-tight">
              {toast.title ?? toast.message}
            </p>
            {toast.description && (
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 sm:mt-1.5 leading-relaxed [overflow-wrap:anywhere]">
                {toast.description}
              </p>
            )}

            {/* Action */}
            {toast.action && (
              <button
                type="button"
                onClick={handleAction}
                className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold transition-opacity hover:opacity-70 active:scale-95"
                style={{ color: tone.accent }}
              >
                {toast.action.label}
              </button>
            )}
          </div>

          {/* Dismiss */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close notification"
            className="absolute top-3 end-3 sm:top-4 sm:end-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--app-bg)] hover:text-[var(--text-primary)] active:scale-90 transition"
          >
            <X size={15} strokeWidth={2} className="sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom accent bar */}
        <div className="relative h-1.5 sm:h-2 bg-[var(--app-bg)]/30">
          <div
            className="absolute start-0 top-0 h-full rounded-e-full transition-[width] duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              backgroundColor: tone.accent,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Toast;
