import { Repeat, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { WEEKDAYS } from "../../core/services/recurrenceService";

function RecurrenceSection({ value, onChange }) {
  const { t } = useTranslation();

  const currentType = value?.type ?? null;

  const simpleOptions = [
    { type: "daily", labelKey: "recurrence.daily" },
    { type: "weekdays", labelKey: "recurrence.weekdays" },
    { type: "weekly", labelKey: "recurrence.weekly" },
    { type: "biweekly", labelKey: "recurrence.biweekly" },
    { type: "monthly", labelKey: "recurrence.monthly" },
  ];

  const handleSelectSimple = (type) => {
    if (currentType === type) {
      onChange(null);
    } else {
      onChange({ type });
    }
  };

  const handleToggleWeekday = (dayId) => {
    const currentDays =
      value?.type === "custom-weekdays" ? (value.days ?? []) : [];
    let nextDays;

    if (currentDays.includes(dayId)) {
      nextDays = currentDays.filter((d) => d !== dayId);
    } else {
      nextDays = [...currentDays, dayId];
    }

    if (nextDays.length === 0) {
      onChange(null);
    } else {
      onChange({ type: "custom-weekdays", days: nextDays });
    }
  };

  const isWeekdayActive = (dayId) =>
    value?.type === "custom-weekdays" && value.days?.includes(dayId);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium text-[var(--text-muted)] mb-2.5">
          {t("recurrence.specificDays")}
        </p>
        <div className="flex items-center justify-between gap-1">
          {WEEKDAYS.map((day) => {
            const active = isWeekdayActive(day.id);
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => handleToggleWeekday(day.id)}
                className={`w-9 h-9 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                  active
                    ? "bg-[var(--accent)] text-[var(--on-solid)] shadow-[0_2px_8px_rgb(var(--accent-rgb)/0.25)]"
                    : "bg-[var(--app-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {t(`weekdays.short.${day.key}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-[var(--text-muted)] mb-2.5">
          {t("recurrence.quickOptions")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {simpleOptions.map((opt) => {
            const active = currentType === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleSelectSimple(opt.type)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
                  active
                    ? "bg-[var(--accent)] text-[var(--on-solid)] shadow-[0_2px_8px_rgb(var(--accent-rgb)/0.25)]"
                    : "bg-[var(--app-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {t(opt.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="w-full py-2.5 rounded-xl text-[var(--danger)] text-xs font-medium hover:bg-[var(--danger-soft)] transition"
        >
          {t("recurrence.remove")}
        </button>
      )}
    </div>
  );
}

export default RecurrenceSection;
