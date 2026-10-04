import { useState } from "react";
import { Pin, PinOff, Trash2, Check, Palette, Pencil } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { NOTE_COLORS, getNoteColor } from "../../core/domain/Note";
import PawIcon from "./PawIcon";

function NoteCard({ note, editNote, deleteNote, togglePin }) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.content);
  const [showColors, setShowColors] = useState(false);

  const color = getNoteColor(note.color);

  const save = () => {
    if (draft.trim() && draft !== note.content) {
      editNote(note.id, { content: draft.trim() });
    }
    setEditing(false);
  };

  const cancel = () => {
    setDraft(note.content);
    setEditing(false);
  };

  return (
    <div
      className="group relative rounded-3xl p-4 shadow-[var(--shadow-soft-small)] hover:shadow-[var(--shadow-soft)] transition-all min-h-[100px] flex flex-col"
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
      }}
    >
      {/* Paw mark */}
      <div
        className="absolute top-3 end-3 opacity-20 pointer-events-none"
        style={{ color: color.accent }}
      >
        <PawIcon size={14} />
      </div>

      {/* Content */}
      {editing ? (
        <textarea
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Escape") cancel();
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) save();
          }}
          rows={4}
          className="w-full bg-transparent outline-none text-sm resize-none"
          style={{ color: color.accent }}
        />
      ) : (
        <p
          onDoubleClick={() => setEditing(true)}
          className="text-sm whitespace-pre-wrap break-words leading-relaxed cursor-text pe-6 flex-1"
          style={{ color: color.accent }}
        >
          {note.content}
        </p>
      )}

      {/* Date */}
      <p
        className="text-[10px] mt-3 opacity-60"
        style={{ color: color.accent }}
      >
        {new Date(note.updatedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <button
            onClick={() => setShowColors(!showColors)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition hover:scale-110"
            style={{ color: color.accent }}
            title={t("note.changeColor")}
          >
            <Palette size={13} />
          </button>

          {showColors && (
            <div className="absolute bottom-full start-0 mb-2 p-2 bg-[var(--surface)] rounded-2xl shadow-[var(--shadow-soft)] flex gap-1.5 z-50">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    editNote(note.id, { color: c.id });
                    setShowColors(false);
                  }}
                  className={`w-6 h-6 rounded-full transition-all hover:scale-110 ${
                    note.color === c.id
                      ? "ring-2 ring-offset-1 ring-[var(--primary)]"
                      : ""
                  }`}
                  style={{
                    background: c.bg,
                    border: `2px solid ${c.accent}40`,
                  }}
                  aria-label={c.id}
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => togglePin(note.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition hover:scale-110"
          style={{ color: color.accent }}
          title={note.pinned ? t("note.unpin") : t("note.pin")}
        >
          {note.pinned ? <PinOff size={13} /> : <Pin size={13} />}
        </button>

        {editing && (
          <button
            onClick={save}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition hover:scale-110"
            style={{ color: color.accent }}
          >
            <Check size={13} />
          </button>
        )}

        <button
          onClick={() => {
            setDraft(note.content);
            setEditing(true);
          }}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition hover:scale-110"
          style={{ color: color.accent }}
          title={t("actions.edit")}
        >
          <Pencil size={13} />
        </button>

        <button
          onClick={() => deleteNote(note.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center ms-auto transition hover:scale-110"
          style={{ color: color.accent }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
