import { RefreshCw, X } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { useRegisterSW } from "virtual:pwa-register/react";

function UpdatePrompt() {
  const { t } = useTranslation();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 start-4 end-4 md:start-auto md:end-6 md:w-80 z-[150] animate-fade-slide-sm"
    >
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
            type="button"
            onClick={() => updateServiceWorker(true)}
            className="mt-2 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--on-solid)] text-xs font-medium hover:bg-[var(--primary-hover)] transition"
          >
            {t("pwa.update")}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--app-bg)] transition"
          aria-label={t("actions.close")}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default UpdatePrompt;
