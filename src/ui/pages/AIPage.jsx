import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  Wand2,
  AlertCircle,
  Check,
  Trash2,
  Edit2,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { useAI } from "../../application/hooks/useAI";
import {
  buildPlannerContext,
  validatePlan,
} from "../../core/services/plannerService";

function AIPage({
  tasks,
  plan,
  planLoading,
  planProgress,
  onSavePlan,
  onClearPlan,
  onTogglePlanBlock,
  onEditPlanBlock,
  onDeletePlanBlock,
  onBack,
}) {
  const { t } = useTranslation();
  const ai = useAI();

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePlan = async () => {
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
        return { ...b, taskTitle: task?.title ?? b.taskTitle ?? "" };
      });

      await onSavePlan({
        summary: validated.summary,
        blocks: blocksWithTitles,
        skipped: validated.skipped,
      });
    } catch (err) {
      console.error("Plan error:", err);
      setError(err.message ?? t("planner.failed"));
    } finally {
      setGenerating(false);
    }
  };

  if (!ai.isAvailable) {
    return (
      <main className="flex-1 min-w-0 w-full px-4 py-6 pb-32 sm:px-6 md:p-8 md:pb-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition"
          >
            <ArrowLeft size={16} />
            {t("task.back")}
          </button>

          <div className="rounded-3xl bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)] text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-[var(--primary-soft)] flex items-center justify-center mb-4">
              <Sparkles size={28} className="text-[var(--primary)]" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t("ai.title")}</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {t("ai.notConfigured")}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-w-0 w-full px-4 py-6 pb-32 sm:px-6 md:p-8 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {t("task.back")}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center shadow-[0_8px_20px_rgba(99,102,241,0.35)]">
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t("ai.title")}</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {t("ai.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGeneratePlan}
          disabled={generating}
          className="w-full mb-6 py-4 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white font-semibold shadow-[0_8px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_10px_24px_rgba(99,102,241,0.45)] active:scale-[0.98] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {t("planner.thinking")}
            </>
          ) : (
            <>
              <Wand2 size={20} />
              {plan ? t("planner.regenerate") : t("planner.planMyDay")}
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-[var(--danger-soft)]">
            <AlertCircle
              size={18}
              className="text-[var(--danger)] shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-medium text-[var(--danger)]">
                {t("planner.error")}
              </p>
              <p className="text-xs text-[var(--danger)]/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Plan */}
        {plan && !generating && (
          <div className="space-y-4">
            {/* Summary */}
            {plan.summary && (
              <div className="rounded-3xl bg-[var(--primary-soft)]/40 border border-[var(--primary)]/20 p-5">
                <p className="text-sm leading-relaxed">{plan.summary}</p>
              </div>
            )}

            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-[var(--app-bg)] shadow-[var(--shadow-inset)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    planProgress.percent === 100
                      ? "bg-[var(--success)]"
                      : "bg-[var(--primary)]"
                  }`}
                  style={{ width: `${planProgress.percent}%` }}
                />
              </div>
              <span className="text-xs font-medium tabular-nums text-[var(--text-muted)]">
                {planProgress.completed}/{planProgress.total}
              </span>
            </div>

            {/* Blocks */}
            <div className="space-y-2">
              {plan.blocks.map((block) => (
                <PlanBlock
                  key={block.id}
                  block={block}
                  t={t}
                  onToggle={() => onTogglePlanBlock(block.id)}
                  onEdit={(patch) => onEditPlanBlock(block.id, patch)}
                  onDelete={() => onDeletePlanBlock(block.id)}
                />
              ))}
            </div>

            {/* Skipped */}
            {plan.skipped.length > 0 && (
              <details className="group">
                <summary className="cursor-pointer flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] list-none p-2">
                  <ChevronDown
                    size={14}
                    className="group-open:rotate-180 transition-transform"
                  />
                  {plan.skipped.length} {t("planner.skipped")}
                </summary>
                <div className="mt-2 space-y-1.5 ps-4">
                  {plan.skipped.map((s, i) => (
                    <div key={i} className="text-xs text-[var(--text-muted)]">
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

            {/* Clear */}
            <button
              onClick={async () => {
                if (confirm(t("planner.confirmClear"))) {
                  await onClearPlan();
                }
              }}
              className="w-full mt-4 py-3 rounded-2xl text-sm font-medium text-[var(--danger)] bg-[var(--danger-soft)] hover:bg-[var(--danger)]/15 transition flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              {t("planner.clear")}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!plan && !generating && !error && (
          <div className="rounded-3xl bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)] text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {t("planner.empty")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function PlanBlock({ block, t, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
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
      <div className="rounded-2xl bg-[var(--surface)] p-4 shadow-[var(--shadow-soft-small)] space-y-3">
        <p className="text-sm font-medium">{block.taskTitle}</p>
        <div className="flex gap-2">
          <input
            type="time"
            value={draft.startTime}
            onChange={(e) => setDraft({ ...draft, startTime: e.target.value })}
            className="px-3 py-2 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm outline-none flex-1"
          />
          <input
            type="number"
            min="5"
            max="480"
            value={draft.durationMinutes}
            onChange={(e) =>
              setDraft({ ...draft, durationMinutes: Number(e.target.value) })
            }
            className="w-24 px-3 py-2 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm outline-none tabular-nums"
          />
          <span className="text-sm text-[var(--text-muted)] self-center">
            {t("ai.minutes")}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onEdit(draft);
              setEditing(false);
            }}
            className="flex-1 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium"
          >
            {t("actions.save")}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex-1 py-2 rounded-xl bg-[var(--app-bg)] text-[var(--text-secondary)] text-sm font-medium"
          >
            {t("actions.cancel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-stretch gap-3 p-4 rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-soft-small)] border-s-4 transition ${
        priorityTones[block.priority] ?? priorityTones.medium
      } ${block.completed ? "opacity-60" : ""}`}
    >
      <button
        onClick={onToggle}
        className={`w-6 h-6 shrink-0 self-center rounded-lg border-2 flex items-center justify-center transition ${
          block.completed
            ? "bg-[var(--primary)] border-[var(--primary)] text-white"
            : "border-[var(--text-muted)] hover:border-[var(--primary)]"
        }`}
      >
        {block.completed && <Check size={12} strokeWidth={3} />}
      </button>

      <div className="flex flex-col items-center justify-center min-w-[60px] shrink-0">
        {block.startTime && (
          <span
            className={`text-base font-bold tabular-nums ${
              block.completed
                ? "line-through text-[var(--text-muted)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            {block.startTime}
          </span>
        )}
        <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
          {block.durationMinutes}m
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            block.completed
              ? "line-through text-[var(--text-muted)]"
              : "text-[var(--text-primary)]"
          }`}
        >
          {block.taskTitle}
        </p>
        {block.reason && (
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {block.reason}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setEditing(true)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition"
        >
          <Edit2 size={13} />
        </button>
        <button
          onClick={onDelete}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default AIPage;
