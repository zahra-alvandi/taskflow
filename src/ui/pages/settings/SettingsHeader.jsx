import { ArrowLeft } from "lucide-react";
import { useTranslation } from "../../../application/hooks/useTranslation";

function SettingsHeader({ title, description, onBack, action }) {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-3 mb-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm  transition shrink-0 bg-primary hover:scale-105 hover:cursor-pointer px-2 py-1 rounded-xl"
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
