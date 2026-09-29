import {
  Sparkles,
  AlertCircle,
  Clock,
  Tag,
  ListChecks,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { useState, useEffect } from "react";

/**

 * @param {Object} props
 * @param {Object} props.suggestions - { priority, tags, estimatedMinutes, subtasks, reasoning }
 * @param {boolean} props.loading
 * @param {string} props.error
 * @param {Function} props.onApply - (patch) => void
 * @param {Function} props.onDismiss
 */
function AISuggestionPanel({
  suggestions,
  loading,
  error,
  onApply,
  onDismiss,
}) {
  const { t } = useTranslation();
  const [selectedSubtasks, setSelectedSubtasks] = useState(new Set());

  useEffect(() => {
    setSelectedSubtasks(new Set());
  }, [suggestions]);

  const toggleSubtask = (sub) => {
    setSelectedSubtasks((prev) => {
      const next = new Set(prev);
      if (next.has(sub)) next.delete(sub);
      else next.add(sub);
      return next;
    });
  };

  const handleApplySelectedSubtasks = () => {
    if (selectedSubtasks.size === 0) return;
    onApply({ subtasks: [...selectedSubtasks] });
  };

  if (loading) {
    return (
      <div className="mt-3 rounded-2xl bg-[var(--primary-soft)]/40 border border-[var(--primary)]/20 p-3 flex items-center gap-2.5">
        <Loader2
          size={16}
          className="text-[var(--primary)] animate-spin shrink-0"
        />
        <span className="text-xs text-[var(--primary)] font-medium">
          {t("ai.analyzing")}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 rounded-2xl bg-[var(--danger-soft)] p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <AlertCircle size={15} className="text-[var(--danger)] shrink-0" />
          <span className="text-xs text-[var(--danger)] truncate">
            {t("ai.error")}: {error}
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="w-6 h-6 rounded flex items-center justify-center text-[var(--danger)] hover:bg-[var(--danger)]/10 transition shrink-0"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  if (!suggestions) return null;

  const hasAnySuggestion =
    suggestions.priority ||
    (suggestions.tags && suggestions.tags.length > 0) ||
    suggestions.estimatedMinutes ||
    (suggestions.subtasks && suggestions.subtasks.length > 0);

  if (!hasAnySuggestion) return null;

  const handleApplyAll = () => {
    onApply({
      priority: suggestions.priority ?? undefined,
      tags: suggestions.tags ?? undefined,
      estimatedMinutes: suggestions.estimatedMinutes ?? undefined,
      subtasks: suggestions.subtasks ?? undefined,
    });
  };

  return (
    <div className="mt-3 rounded-2xl bg-gradient-to-br from-[var(--primary-soft)]/60 to-[var(--primary-soft)]/20 border border-[var(--primary)]/20 p-3.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-[0_4px_10px_rgba(99,102,241,0.35)]">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {t("ai.suggestions")}
          </span>
        </div>

        <button
          onClick={onDismiss}
          className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/20 transition"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        {/* Priority */}
        {suggestions.priority && (
          <SuggestionRow
            icon={<AlertCircle size={13} />}
            label={t("task.chip.priority")}
            value={t(`task.priority.${suggestions.priority}`)}
            tone={
              suggestions.priority === "high"
                ? "danger"
                : suggestions.priority === "low"
                  ? "success"
                  : "warning"
            }
            onApply={() => onApply({ priority: suggestions.priority })}
          />
        )}

        {/* Time estimate */}
        {suggestions.estimatedMinutes && (
          <SuggestionRow
            icon={<Clock size={13} />}
            label={t("ai.estimatedTime")}
            value={`${suggestions.estimatedMinutes} ${t("ai.minutes")}`}
            tone="neutral"
            onApply={() =>
              onApply({ estimatedMinutes: suggestions.estimatedMinutes })
            }
          />
        )}

        {/* Tags */}
        {suggestions.tags && suggestions.tags.length > 0 && (
          <SuggestionRow
            icon={<Tag size={13} />}
            label={t("task.chip.tag")}
            value={suggestions.tags.join(", ")}
            tone="primary"
            onApply={() => onApply({ tags: suggestions.tags })}
          />
        )}

        {/* Subtasks   */}
        {suggestions.subtasks && suggestions.subtasks.length > 0 && (
          <div className="rounded-xl bg-[var(--surface)] p-2.5 shadow-[var(--shadow-soft-small)]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <ListChecks size={13} className="text-[var(--primary)]" />
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  {t("ai.suggestedSubtasks")}
                </span>
                <span className="text-[10px] font-semibold text-[var(--primary)] bg-[var(--primary-soft)] px-1.5 py-0.5 rounded-full tabular-nums">
                  {selectedSubtasks.size}/{suggestions.subtasks.length}
                </span>
              </div>
              <button
                onClick={handleApplySelectedSubtasks}
                disabled={selectedSubtasks.size === 0}
                className="text-[11px] font-medium text-[var(--primary)] hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t("ai.applySelected")}
              </button>
            </div>

            <div className="space-y-1">
              {suggestions.subtasks.map((sub, idx) => {
                const isSelected = selectedSubtasks.has(sub);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleSubtask(sub)}
                    className={`w-full flex items-center gap-2 ps-2 pe-2 py-1.5 rounded-lg text-xs text-start transition ${
                      isSelected
                        ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--app-bg)]"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 shrink-0 rounded border-2 flex items-center justify-center transition ${
                        isSelected
                          ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                          : "border-[var(--text-muted)]/50"
                      }`}
                    >
                      {isSelected && <Check size={9} strokeWidth={3} />}
                    </span>
                    <span className="truncate">{sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {suggestions.reasoning && (
          <p className="text-[11px] text-[var(--text-muted)] italic px-1">
            {suggestions.reasoning}
          </p>
        )}
      </div>
    </div>
  );
}

function SuggestionRow({ icon, label, value, tone = "neutral", onApply }) {
  const tones = {
    neutral: "text-[var(--text-secondary)] bg-[var(--surface)]",
    primary: "text-[var(--primary)] bg-[var(--surface)]",
    danger: "text-[var(--danger)] bg-[var(--surface)]",
    warning: "text-[var(--warning)] bg-[var(--surface)]",
    success: "text-[var(--success)] bg-[var(--surface)]",
  };

  return (
    <div
      className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-xl shadow-[var(--shadow-soft-small)] ${tones[tone]}`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-[11px] text-[var(--text-muted)] shrink-0">
        {label}:
      </span>
      <span className="text-xs font-medium truncate flex-1 text-[var(--text-primary)]">
        {value}
      </span>
      <button
        onClick={onApply}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-opacity"
        aria-label="Apply"
      >
        <Check size={13} strokeWidth={3} />
      </button>
    </div>
  );
}

export default AISuggestionPanel;
