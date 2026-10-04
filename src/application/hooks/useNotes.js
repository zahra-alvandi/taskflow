import { useCallback, useEffect, useMemo, useState } from "react";
import { createNote, updateNote } from "../../core/domain/Note";

export function useNotes(repository) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await repository.getAll();
    setNotes(all);
    setLoading(false);
  }, [repository]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await repository.getAll();
      if (!cancelled) {
        setNotes(all);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [repository]);

  const addNote = useCallback(
    async (payload) => {
      const note = createNote(payload);
      await repository.save(note);
      await refresh();
      return note;
    },
    [repository, refresh],
  );

  const editNote = useCallback(
    async (id, patch) => {
      const note = notes.find((n) => n.id === id);
      if (!note) return;
      const next = updateNote(note, patch);
      await repository.save(next);
      await refresh();
    },
    [notes, repository, refresh],
  );

  const deleteNote = useCallback(
    async (id) => {
      await repository.delete(id);
      await refresh();
    },
    [repository, refresh],
  );

  const togglePin = useCallback(
    async (id) => {
      const note = notes.find((n) => n.id === id);
      if (!note) return;
      const next = updateNote(note, { pinned: !note.pinned });
      await repository.save(next);
      await refresh();
    },
    [notes, repository, refresh],
  );

  const sorted = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }, [notes]);

  return {
    notes: sorted,
    loading,
    addNote,
    editNote,
    deleteNote,
    togglePin,
    refresh,
  };
}
