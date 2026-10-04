import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";

function InstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("taskflow:install-dismissed") === "true",
  );

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("taskflow:install-dismissed", "true");
    setDismissed(true);
  };

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[150] w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-[var(--surface)] rounded-2xl p-4 shadow-[var(--shadow-soft)] border border-[var(--primary)]/20 flex items-start gap-3">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-[0_6px_14px_rgba(232,135,74,0.35)]">
          <Download size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {t("pwa.installTitle")}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {t("pwa.installDesc")}
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-medium hover:bg-[var(--primary-hover)] transition"
            >
              {t("pwa.install")}
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

export default InstallPrompt;
