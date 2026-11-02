import { ArrowLeft } from "lucide-react";
import { useTranslation } from "../../../application/hooks/useTranslation";

function SettingsHeader({ title, description, onBack, action }) {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-3 mb-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-[var(--on-solid)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] px-3 py-1.5 rounded-xl shadow-[var(--shadow-soft-small)] active:scale-95 transition shrink-0"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {t("task.back")}
        </button>

        {action}
      </div>

      <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {description}
        </p>
      )}
    </div>
  );
}

export default SettingsHeader;
