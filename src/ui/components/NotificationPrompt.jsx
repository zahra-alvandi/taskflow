import { useState, useEffect } from "react";
import { Bell, X, AlertCircle } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";

function NotificationPrompt({ onEnable, permission }) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("whiskerly:notif-prompt-dismissed") === "true",
  );

  if (dismissed) return null;
  if (permission === "granted") return null;
  if (permission === "denied") return null;

  const handleEnable = async () => {
    const result = await onEnable();
    if (result === "granted" || result === "denied") {
      setDismissed(true);
      localStorage.setItem("whiskerly:notif-prompt-dismissed", "true");
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("whiskerly:notif-prompt-dismissed", "true");
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 start-4 end-4 md:start-auto md:end-6 md:w-80 z-[150] animate-fade-slide-sm">
      <div className="bg-[var(--surface)] rounded-2xl p-4 shadow-[var(--shadow-soft)] border border-[var(--primary)]/20 flex items-start gap-3">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
          <Bell size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {t("notif.enableTitle")}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
            {t("notif.enableDesc")}
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEnable}
              className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-medium hover:bg-[var(--primary-hover)] active:scale-95 transition"
            >
              {t("notif.enable")}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-lg text-[var(--text-muted)] text-xs font-medium hover:text-[var(--text-primary)] transition"
            >
              {t("notif.later")}
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--app-bg)] transition"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default NotificationPrompt;
