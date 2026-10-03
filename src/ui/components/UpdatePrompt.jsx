import { useState, useEffect } from "react";
import { RefreshCw, X } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";

function UpdatePrompt() {
  const { t } = useTranslation();
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    const handler = () => setNeedRefresh(true);
    window.addEventListener("sw-update", handler);
    return () => window.removeEventListener("sw-update", handler);
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-80 z-[150] animate-fade-slide-sm">
      <div className="bg-[var(--surface)] rounded-2xl p-4 shadow-[var(--shadow-soft)] border border-[var(--primary)]/20 flex items-start gap-3">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
          <RefreshCw size={16} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {t("pwa.updateTitle")}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {t("pwa.updateDesc")}
          </p>

          <button
            onClick={handleUpdate}
            className="mt-2 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-medium hover:bg-[var(--primary-hover)] transition"
          >
            {t("pwa.update")}
          </button>
        </div>

        <button
          onClick={() => setNeedRefresh(false)}
          className="w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--app-bg)] transition"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default UpdatePrompt;
