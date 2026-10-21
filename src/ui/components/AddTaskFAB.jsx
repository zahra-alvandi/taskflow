import { useEffect } from "react";
import { X } from "lucide-react";
import AddTask from "./AddTasks";
import { useModal } from "../context/ModalContext";

function AddTaskModal({ open, onClose, addTask }) {
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (open) {
      openModal();
      return () => closeModal();
    }
  }, [open, openModal, closeModal]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-backdrop-enter"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-2xl bg-[var(--app-bg)] rounded-t-3xl sm:rounded-3xl shadow-[var(--shadow-soft)] max-h-[90vh] overflow-y-auto animate-modal-enter">
        {/* Close Button */}
        <div className="sticky top-0 z-20 bg-[var(--app-bg)]/90 backdrop-blur-md flex justify-end p-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* AddTask Form */}
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
