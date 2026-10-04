import { NoteRepository } from "../../core/ports/NoteRepository";
import { createNote } from "../../core/domain/Note";

const STORAGE_KEY = "notes";

export class LocalNoteRepository extends NoteRepository {
  constructor(storage) {
    super();
    this.storage = storage;
    this._cache = null;
  }

  async _load() {
    if (this._cache) return this._cache;
    const raw = await this.storage.get(STORAGE_KEY, []);
    this._cache = raw.map((n) => createNote(n));
    return this._cache;
  }

  async _persist(notes) {
    this._cache = notes;
    await this.storage.set(STORAGE_KEY, notes);
  }

  async getAll() {
    return await this._load();
  }

  async save(note) {
    const notes = await this._load();
    const idx = notes.findIndex((n) => n.id === note.id);
    if (idx >= 0) {
      const next = [...notes];
      next[idx] = note;
      await this._persist(next);
    } else {
      await this._persist([note, ...notes]);
    }
    return note;
  }

  async delete(id) {
    const notes = await this._load();
    await this._persist(notes.filter((n) => n.id !== id));
  }
}
