import { useState } from "react";
import {
  Check,
  Clock,
  Trash2,
  Sparkles,
  ChevronRight,
  ListChecks,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";

function DailyPlanCard({ plan, progress, onOpen, onToggleBlock }) {
  const { t } = useTranslation();
  if (!plan) return null;

  return (
    <div className="mb-6 rounded-3xl bg-gradient-to-br from-[var(--primary)]/8 to-[var(--primary-soft)]/40 border border-[var(--primary)]/20 p-5 shadow-[var(--shadow-soft-small)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-[var(--primary)] flex items-center justify-center shadow-[0_6px_14px_rgba(232,135,74,0.35)]">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-[var(--text-primary)]">
              {t("planner.todayPlan")}
            </h3>
            {plan.summary && (
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">
                {plan.summary}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onOpen}
          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary-soft)] transition"
          aria-label="Open"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-1.5 rounded-full bg-[var(--app-bg)] shadow-[var(--shadow-inset)] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
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

      {/* Next 3 blocks preview */}
      <div className="space-y-1">
        {plan.blocks
          .filter((b) => !b.completed)
          .slice(0, 3)
          .map((block) => (
            <button
              key={block.id}
              onClick={(e) => {
                e.stopPropagation();
                onToggleBlock(block.id);
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-[var(--surface)]/70 hover:bg-[var(--surface)] transition text-start"
            >
              <div className="w-4 h-4 shrink-0 rounded border-2 border-[var(--text-muted)]/50 flex items-center justify-center" />
              {block.startTime && (
                <span className="text-[11px] font-semibold tabular-nums text-[var(--primary)] shrink-0">
                  {block.startTime}
                </span>
              )}
              <span className="text-xs text-[var(--text-secondary)] truncate flex-1">
                {block.taskTitle}
              </span>
            </button>
          ))}

        {progress.completed === progress.total && progress.total > 0 && (
          <p className="text-xs text-[var(--success)] font-medium text-center py-1">
            🎉 {t("planner.allDone")}
          </p>
        )}
      </div>
    </div>
  );
}

export default DailyPlanCard;
