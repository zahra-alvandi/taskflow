import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";

function NotificationPrompt({ onEnable }) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("taskflow:notif-dismissed") === "true",
  );
  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    if (typeof Notification === "undefined") {
      setSupported(false);
      return;
    }
    setPermission(Notification.permission);
  }, []);

  if (!supported || dismissed || permission !== "default") return null;

  const handleEnable = async () => {
    const result = await onEnable();
    setPermission(result);
  };

  const handleDismiss = () => {
    localStorage.setItem("taskflow:notif-dismissed", "true");
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 start-4 end-4 md:start-auto md:end-6 md:w-80 z-[150] animate-fade-slide-sm">
      <div className="bg-[var(--surface)] rounded-2xl p-4 shadow-[var(--shadow-soft)] border border-[var(--primary)]/20 flex items-start gap-3">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
          <Bell size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {t("notif.enableTitle")}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {t("notif.enableDesc")}
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEnable}
              className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-medium hover:bg-[var(--primary-hover)] transition"
            >
              {t("notif.enable")}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-lg text-[var(--text-muted)] text-xs font-medium hover:text-[var(--text-primary)] transition"
            >
              {t("actions.cancel")}
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
