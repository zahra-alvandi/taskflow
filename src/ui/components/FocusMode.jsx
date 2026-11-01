import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Check,
  Pause,
  Play,
  RotateCcw,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { CatEars } from "./CatDecorations";

function FocusMode({ task, onClose, onComplete }) {
  const { t } = useTranslation();

  const [elapsedSec, setElapsedSec] = useState(0);
  const [running, setRunning] = useState(true);

  const accumulatedRef = useRef(0);
  const startedAtRef = useRef(running ? Date.now() : null);
  const rafRef = useRef(null);

  const recompute = useCallback(() => {
    const current = startedAtRef.current
      ? Math.floor((Date.now() - startedAtRef.current) / 1000)
      : 0;
    setElapsedSec(accumulatedRef.current + current);
  }, []);

  useEffect(() => {
    if (!running) return;

    const tick = () => {
      recompute();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // Re-sync on tab visibility (covers long background gaps).
    const onVisibility = () => {
      if (!document.hidden) recompute();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [running, recompute]);

  const toggleRunning = () => {
    if (running) {
      // pause: credit current segment into accumulated
      if (startedAtRef.current) {
        accumulatedRef.current += Math.floor(
          (Date.now() - startedAtRef.current) / 1000,
        );
        startedAtRef.current = null;
      }
      setRunning(false);
    } else {
      startedAtRef.current = Date.now();
      setRunning(true);
    }
  };

  const reset = () => {
    accumulatedRef.current = 0;
    startedAtRef.current = running ? Date.now() : null;
    setElapsedSec(0);
  };

  const handleComplete = () => {
    if (startedAtRef.current) {
      accumulatedRef.current += Math.floor(
        (Date.now() - startedAtRef.current) / 1000,
      );
      startedAtRef.current = null;
    }
    const minutes = Math.max(0, Math.round(accumulatedRef.current / 60));
    onComplete?.(minutes);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[var(--app-bg)] flex flex-col paw-bg-warm">
      <div className="shrink-0 flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <div className="w-7 h-7 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center">
            <Sparkles size={13} className="text-[var(--primary)]" />
          </div>
          <span className="font-medium uppercase tracking-wide">
            {t("focus.modeActive")}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition"
          aria-label={t("task.back")}
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center shadow-[0_12px_30px_rgb(var(--primary-rgb)/0.4)] relative mb-6">
            <CatEars
              size={26}
              className="absolute -top-3 start-1/2 -translate-x-1/2 text-[var(--primary)]"
            />
            <ListChecks size={32} className="text-[var(--on-solid)]" />
          </div>

          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3 leading-tight">
            {task.title}
          </h1>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-inset)] mb-8">
            <div
              className={`w-2 h-2 rounded-full ${
                running
                  ? "bg-[var(--success)] animate-pulse"
                  : "bg-[var(--text-muted)]"
              }`}
            />
            <span className="text-2xl font-bold tabular-nums text-[var(--text-primary)]">
              {formatTime(elapsedSec)}
            </span>
          </div>

          {task.subtasks?.length > 0 && (
            <div className="mb-8 text-start space-y-2">
              {task.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className={`flex items-center gap-3 p-3 rounded-xl bg-[var(--surface)] shadow-[var(--shadow-soft-small)] ${
                    sub.completed ? "opacity-60" : ""
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center ${
                      sub.completed
                        ? "bg-[var(--primary)] text-[var(--on-solid)]"
                        : "border-2 border-[var(--text-muted)]/40"
                    }`}
                  >
                    {sub.completed && <Check size={11} strokeWidth={3} />}
                  </div>
                  <span
                    className={`text-sm ${
                      sub.completed
                        ? "line-through text-[var(--text-muted)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleComplete}
              className="w-full py-4 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--on-solid)] font-semibold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgb(var(--primary-rgb)/0.35)] active:scale-[0.98] transition"
            >
              <Check size={20} strokeWidth={3} />
              {t("focus.markDone")}
            </button>

            <div className="flex gap-2">
              <button
                onClick={toggleRunning}
                className="flex-1 py-3 rounded-2xl bg-[var(--surface)] text-[var(--text-secondary)] font-medium flex items-center justify-center gap-2 shadow-[var(--shadow-soft-small)] hover:text-[var(--text-primary)] transition"
              >
                {running ? <Pause size={16} /> : <Play size={16} />}
                {running ? t("focus.pause") : t("focus.resume")}
              </button>

              <button
                onClick={reset}
                className="px-4 py-3 rounded-2xl bg-[var(--surface)] text-[var(--text-secondary)] shadow-[var(--shadow-soft-small)] hover:text-[var(--text-primary)] transition"
                aria-label={t("actions.discard")}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusMode;
