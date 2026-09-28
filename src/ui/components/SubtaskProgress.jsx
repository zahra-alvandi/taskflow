import { useTranslation } from "../../application/hooks/useTranslation";

function SubtaskProgress({ total, completed }) {
  const { t } = useTranslation();
  if (total === 0) return null;

  const percent = Math.round((completed / total) * 100);
  const isComplete = completed === total;

  return (
    <div className="flex items-center gap-2 mt-2">
      {/* Bar */}
      <div className="flex-1 h-1.5 rounded-full bg-[var(--app-bg)] shadow-[var(--shadow-inset)] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isComplete ? "bg-[var(--success)]" : "bg-[var(--primary)]"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Count */}
      <span
        className={`text-[11px] font-medium tabular-nums ${
          isComplete ? "text-[var(--success)]" : "text-[var(--text-muted)]"
        }`}
      >
        {completed}/{total}
      </span>
    </div>
  );
}

export default SubtaskProgress;
