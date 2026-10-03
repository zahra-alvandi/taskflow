import { useEffect, useState, useRef, useMemo } from "react";
import {
  Calendar,
  Plus,
  Clock,
  AlertCircle,
  Sparkles,
  X,
  ListChecks,
  Loader2,
  Check
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "../../application/hooks/useTranslation";
import { useNaturalLanguage } from "../../application/hooks/useNaturalLanguage";

import { useAI } from "../../application/hooks/useAI";
import AISuggestionPanel from "./AISuggestionPanel";

function AddTask({ addTask }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [priorityManuallySet, setPriorityManuallySet] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [tags, setTags] = useState([]);
  const [estimatedMinutes, setEstimatedMinutes] = useState(null);

  // AI state
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [aiDismissed, setAiDismissed] = useState(false);

  const textareaRef = useRef(null);
  const parsed = useNaturalLanguage(title);
  const ai = useAI();

  const parsedSubtasks = parsed.subtasks ?? [];
  const [timeResolved, setTimeResolved] = useState(false);

  /* ============================================
     Auto-resize
  ============================================ */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [title]);

  /* ============================================
     NLP auto-fill
  ============================================ */
  useEffect(() => {
    if (parsed.priority && !priorityManuallySet) setPriority(parsed.priority);
  }, [parsed.priority, priorityManuallySet]);

  useEffect(() => {
    if (parsed.dueDate) setDueDate(parsed.dueDate);
  }, [parsed.dueDate]);

  useEffect(() => {
    if (parsed.dueTime) setDueTime(parsed.dueTime);
  }, [parsed.dueTime]);

  useEffect(() => {
    if (parsed.tags.length > 0) {
      setTags((prev) => [...new Set([...prev, ...parsed.tags])]);
    }
  }, [parsed.tags.join(",")]); // eslint-disable-line

  /* ============================================
     Reset AI suggestions when title changes
  ============================================ */
  useEffect(() => {
    setAiSuggestions(null);
    setAiDismissed(false);
  }, [title]);

  /* ============================================
     AI analysis
  ============================================ */
  const handleAskAI = async () => {
    if (!title.trim() || !ai.isAvailable) return;

    const result = await ai.analyzeTask(
      { title: title.trim(), dueDate },
      { existingTags: tags },
    );

    if (result) {
      setAiSuggestions(result);
      setAiDismissed(false);
    }
  };

  /* ============================================
     Apply AI suggestions
  ============================================ */
  const handleApplySuggestions = (patch) => {
    if (patch.priority && !priorityManuallySet) {
      setPriority(patch.priority);
    }
    if (patch.tags) {
      setTags((prev) => [...new Set([...prev, ...patch.tags])]);
    }
    if (patch.estimatedMinutes) {
      setEstimatedMinutes(patch.estimatedMinutes);
    }
    if (patch.subtasks && patch.subtasks.length > 0) {
      const currentText = title;
      const additional = patch.subtasks.filter(
        (s) =>
          !parsedSubtasks.some(
            (ps) => ps.title.toLowerCase() === s.toLowerCase(),
          ),
      );
      if (additional.length > 0) {
        setTitle(currentText + "\n" + additional.join("\n"));
      }
    }
  };

  /* ============================================
     Priority styles
  ============================================ */
  const priorityStyles = {
    high: "text-[var(--danger)] bg-[var(--danger-soft)]",
    medium: "text-[var(--warning)] bg-[var(--warning-soft)]",
    low: "text-[var(--success)] bg-[var(--success-soft)]",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".priority-picker")) {
        setShowPriority(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* ============================================
     Submit
  ============================================ */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: parsed.title || title,
      priority,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      tags,
      subtasks: parsed.subtasks ?? [],
    });

    // reset
    setTitle("");
    setPriority("medium");
    setPriorityManuallySet(false);
    setDueDate("");
    setDueTime("");
    setTimeResolved(false);
    setTags([]);
    setShowPriority(false);
  };

  return (
    <div className="mb-8">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--surface)] p-5 rounded-3xl shadow-[var(--shadow-soft-small)]"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight">{t("task.add")}</h2>
          <Plus size={20} className="text-[var(--primary)]" />
        </div>

        {/* Title + AI button */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            rows={1}
            placeholder={t("task.titlePlaceholder")}
            className="w-full px-4 py-3 pe-12 rounded-xl bg-[var(--app-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none shadow-[var(--shadow-inset)] transition resize-none overflow-hidden"
            style={{ minHeight: "44px" }}
          />

          {/* AI button */}
          {ai.isAvailable && title.trim() && (
            <button
              type="button"
              onClick={handleAskAI}
              disabled={ai.loading}
              className="absolute end-2 top-2 w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center shadow-[0_4px_10px_rgba(99,102,241,0.35)] hover:bg-[var(--primary-hover)] disabled:opacity-60 transition"
              title={t("ai.suggestions")}
            >
              {ai.loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
            </button>
          )}
        </div>

        {/* NLP chips */}
        {parsed.hasAnyMatch && title.trim() && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Sparkles size={14} className="text-[var(--primary)] shrink-0" />
            <span className="text-xs text-[var(--text-muted)] shrink-0">
              {t("task.autoDetected")}:
            </span>

            {parsed.dueDate && (
              <DetectedChip
                icon={<Calendar size={13} />}
                label={new Date(
                  parsed.dueDate + "T00:00:00",
                ).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
                onRemove={() => setDueDate("")}
              />
            )}

            {parsed.dueTime && (
              <DetectedChip
                icon={<Clock size={13} />}
                label={parsed.dueTime}
                onRemove={() => setDueTime("")}
              />
            )}

            {parsed.priority && (
              <DetectedChip
                icon={<AlertCircle size={13} />}
                label={t(`task.priority.${parsed.priority}`)}
                tone={
                  parsed.priority === "high"
                    ? "danger"
                    : parsed.priority === "low"
                      ? "success"
                      : "warning"
                }
                inferred={parsed.inferred.priority}
                onRemove={() => {
                  setPriority("medium");
                  setPriorityManuallySet(true);
                }}
              />
            )}

            {parsed.tags.map((tag) => (
              <DetectedChip
                key={tag}
                label={tag}
                tone="primary"
                onRemove={() =>
                  setTags((prev) => prev.filter((x) => x !== tag))
                }
              />
            ))}
          </div>
        )}

        {parsed.dueTime && (
          <div className="flex items-center gap-1.5">
            <DetectedChip
              icon={<Clock size={13} />}
              label={parsed.dueTime}
              tone={parsed.dueTimeAmbiguous ? "warning" : "neutral"}
              onRemove={() => setDueTime("")}
            />

            {parsed.dueTime && (
              <div className="flex items-center gap-1.5">
                <DetectedChip
                  icon={<Clock size={13} />}
                  label={dueTime || parsed.dueTime}
                  tone={
                    parsed.dueTimeAmbiguous && !timeResolved
                      ? "warning"
                      : "neutral"
                  }
                  onRemove={() => {
                    setDueTime("");
                    setTimeResolved(false);
                  }}
                />

                {parsed.dueTimeAmbiguous && !timeResolved && (
                  <div className="flex items-center gap-1 animate-fade-slide-sm">
                    <span className="text-[10px] text-[var(--warning)] font-medium">
                      {t("task.timeAmbiguous")}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const h = parsed.dueTime.split(":")[0];
                        const m = parsed.dueTime.split(":")[1];
                        const newH = String(Number(h) % 12 || 12).padStart(
                          2,
                          "0",
                        );
                        setDueTime(`${newH}:${m}`);
                        setTimeResolved(true);
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-[var(--warning-soft)] text-[var(--warning)] hover:bg-[var(--warning)]/30 font-medium transition active:scale-95"
                    >
                      {t("task.am")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const h = parsed.dueTime.split(":")[0];
                        const m = parsed.dueTime.split(":")[1];
                        const newH = String((Number(h) % 12) + 12).padStart(
                          2,
                          "0",
                        );
                        setDueTime(`${newH}:${m}`);
                        setTimeResolved(true);
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] font-medium transition active:scale-95"
                    >
                      {t("task.pm")}
                    </button>
                  </div>
                )}

                {parsed.dueTimeAmbiguous && timeResolved && (
                  <span className="text-[10px] text-[var(--success)] font-medium flex items-center gap-1 animate-fade-slide-sm">
                    <Check size={10} strokeWidth={3} />
                    {t("task.timeSet")}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Subtask preview */}
        {parsedSubtasks.length > 0 && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <ListChecks size={13} className="text-[var(--primary)]" />
              <span>
                {parsedSubtasks.length} {t("task.subtasksFound")}:
              </span>
            </div>

            {parsedSubtasks.map((sub, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[var(--app-bg)] text-[var(--text-secondary)] shadow-[var(--shadow-inset)]"
              >
                <span className="w-2.5 h-2.5 rounded-full border border-[var(--text-muted)]/50" />
                {sub.title}
              </span>
            ))}
          </div>
        )}

        {/* ✨ AI Suggestions Panel */}
        {ai.isAvailable &&
          !aiDismissed &&
          (aiSuggestions || ai.loading || ai.error) && (
            <AISuggestionPanel
              suggestions={aiSuggestions}
              loading={ai.loading}
              error={ai.error}
              onApply={handleApplySuggestions}
              onDismiss={() => {
                setAiDismissed(true);
                setAiSuggestions(null);
              }}
            />
          )}

        {/* Manual controls */}
        <div className="flex flex-col lg:flex-row gap-3 mt-4">
          {/* Priority */}
          <div className="priority-picker relative lg:w-32 shrink-0">
            <button
              type="button"
              onClick={() => setShowPriority(!showPriority)}
              className={`w-full px-3 py-3 rounded-xl text-sm font-medium transition ${priorityStyles[priority]}`}
            >
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    priority === "high"
                      ? "bg-[var(--danger)]"
                      : priority === "medium"
                        ? "bg-[var(--warning)]"
                        : "bg-[var(--success)]"
                  }`}
                />
                <span>{t(`task.priority.${priority}`)}</span>
                <span className="text-xs opacity-60">⌄</span>
              </div>
            </button>

            {showPriority && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[var(--surface)] rounded-xl shadow-[var(--shadow-soft)] p-1 z-20">
                {["high", "medium", "low"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setPriority(item);
                      setPriorityManuallySet(true);
                      setShowPriority(false);
                    }}
                    className={`w-full text-start px-3 py-2 rounded-lg text-sm transition ${
                      priority === item
                        ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--app-bg)]"
                    }`}
                  >
                    {t(`task.priority.${item}`)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <DatePicker
            wrapperClassName="lg:w-40 shrink-0"
            selected={dueDate ? new Date(dueDate + "T00:00:00") : null}
            onChange={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                setDueDate(`${year}-${month}-${day}`);
              } else {
                setDueDate("");
              }
            }}
            shouldCloseOnSelect={true}
            dateFormat="MMM d, yyyy"
            placeholderText={t("task.pickDate")}
            customInput={
              <button
                type="button"
                className="w-full px-3 py-3 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm text-[var(--text-secondary)] flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Calendar size={18} />
                <span className="truncate">
                  {dueDate
                    ? new Date(dueDate + "T00:00:00").toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric", year: "numeric" },
                      )
                    : t("task.pickDate")}
                </span>
              </button>
            }
          />

          {/* Add */}
          <button
            type="submit"
            className="lg:w-40 shrink-0 px-5 py-3 rounded-xl bg-[var(--primary)] text-white font-medium flex items-center justify-center gap-2 shadow-[0_6px_14px_rgba(99,102,241,0.28)] hover:bg-[var(--primary-hover)] transition"
          >
            <Plus size={18} />
            {t("task.add")}
          </button>
        </div>
      </form>
    </div>
  );
}

function DetectedChip({
  icon,
  label,
  tone = "neutral",
  inferred = false,
  onRemove,
}) {
  const { t } = useTranslation();

  const tones = {
    neutral: "bg-[var(--app-bg)] text-[var(--text-secondary)]",
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 ps-2.5 pe-1.5 py-1 rounded-lg text-xs font-medium ${tones[tone]}`}
    >
      {icon}
      <span>{label}</span>
      {inferred && (
        <span className="text-[10px] opacity-60 italic">
          {t("task.inferred")}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10 transition"
          aria-label="Remove"
        >
          <X size={11} />
        </button>
      )}
    </span>
  );
}

export default AddTask;
