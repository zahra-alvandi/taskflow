import { useEffect, useState } from "react";
import { Calendar, Plus, Clock, AlertCircle, Sparkles, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "../../application/hooks/useTranslation";
import { useNaturalLanguage } from "../../application/hooks/useNaturalLanguage";

function AddTask({ addTask }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [priorityManuallySet, setPriorityManuallySet] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [tags, setTags] = useState([]);

  const parsed = useNaturalLanguage(title);

  // auto-fill
  useEffect(() => {
    if (parsed.dueDate) setDueDate(parsed.dueDate);
    if (parsed.dueTime) setDueTime(parsed.dueTime);
    if (parsed.tags.length > 0) {
      // merge with manual
      setTags((prev) => [...new Set([...prev, ...parsed.tags])]);
    }
    if (parsed.priority && !priorityManuallySet) {
      setPriority(parsed.priority);
    }
  }, [parsed, priorityManuallySet]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const finalTitle = parsed.hasAnyMatch ? parsed.title : title;
    if (!finalTitle.trim()) return;

    addTask({
      title: finalTitle,
      priority,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      tags,
    });

    // reset
    setTitle("");
    setPriority("medium");
    setPriorityManuallySet(false);
    setDueDate("");
    setDueTime("");
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

        {/* Title */}
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          placeholder={t("task.titlePlaceholder")}
          className="w-full px-4 py-3 rounded-xl bg-[var(--app-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none shadow-[var(--shadow-inset)] transition"
        />

        {/* Live detection preview */}
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
                onRemove={() => {
                  setDueDate("");
                }}
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

        {/* Manual controls */}
        <div className="flex flex-col lg:flex-row gap-3 mt-4">
          <button type="submit">{t("task.add")}</button>
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
