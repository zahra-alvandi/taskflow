import { AlertCircle, CalendarClock, CheckCircle2, Star } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";

/**
 * Four compact, clickable counts. Replaces the four large stat cards:
 * same information, a fraction of the space.
 */
function SummaryStrip({ summary, onSelect }) {
  const { t } = useTranslation();

  const items = [
    {
      id: "overdue",
      label: t("dash.summaryOverdue"),
      value: summary.overdue,
      icon: <AlertCircle size={18} />,
      tone: "text-[var(--danger)] bg-[var(--danger-soft)]",
    },
    {
      id: "today",
      label: t("dash.summaryToday"),
      value: summary.today,
      icon: <CalendarClock size={18} />,
      tone: "text-[var(--warning)] bg-[var(--warning-soft)]",
    },
    {
      id: "important",
      label: t("dash.summaryImportant"),
      value: summary.important,
      icon: <Star size={18} />,
      tone: "text-[var(--accent)] bg-[var(--accent-soft)]",
    },
    {
      id: "completed",
      label: t("dash.summaryDone"),
      value: summary.completed,
      icon: <CheckCircle2 size={18} />,
      tone: "text-[var(--success)] bg-[var(--success-soft)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-[var(--surface)] text-start shadow-[var(--shadow-soft-small)] hover:shadow-[var(--shadow-soft-hover)] active:scale-[0.99] transition"
        >
          <span
            className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${item.tone}`}
          >
            {item.icon}
          </span>
          <span className="min-w-0">
            <span className="block text-xl font-semibold leading-none tabular-nums">
              {item.value}
            </span>
            <span className="block text-xs text-[var(--text-secondary)] mt-1 truncate">
              {item.label}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

export default SummaryStrip;
