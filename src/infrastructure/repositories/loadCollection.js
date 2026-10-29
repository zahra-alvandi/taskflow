import { reportStorageIssue } from "../storage/LocalStorageAdapter";


export async function loadCollection(storage, key, factory) {
  const raw = await storage.get(key, []);
  const valid = [];
  const invalid = [];

  if (raw == null) {
    // nothing stored
  } else if (!Array.isArray(raw)) {
    invalid.push(raw); // wrong shape: keep it for recovery, start empty
  } else {
    for (const item of raw) {
      try {
        valid.push(factory(item));
      } catch {
        invalid.push(item);
      }
    }
  }

  if (invalid.length > 0) {
    try {
      const previous = await storage.get(`${key}.invalid`, []);
      await storage.set(`${key}.invalid`, [
        ...(Array.isArray(previous) ? previous : []),
        ...invalid,
      ]);
    } catch {
      /* quarantine is best effort; the original key is untouched until next save */
    }
    reportStorageIssue({ code: "invalid_items", key, count: invalid.length });
  }

  return valid;
}
