import { ArrowLeft } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import AddNote from "../components/AddNote";
import NoteCard from "../components/NoteCard";
import PawIcon from "../components/PawIcon";

function NotesPage({
  notes,
  addNote,
  editNote,
  deleteNote,
  togglePin,
  onBack,
}) {
  const { t } = useTranslation();

  const pinned = notes.filter((n) => n.pinned);
  const others = notes.filter((n) => !n.pinned);

  return (
    <main className="flex-1 min-w-0 w-full px-4 py-6 pb-32 sm:px-6 md:p-8 md:pb-8">
      <div className="max-w-5xl mx-auto">
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
            <div className="w-12 h-12 rounded-2xl bg-[var(--warning-soft)] flex items-center justify-center">
              <PawIcon size={24} className="text-[var(--warning)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t("note.title")}</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {t("note.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Add note */}
        <div className="mb-6 relative z-10">
          <AddNote addNote={addNote} />
        </div>

        {/* Empty state */}
        {notes.length === 0 && (
          <div className="rounded-3xl bg-[var(--surface)] p-12 shadow-[var(--shadow-soft)] text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-[var(--warning-soft)] flex items-center justify-center mb-4">
              <PawIcon size={28} className="text-[var(--warning)]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              {t("note.empty")}
            </p>
          </div>
        )}

        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              {t("note.pinned")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinned.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  editNote={editNote}
                  deleteNote={deleteNote}
                  togglePin={togglePin}
                />
              ))}
            </div>
          </div>
        )}

        {/* Others */}
        {others.length > 0 && (
          <div>
            {pinned.length > 0 && (
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                {t("note.others")}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {others.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  editNote={editNote}
                  deleteNote={deleteNote}
                  togglePin={togglePin}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default NotesPage;
