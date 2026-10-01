import { useState } from "react";
import {
  Sparkles,
  Loader2,
  X,
  Check,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Wand2,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { useAI } from "../../application/hooks/useAI";
import {
  buildPlannerContext,
  validatePlan,
} from "../../core/services/plannerService";

function DailyPlanner({ tasks }) {
  const { t } = useTranslation();
  const ai = useAI();

  const [plan, setPlan] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!ai.isAvailable) return;

    setLoading(true);
    setError(null);
    setPlan(null);
    setOpen(true);

    try {
      const context = buildPlannerContext(tasks, {
        workStartHour: 9,
        workEndHour: 21,
      });

      if (context.tasks.length === 0) {
        setError(t("planner.noTasks"));
        setLoading(false);
        return;
      }

      const raw = await ai.planDay(context);
      if (!raw) {
        setError(t("planner.failed"));
        setLoading(false);
        return;
      }

      const validated = validatePlan(raw, tasks);
      setPlan(validated);
    } catch (err) {
      console.error("Plan error:", err);
      setError(err.message ?? t("planner.failed"));
    } finally {
      setLoading(false);
    }
  };

  if (!ai.isAvailable) return null;

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white text-sm font-medium shadow-[0_6px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_20px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 transition-all"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Wand2 size={16} />
        )}
        {t("planner.planMyDay")}
      </button>

      {/* Plan Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full sm:max-w-lg max-h-[90vh] bg-[var(--surface)] rounded-t-3xl sm:rounded-3xl shadow-[var(--shadow-soft)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center">
                  <Sparkles size={20} className="text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)]">
                    {t("planner.title")}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {new Date().toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--app-bg)] transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2
                    size={32}
                    className="text-[var(--primary)] animate-spin"
                  />
                  <p className="text-sm text-[var(--text-secondary)]">
                    {t("planner.thinking")}
                  </p>
                </div>
              )}

              {error && !loading && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--danger-soft)]">
                  <AlertCircle
                    size={18}
                    className="text-[var(--danger)] shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-[var(--danger)]">
                      {t("planner.error")}
                    </p>
                    <p className="text-xs text-[var(--danger)]/80 mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {plan && !loading && !error && (
                <>
                  {/* Summary */}
                  {plan.summary && (
                    <div className="mb-4 p-3.5 rounded-2xl bg-[var(--primary-soft)]/40 border border-[var(--primary)]/20">
                      <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                        {plan.summary}
                      </p>
                    </div>
                  )}

                  {/* Total time */}
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-3">
                    <Clock size={13} />
                    <span>
                      {Math.round(plan.totalMinutes / 60)}h{" "}
                      {plan.totalMinutes % 60}m{" · "}
                      {plan.blocks.length} {t("planner.blocks")}
                    </span>
                  </div>

                  {/* Blocks */}
                  <div className="space-y-2">
                    {plan.blocks.map((block) => (
                      <PlanBlock key={block.taskId} block={block} t={t} />
                    ))}
                  </div>

                  {/* Skipped */}
                  {plan.skipped.length > 0 && (
                    <details className="mt-4 group">
                      <summary className="cursor-pointer flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition list-none">
                        <ChevronDown
                          size={13}
                          className="group-open:rotate-180 transition-transform"
                        />
                        {plan.skipped.length} {t("planner.skipped")}
                      </summary>
                      <div className="mt-2 space-y-1.5 ps-2">
                        {plan.skipped.map((s) => (
                          <div
                            key={s.taskId}
                            className="text-xs text-[var(--text-muted)]"
                          >
                            <span className="line-through">{s.title}</span>
                            {s.reason && (
                              <span className="ms-2 italic opacity-70">
                                — {s.reason}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {plan && !loading && (
              <div className="p-4 border-t border-[var(--border)]/40 flex gap-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--app-bg)] shadow-[var(--shadow-inset)] hover:text-[var(--text-primary)] transition"
                >
                  {t("planner.regenerate")}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition"
                >
                  {t("planner.gotIt")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function PlanBlock({ block, t }) {
  const priorityTones = {
    high: "border-s-[var(--danger)]",
    medium: "border-s-[var(--warning)]",
    low: "border-s-[var(--success)]",
  };

  return (
    <div
      className={`flex items-stretch gap-3 p-3 rounded-2xl bg-[var(--app-bg)]/50 border-s-4 ${
        priorityTones[block.priority] ?? priorityTones.medium
      }`}
    >
      {/* Time column */}
      <div className="flex flex-col items-center justify-start gap-1 min-w-[50px] shrink-0">
        {block.startTime ? (
          <>
            <span className="text-sm font-bold text-[var(--text-primary)] tabular-nums">
              {block.startTime}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] tabular-nums">
              {block.durationMinutes}m
            </span>
          </>
        ) : (
          <span className="text-xs text-[var(--text-muted)] tabular-nums">
            {block.durationMinutes}m
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
          {block.taskTitle}
        </p>
        {block.reason && (
          <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
            {block.reason}
          </p>
        )}
        {block.dueTime && (
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-[var(--text-muted)]">
            <Calendar size={10} />
            {t("planner.dueAt")} {block.dueTime}
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyPlanner;
