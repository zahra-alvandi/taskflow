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
      await storage.set(key, valid);

      const previous = await storage.get(`${key}.invalid`, []);
      const prev = Array.isArray(previous) ? previous : [];
      const seen = new Set(prev.map((v) => JSON.stringify(v)));
      const merged = [
        ...prev,
        ...invalid.filter((v) => !seen.has(JSON.stringify(v))),
      ];
      await storage.set(`${key}.invalid`, merged);
    } catch {}
    reportStorageIssue({ code: "invalid_items", key, count: invalid.length });
  }

  return valid;
}
