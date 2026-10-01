import { useState, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  X,
  Check,
  Clock,
  AlertCircle,
  ChevronDown,
  Trash2,
  Plus,
  Edit2,
  Wand2,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { useAI } from "../../application/hooks/useAI";
import {
  buildPlannerContext,
  validatePlan,
} from "../../core/services/plannerService";

function DailyPlanner({
  tasks,
  plan,
  loading: planLoading,
  progress,
  onSavePlan,
  onClearPlan,
  onToggleBlock,
  onEditBlock,
  onDeleteBlock,
}) {
  const { t } = useTranslation();
  const ai = useAI();
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [editingBlockId, setEditingBlockId] = useState(null);

  useEffect(() => {
    if (plan) setOpen(true);
  }, [plan]);

  const handleGenerate = async () => {
    if (!ai.isAvailable) return;

    setGenerating(true);
    setError(null);

    try {
      const context = buildPlannerContext(tasks, {
        workStartHour: 9,
        workEndHour: 21,
      });

      if (context.tasks.length === 0) {
        setError(t("planner.noTasks"));
        setGenerating(false);
        return;
      }

      const raw = await ai.planDay(context);
      if (!raw) {
        setError(t("planner.failed"));
        setGenerating(false);
        return;
      }

      const validated = validatePlan(raw, tasks);

      const blocksWithTitles = validated.blocks.map((b) => {
        const task = tasks.find((t) => t.id === b.taskId);
        return {
          ...b,
          taskTitle: task?.title ?? b.taskTitle ?? "",
        };
      });

      await onSavePlan({
        summary: validated.summary,
        blocks: blocksWithTitles,
        skipped: validated.skipped,
      });

      setOpen(true);
    } catch (err) {
      console.error("Plan error:", err);
      setError(err.message ?? t("planner.failed"));
    } finally {
      setGenerating(false);
    }
  };

  if (!ai.isAvailable) return null;

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={plan ? () => setOpen(true) : handleGenerate}
        disabled={generating}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white text-sm font-medium shadow-[0_6px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_20px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 transition-all"
      >
        {generating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Wand2 size={16} />
        )}
        {plan ? t("planner.viewPlan") : t("planner.planMyDay")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] bg-[var(--surface)] rounded-t-3xl sm:rounded-3xl shadow-[var(--shadow-soft)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]/40 shrink-0">
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
              {generating && (
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

              {error && !generating && (
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

              {plan && !generating && !error && (
                <>
                  {/* Summary */}
                  {plan.summary && (
                    <div className="mb-4 p-3.5 rounded-2xl bg-[var(--primary-soft)]/40 border border-[var(--primary)]/20">
                      <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                        {plan.summary}
                      </p>
                    </div>
                  )}

                  {/* Progress + total */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--app-bg)] shadow-[var(--shadow-inset)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          progress.percent === 100
                            ? "bg-[var(--success)]"
                            : "bg-[var(--primary)]"
                        }`}
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium tabular-nums text-[var(--text-muted)]">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>

                  {/* Blocks */}
                  <div className="space-y-2">
                    {plan.blocks.map((block) => (
                      <PlanBlock
                        key={block.id}
                        block={block}
                        t={t}
                        editing={editingBlockId === block.id}
                        onToggle={() => onToggleBlock(block.id)}
                        onStartEdit={() => setEditingBlockId(block.id)}
                        onCancelEdit={() => setEditingBlockId(null)}
                        onSave={(patch) => {
                          onEditBlock(block.id, patch);
                          setEditingBlockId(null);
                        }}
                        onDelete={() => onDeleteBlock(block.id)}
                      />
                    ))}
                  </div>

                  {/* Skipped */}
                  {plan.skipped.length > 0 && (
                    <details className="mt-4 group">
                      <summary className="cursor-pointer flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] list-none">
                        <ChevronDown
                          size={13}
                          className="group-open:rotate-180 transition-transform"
                        />
                        {plan.skipped.length} {t("planner.skipped")}
                      </summary>
                      <div className="mt-2 space-y-1.5 ps-2">
                        {plan.skipped.map((s, i) => (
                          <div
                            key={i}
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
            {plan && !generating && (
              <div className="p-4 border-t border-[var(--border)]/40 flex gap-2 shrink-0">
                <button
                  onClick={async () => {
                    if (confirm(t("planner.confirmClear"))) {
                      await onClearPlan();
                      setOpen(false);
                    }
                  }}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--danger)] bg-[var(--danger-soft)] hover:bg-[var(--danger)]/15 transition"
                  title={t("planner.clear")}
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--app-bg)] shadow-[var(--shadow-inset)] hover:text-[var(--text-primary)] transition"
                >
                  {t("planner.regenerate")}
                </button>
                <button
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

function PlanBlock({
  block,
  t,
  editing,
  onToggle,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
}) {
  const [draft, setDraft] = useState({
    startTime: block.startTime ?? "",
    durationMinutes: block.durationMinutes,
  });

  const priorityTones = {
    high: "border-s-[var(--danger)]",
    medium: "border-s-[var(--warning)]",
    low: "border-s-[var(--success)]",
  };

  if (editing) {
    return (
      <div className="rounded-2xl bg-[var(--app-bg)] p-3 space-y-2">
        <div className="flex gap-2">
          <input
            type="time"
            value={draft.startTime}
            onChange={(e) => setDraft({ ...draft, startTime: e.target.value })}
            className="px-2 py-1.5 rounded-lg bg-[var(--surface)] shadow-[var(--shadow-inset)] text-xs outline-none"
          />
          <input
            type="number"
            min="5"
            max="480"
            value={draft.durationMinutes}
            onChange={(e) =>
              setDraft({ ...draft, durationMinutes: Number(e.target.value) })
            }
            className="w-20 px-2 py-1.5 rounded-lg bg-[var(--surface)] shadow-[var(--shadow-inset)] text-xs outline-none tabular-nums"
          />
          <span className="text-xs text-[var(--text-muted)] self-center">
            {t("ai.minutes")}
          </span>
        </div>
        <p className="text-xs font-medium text-[var(--text-primary)]">
          {block.taskTitle}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onSave(draft)}
            className="flex-1 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-medium"
          >
            {t("actions.save")}
          </button>
          <button
            onClick={onCancelEdit}
            className="flex-1 py-1.5 rounded-lg bg-[var(--surface)] text-[var(--text-secondary)] text-xs font-medium"
          >
            {t("actions.cancel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-stretch gap-3 p-3 rounded-2xl bg-[var(--app-bg)]/50 border-s-4 transition ${
        priorityTones[block.priority] ?? priorityTones.medium
      } ${block.completed ? "opacity-60" : ""}`}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`w-5 h-5 shrink-0 self-center rounded-md border-2 flex items-center justify-center transition ${
          block.completed
            ? "bg-[var(--primary)] border-[var(--primary)] text-white"
            : "border-[var(--text-muted)] hover:border-[var(--primary)]"
        }`}
      >
        {block.completed && <Check size={11} strokeWidth={3} />}
      </button>

      {/* Time */}
      <div className="flex flex-col items-center justify-center min-w-[50px] shrink-0">
        {block.startTime ? (
          <>
            <span
              className={`text-sm font-bold tabular-nums ${
                block.completed
                  ? "line-through text-[var(--text-muted)]"
                  : "text-[var(--text-primary)]"
              }`}
            >
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
        <p
          className={`text-sm font-medium truncate ${
            block.completed
              ? "line-through text-[var(--text-muted)]"
              : "text-[var(--text-primary)]"
          }`}
        >
          {block.taskTitle}
        </p>
        {block.reason && (
          <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
            {block.reason}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onStartEdit}
          className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition"
        >
          <Edit2 size={12} />
        </button>
        <button
          onClick={onDelete}
          className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

export default DailyPlanner;
