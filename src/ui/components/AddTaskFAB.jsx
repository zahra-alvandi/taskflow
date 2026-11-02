import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import AddTask from "./AddTasks";
import { useModal } from "../context/ModalContext";
import { useTranslation } from "../../application/hooks/useTranslation";

function AddTaskModal({ open, onClose, addTask }) {
  const { openModal, closeModal } = useModal();
  const { t } = useTranslation();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    openModal();

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const focusFrame = requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(focusFrame);
      closeModal();
      previouslyFocused?.focus?.();
    };
  }, [open, openModal, closeModal, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("task.add")}
    >
      <div
        className="absolute inset-0 bg-black/40 animate-backdrop-enter"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full sm:max-w-2xl bg-[var(--app-bg)] rounded-t-3xl sm:rounded-3xl shadow-[var(--shadow-soft)] max-h-[90vh] overflow-y-auto animate-modal-enter outline-none"
      >
        <div className="sticky top-0 z-20 bg-[var(--app-bg)]/90 backdrop-blur-md flex justify-end p-3">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] transition"
            aria-label={t("actions.close")}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pb-6 sm:px-6">
          <AddTask
            addTask={(payload) => {
              addTask(payload);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;
