import { useState, useRef, useEffect } from "react";
import { Plus, Palette, X } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { NOTE_COLORS, getNoteColor } from "../../core/domain/Note";
import PawIcon from "./PawIcon";

function AddNote({ addNote }) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [color, setColor] = useState("cream");
  const [expanded, setExpanded] = useState(false);
  const [showColors, setShowColors] = useState(false);

  const textareaRef = useRef(null);
  const paletteRef = useRef(null);

  const activeColor = getNoteColor(color);

  useEffect(() => {
    if (expanded) textareaRef.current?.focus();
  }, [expanded]);

  useEffect(() => {
    const handler = (e) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target)) {
        setShowColors(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!content.trim()) return;

    addNote({ content, color });
    setContent("");
    setColor("cream");
    setExpanded(false);
    setShowColors(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl shadow-[var(--shadow-soft-small)] transition-all duration-300 "
      style={{
        background: activeColor.bg,
        border: `1px solid ${activeColor.border}`,
      }}
    >
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-full flex items-center gap-3 px-5 py-4 text-start hover:opacity-90 transition"
        >
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: activeColor.accent + "20",
              color: activeColor.accent,
            }}
          >
            <PawIcon size={18} />
          </div>
          <span
            className="text-sm font-medium flex-1"
            style={{ color: activeColor.accent + "cc" }}
          >
            {t("note.addPlaceholder")}
          </span>
          <Plus size={18} style={{ color: activeColor.accent }} />
        </button>
      ) : (
        <div className="p-5">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("note.contentPlaceholder")}
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                handleSubmit();
              }
              if (e.key === "Escape") {
                setExpanded(false);
                setContent("");
                setColor("cream");
              }
            }}
            className="w-full bg-transparent outline-none text-sm resize-none placeholder:opacity-50"
            style={{ color: activeColor.accent }}
          />

          <div
            className="flex items-center justify-between gap-2 mt-3 pt-3 border-t"
            style={{ borderColor: activeColor.border }}
          >
            {/* Color picker */}
            <div ref={paletteRef} className="relative">
              <button
                type="button"
                onClick={() => setShowColors(!showColors)}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition hover:scale-105"
                style={{
                  background: activeColor.accent + "15",
                  color: activeColor.accent,
                }}
              >
                <Palette size={16} />
              </button>

              {showColors && (
                <div className="absolute bottom-1 start-0 mb-2 p-2 bg-[var(--surface)] rounded-2xl shadow-[var(--shadow-soft)] flex gap-1.5 z-50 animate-fade-slide-sm">
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setColor(c.id);
                        setShowColors(false);
                      }}
                      className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${
                        color === c.id
                          ? "ring-2 ring-offset-2 ring-[var(--primary)]"
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

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setExpanded(false);
                  setContent("");
                  setColor("cream");
                  setShowColors(false);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition hover:opacity-70"
                style={{ color: activeColor.accent }}
              >
                {t("actions.cancel")}
              </button>
              <button
                type="submit"
                disabled={!content.trim()}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white shadow-md transition hover:scale-105 active:scale-95 disabled:opacity-40"
                style={{ background: activeColor.accent }}
              >
                {t("actions.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export default AddNote;
